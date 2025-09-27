#!/usr/bin/env python3
"""
LeetCode Horse Racing Game - Python Web Server
A simple HTTP server to serve the racing game and proxy LeetCode API calls.
"""

import http.server
import socketserver
import json
import urllib.request
import urllib.parse
import urllib.error
from http.server import HTTPServer, SimpleHTTPRequestHandler
import os
import sys
from datetime import datetime

# LeetCode API base URL
LEETCODE_API_BASE = "https://leetcode-api-pied.vercel.app"

class RacingGameHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory="./web", **kwargs)
    
    def do_GET(self):
        if self.path.startswith('/api/'):
            self.handle_api_request()
        else:
            super().do_GET()
    
    def do_POST(self):
        if self.path.startswith('/api/'):
            self.handle_api_request()
        else:
            self.send_error(404)
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def handle_api_request(self):
        """Handle API requests and proxy to LeetCode API"""
        try:
            # Add CORS headers
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            
            if self.path.startswith('/api/user/'):
                # Single user stats
                username = self.path.split('/api/user/')[-1].strip('/')
                if username:
                    stats = self.get_user_stats(username)
                    self.wfile.write(json.dumps(stats).encode())
                else:
                    self.wfile.write(json.dumps({"error": "Username required"}).encode())
            
            elif self.path == '/api/users':
                # Multiple users stats
                if self.command == 'POST':
                    content_length = int(self.headers['Content-Length'])
                    post_data = self.rfile.read(content_length)
                    data = json.loads(post_data.decode())
                    usernames = data.get('usernames', [])
                else:
                    # GET request with query params
                    query = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
                    usernames_param = query.get('usernames', [''])[0]
                    usernames = [u.strip() for u in usernames_param.split(',') if u.strip()]
                
                all_stats = []
                max_solved = 0
                
                for username in usernames:
                    stats = self.get_user_stats(username)
                    all_stats.append(stats)
                    if stats['success'] and stats['totalSolved'] > max_solved:
                        max_solved = stats['totalSolved']
                
                response = {
                    'users': all_stats,
                    'maxSolved': max_solved,
                    'lastUpdated': str(int(datetime.now().timestamp() * 1000))
                }
                self.wfile.write(json.dumps(response).encode())
            
            elif self.path == '/api/race':
                # Race data from config file
                try:
                    with open('./config.json', 'r') as f:
                        config = json.load(f)
                    usernames = config.get('profiles', [])
                    
                    all_stats = []
                    max_solved = 0
                    
                    for username in usernames:
                        stats = self.get_user_stats(username)
                        all_stats.append(stats)
                        if stats['success'] and stats['totalSolved'] > max_solved:
                            max_solved = stats['totalSolved']
                    
                    response = {
                        'users': all_stats,
                        'maxSolved': max_solved,
                        'lastUpdated': str(int(datetime.now().timestamp() * 1000))
                    }
                    self.wfile.write(json.dumps(response).encode())
                except FileNotFoundError:
                    response = {
                        'users': [],
                        'maxSolved': 0,
                        'lastUpdated': str(int(datetime.now().timestamp() * 1000))
                    }
                    self.wfile.write(json.dumps(response).encode())
            
            else:
                self.wfile.write(json.dumps({"error": "Unknown API endpoint"}).encode())
                
        except Exception as e:
            print(f"Error handling API request: {e}")
            response = {"error": str(e)}
            self.wfile.write(json.dumps(response).encode())
    
    def get_user_stats(self, username):
        """Fetch user stats from LeetCode API"""
        try:
            url = f"{LEETCODE_API_BASE}/user/{username}"
            
            with urllib.request.urlopen(url, timeout=30) as response:
                if response.status != 200:
                    return {
                        'username': username,
                        'totalSolved': 0,
                        'success': False,
                        'error': f'API returned status {response.status}'
                    }
                
                data = json.loads(response.read().decode())
                
                # Find total submissions from submitStats
                total_solved = 0
                submit_stats = data.get('submitStats', {})
                ac_submission_num = submit_stats.get('acSubmissionNum', [])
                
                for item in ac_submission_num:
                    if item.get('difficulty') == 'All':
                        total_solved = item.get('count', 0)
                        break
                
                return {
                    'username': username,
                    'totalSolved': total_solved,
                    'success': True
                }
                
        except urllib.error.URLError as e:
            print(f"Network error for {username}: {e}")
            return {
                'username': username,
                'totalSolved': 0,
                'success': False,
                'error': f'Network error: {str(e)}'
            }
        except json.JSONDecodeError as e:
            print(f"JSON decode error for {username}: {e}")
            return {
                'username': username,
                'totalSolved': 0,
                'success': False,
                'error': f'Invalid JSON response: {str(e)}'
            }
        except Exception as e:
            print(f"Unexpected error for {username}: {e}")
            return {
                'username': username,
                'totalSolved': 0,
                'success': False,
                'error': f'Unexpected error: {str(e)}'
            }

def main():
    port = int(os.environ.get('PORT', 8080))
    
    # Change to the directory containing this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)  # Go up one level to project root
    os.chdir(project_root)
    
    print("🏇 LeetCode Horse Racing Game - Python Server")
    print(f"🌐 Starting server on port {port}")
    print(f"📁 Serving from: {os.getcwd()}")
    print(f"🎮 Open your browser to: http://localhost:{port}")
    print("=" * 50)
    
    try:
        with HTTPServer(("", port), RacingGameHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Server error: {e}")

if __name__ == "__main__":
    main()