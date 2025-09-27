# 🏇 LeetCode Horse Racing Game

A real-time horse racing game that visualizes LeetCode problem-solving progress! Each horse represents a LeetCode user, and they advance based on their total solved problems.

## 🎮 Features

- **Real-time Racing**: Horses move forward as users solve more LeetCode problems
- **Beautiful UI**: Colorful, arcade-style design with animated horse sprites
- **Dynamic Scaling**: Race length automatically scales to the user with the most submissions
- **Live Leaderboard**: Real-time ranking of all participants
- **Customizable**: Easy to add/remove users and adjust update intervals
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Quick Start

### Option 1: Run the Python Web Server (Recommended)

1. **Start the web server**:
   ```bash
   cd /Users/adam/Desktop/LeetSignal
   make web
   # OR directly:
   python3 scripts/racing_server.py
   ```

2. **Open your browser** and navigate to:
   ```
   http://localhost:8080
   ```

3. **Configure the race**:
   - Enter LeetCode usernames (comma-separated)
   - Set update interval (5-300 seconds)
   - Click "Apply Configuration"

4. **Start Racing**:
   - Click "Start Race" to begin continuous racing
   - Click "Stop Race" to pause the race
   - Watch horses advance based on real LeetCode submissions!

5. **Test the Race** (Optional):
   - Use the pink test controls to simulate problem solving
   - Select a user and click "+1 Problem Solved" to test movement
   - Remove test controls when done (see REMOVE_TEST_CONTROLS.md)

### Option 2: Direct File Access

1. **Open the HTML file directly**:
   ```bash
   open /Users/adam/Desktop/LeetSignal/web/index.html
   ```

   *Note: This method may have CORS restrictions when fetching LeetCode data*

## 🎯 How It Works

1. **Data Fetching**: The app polls the LeetCode API to get each user's total solved problems
2. **Position Calculation**: Horse positions are calculated as a percentage of the maximum submissions
3. **Real-time Updates**: Positions update automatically based on your configured interval
4. **Winner Detection**: First horse to reach 95% of the track wins with celebration effects!

## 🎨 Horse Sprites

The game uses your existing horse sprite collections:
- **Horse 1**: Uses transparent PNG frames from the horse1 folder
- **Horse 2**: Uses animation frames from the horse2 folder
- **Additional horses**: Cycle through available sprites

Each horse has unique galloping animations with different speeds for visual variety.

## ⚙️ Configuration

### Web Interface
- Use the configuration panel in the web interface to set:
  - LeetCode usernames to track
  - Update interval (how often to check for new submissions)

### Config File (Optional)
Create a `config.json` file in the project root:
```json
{
    "profiles": ["username1", "username2", "username3"],
    "ntfy_topic": "leetcode_race"
}
```

## 🏆 Game Rules

1. **Starting Position**: All horses start at the left side of the track
2. **Movement**: Horses advance based on total LeetCode problems solved
3. **Scaling**: The race scales so the user with the most submissions reaches the finish line
4. **Winning**: First to reach the finish line (95% of track) wins
5. **Continuous Racing**: Race continues until you click "Stop Race"
6. **Real-time**: Updates happen automatically based on your interval setting
7. **Testing**: Use test controls to simulate problem solving for demonstration

## 🛠️ Technical Details

### Frontend (Web UI)
- **HTML5**: Semantic structure with responsive design
- **CSS3**: Animated sprites, gradients, and responsive layouts
- **JavaScript**: Real-time data fetching and race logic

### Backend (Python Server)
- **HTTP Server**: Lightweight Python server serving static files
- **LeetCode API**: Uses the same LeetCode API endpoints as your Go Lambda function
- **Test Support**: Allows manual increments for testing and demonstration

## 🎭 Customization

### Adding More Horse Sprites
1. Create folders `horse3`, `horse4`, etc. in `/sprites/`
2. Add animation frames or static images
3. Update the CSS with new horse classes

### Styling
- Modify `styles.css` to change colors, animations, or layout
- Add new CSS animations for different horse behaviors
- Customize the track background or grandstand appearance

### Game Logic
- Adjust race scaling in `game.js`
- Add new celebration effects
- Implement different scoring systems

## 🐛 Troubleshooting

### Common Issues

**Horses not moving?**
- Check that usernames are valid LeetCode accounts
- Ensure internet connection for API access
- Check browser console for error messages

**CORS errors?**
- Use the Go web server instead of opening HTML directly
- Make sure the server is running on port 8080

**Images not loading?**
- Verify horse sprite files are in the correct `/sprites/` directories
- Check that image paths in CSS match actual file names

**API rate limiting?**
- Increase the update interval to reduce API calls
- The LeetCode API may have rate limits for frequent requests

## 🎉 Have Fun!

Enjoy watching your LeetCode progress in this fun, visual racing format! May the best coder win! 🏆

---

*Built with ❤️ for the competitive programming community*