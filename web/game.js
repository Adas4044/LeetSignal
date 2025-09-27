class HorseRacingGame {
    constructor() {
        this.usernames = [];
        this.horses = [];
        this.raceData = {};
        this.testData = {}; // For testing increments
        this.isRacing = false;
        this.updateInterval = 30; // seconds
        this.intervalId = null;
        this.maxSubmissions = 0;
        this.raceTrackWidth = 0;
        
        this.initializeElements();
        this.bindEvents();
        this.calculateTrackWidth();
    }

    initializeElements() {
        this.raceTrack = document.getElementById('race-track');
        this.leaderboardList = document.getElementById('leaderboard-list');
        this.startBtn = document.getElementById('start-race');
        this.stopBtn = document.getElementById('stop-race');
        this.resetBtn = document.getElementById('reset-race');
        this.raceStatus = document.getElementById('race-status');
        this.updateTime = document.getElementById('update-time');
        this.usernamesInput = document.getElementById('usernames');
        this.updateIntervalInput = document.getElementById('update-interval');
        this.applyConfigBtn = document.getElementById('apply-config');
        this.loadingOverlay = document.getElementById('loading-overlay');
        
        // Test controls
        this.testIncrementBtn = document.getElementById('test-increment');
        this.testUserSelect = document.getElementById('test-user-select');
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startRace());
        this.stopBtn.addEventListener('click', () => this.stopRace());
        this.resetBtn.addEventListener('click', () => this.resetRace());
        this.applyConfigBtn.addEventListener('click', () => this.applyConfiguration());
        
        // Test controls
        this.testIncrementBtn.addEventListener('click', () => this.testIncrement());
        
        window.addEventListener('resize', () => this.calculateTrackWidth());
    }

    calculateTrackWidth() {
        const trackContainer = document.querySelector('.track-container');
        if (trackContainer) {
            this.raceTrackWidth = trackContainer.offsetWidth - 120; // Account for margins and finish line
            // Ensure minimum width
            if (this.raceTrackWidth < 400) {
                this.raceTrackWidth = 400;
            }
        } else {
            // Fallback width
            this.raceTrackWidth = 800;
        }
    }

    async startRace() {
        if (this.usernames.length === 0) {
            alert('Please add some LeetCode usernames first!');
            return;
        }

        this.isRacing = true;
        this.startBtn.disabled = true;
        this.stopBtn.disabled = false;
        this.raceStatus.textContent = 'Racing in progress...';
        
        // Initialize test data and race data if not exists
        this.usernames.forEach(username => {
            if (!(username in this.testData)) {
                this.testData[username] = 0;
            }
            if (!(username in this.raceData)) {
                this.raceData[username] = 0;
            }
        });
        
        // Update positions immediately with current data
        this.updateHorsePositions();
        this.updateLeaderboard();
        
        // Initial data fetch
        await this.fetchAllData();
        
        // Start continuous updates - race continues until stopped
        this.intervalId = setInterval(() => {
            this.fetchAllData();
        }, this.updateInterval * 1000);
    }

    stopRace() {
        this.isRacing = false;
        this.startBtn.disabled = false;
        this.stopBtn.disabled = true;
        this.raceStatus.textContent = 'Race stopped';
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    resetRace() {
        this.stopRace(); // Stop if running
        this.raceStatus.textContent = 'Ready to start';
        
        // Reset all horse positions
        this.horses.forEach(horse => {
            const horseContainer = horse.element.querySelector('.horse-container');
            horseContainer.style.left = '20px';
            horseContainer.classList.remove('winner');
            horse.element.classList.remove('winner-lane');
        });
        
        this.raceData = {};
        this.testData = {};
        this.maxSubmissions = 0;
        this.updateLeaderboard();
        this.updateTime.textContent = 'Last update: Never';
    }

    testIncrement() {
        const selectedUser = this.testUserSelect.value;
        if (!selectedUser) {
            alert('Please select a user to increment!');
            return;
        }
        
        // Increment test data
        if (!(selectedUser in this.testData)) {
            this.testData[selectedUser] = 0;
        }
        this.testData[selectedUser]++;
        
        // Update race data immediately with the new test increment
        const currentRealData = this.raceData[selectedUser] || 0;
        const testIncrement = this.testData[selectedUser];
        // If we haven't fetched real data yet, assume 0
        const baseSubmissions = currentRealData - (this.testData[selectedUser] - 1 || 0);
        this.raceData[selectedUser] = baseSubmissions + testIncrement;
        
        // Update display immediately
        this.updateHorsePositions();
        this.updateLeaderboard();
        this.updateTime.textContent = `Last update: ${new Date().toLocaleTimeString()} (TEST)`;
        
        console.log(`Test increment: ${selectedUser} now has ${this.raceData[selectedUser]} total problems (${this.testData[selectedUser]} test increments)`);
    }

    applyConfiguration() {
        const usernames = this.usernamesInput.value
            .split(',')
            .map(u => u.trim())
            .filter(u => u.length > 0);
        
        const interval = parseInt(this.updateIntervalInput.value);
        
        if (usernames.length === 0) {
            alert('Please enter at least one username!');
            return;
        }
        
        if (interval < 5 || interval > 300) {
            alert('Update interval must be between 5 and 300 seconds!');
            return;
        }
        
        this.usernames = usernames;
        this.updateInterval = interval;
        
        // Reset race if running
        if (this.isRacing) {
            this.resetRace();
        }
        
        // Create horse lanes
        this.createHorseTrack();
        
        // Update test user select dropdown
        this.updateTestUserSelect();
        
        alert('Configuration applied successfully!');
    }

    createHorseTrack() {
        // Clear existing horses
        this.raceTrack.innerHTML = '';
        this.horses = [];
        
        this.usernames.forEach((username, index) => {
            const horseElement = this.createHorseElement(username, index + 1);
            this.raceTrack.appendChild(horseElement);
            
            this.horses.push({
                username,
                element: horseElement,
                submissions: 0
            });
        });
    }

    createHorseElement(username, horseNumber) {
        const lane = document.createElement('div');
        lane.className = 'horse-lane';
        
        const horseContainer = document.createElement('div');
        horseContainer.className = 'horse-container';
        
        const horseSprite = document.createElement('div');
        horseSprite.className = `horse-sprite horse-${horseNumber} racing`;
        
        const horseInfo = document.createElement('div');
        horseInfo.className = 'horse-info';
        horseInfo.textContent = `${username} (0 solved)`;
        
        horseContainer.appendChild(horseSprite);
        horseContainer.appendChild(horseInfo);
        lane.appendChild(horseContainer);
        
        return lane;
    }

    updateTestUserSelect() {
        this.testUserSelect.innerHTML = '<option value="">Select user to increment</option>';
        this.usernames.forEach(username => {
            const option = document.createElement('option');
            option.value = username;
            option.textContent = username;
            this.testUserSelect.appendChild(option);
        });
    }

    async fetchLeetCodeData(username) {
        try {
            // Using the same API endpoint as your Go application
            const response = await fetch(`https://leetcode-api-pied.vercel.app/user/${username}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Find total submissions from the submitStats
            const allSubmissions = data.submitStats?.acSubmissionNum?.find(
                item => item.difficulty === 'All'
            );
            
            return {
                username,
                totalSolved: allSubmissions ? allSubmissions.count : 0,
                success: true
            };
        } catch (error) {
            console.error(`Error fetching data for ${username}:`, error);
            return {
                username,
                totalSolved: 0,
                success: false,
                error: error.message
            };
        }
    }

    async fetchAllData() {
        this.showLoading(true);
        
        try {
            const promises = this.usernames.map(username => this.fetchLeetCodeData(username));
            const results = await Promise.all(promises);
            
            // Update race data - combine real data with test increments
            results.forEach(result => {
                if (result.success) {
                    const testIncrement = this.testData[result.username] || 0;
                    this.raceData[result.username] = result.totalSolved + testIncrement;
                }
            });
            
            // Find max submissions for scaling
            this.maxSubmissions = Math.max(...Object.values(this.raceData), 1);
            
            // Update horse positions and info
            this.updateHorsePositions();
            this.updateLeaderboard();
            
            this.updateTime.textContent = `Last update: ${new Date().toLocaleTimeString()}`;
            
        } catch (error) {
            console.error('Error fetching race data:', error);
            this.raceStatus.textContent = 'Error fetching data';
        } finally {
            this.showLoading(false);
        }
    }

    updateHorsePositions() {
        // Find the current maximum and minimum submissions
        const allSubmissions = this.horses.map(horse => this.raceData[horse.username] || 0);
        const currentMax = Math.max(...allSubmissions);
        const currentMin = Math.min(...allSubmissions);
        
        // Calculate the range for positioning
        const submissionRange = Math.max(currentMax - currentMin, 1); // Avoid division by zero
        
        // Define track boundaries
        const startPosition = 20; // Starting position
        const finishPosition = this.raceTrackWidth - 120; // Leave space for finish line and horse
        const trackLength = finishPosition - startPosition;
        
        // The leader should be at 85% of the track (close to finish but not at it)
        const leaderTargetPercentage = 0.85;
        
        this.horses.forEach(horse => {
            const submissions = this.raceData[horse.username] || 0;
            horse.submissions = submissions;
            
            let newPosition;
            
            if (currentMax === 0) {
                // If no one has solved any problems, everyone stays at start
                newPosition = startPosition;
            } else if (currentMax === currentMin) {
                // If everyone has the same score, put them all at the leader position
                newPosition = startPosition + (trackLength * leaderTargetPercentage);
            } else {
                // Calculate relative position
                const relativeProgress = (submissions - currentMin) / submissionRange;
                // Scale so the leader is at 85% of track
                const scaledProgress = relativeProgress * leaderTargetPercentage;
                newPosition = startPosition + (trackLength * scaledProgress);
            }
            
            // Update horse position with smooth transition
            const horseContainer = horse.element.querySelector('.horse-container');
            const currentLeft = parseInt(horseContainer.style.left) || 20;
            const newLeft = Math.round(newPosition);
            
            horseContainer.style.left = `${newLeft}px`;
            
            // Update horse info
            const horseInfo = horse.element.querySelector('.horse-info');
            const testIncrement = this.testData[horse.username] || 0;
            const realSolved = submissions - testIncrement;
            const infoText = testIncrement > 0 
                ? `${horse.username} (${realSolved}+${testIncrement} solved)`
                : `${horse.username} (${submissions} solved)`;
            horseInfo.textContent = infoText;
            
            // Check for winner (horse that reaches 95% of track or more)
            const progressPercentage = (newPosition - startPosition) / trackLength;
            if (progressPercentage >= 0.90) {
                horseContainer.classList.add('winner');
                if (!horse.element.classList.contains('winner-lane')) {
                    horse.element.classList.add('winner-lane');
                    this.showWinnerEffect(horse.username);
                }
            } else {
                // Remove winner effects if horse is no longer leading significantly
                horseContainer.classList.remove('winner');
                horse.element.classList.remove('winner-lane');
            }
        });
        
        // Update max submissions for display
        this.maxSubmissions = currentMax;
    }

    updateLeaderboard() {
        // Sort horses by submissions
        const sortedHorses = [...this.horses].sort((a, b) => b.submissions - a.submissions);
        
        this.leaderboardList.innerHTML = '';
        
        sortedHorses.forEach((horse, index) => {
            const entry = document.createElement('div');
            entry.className = 'leaderboard-entry';
            
            if (index === 0) entry.classList.add('first');
            else if (index === 1) entry.classList.add('second');
            else if (index === 2) entry.classList.add('third');
            
            const position = index + 1;
            const medal = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : `${position}.`;
            
            entry.innerHTML = `
                <span>${medal} ${horse.username}</span>
                <span>${horse.submissions} problems solved</span>
            `;
            
            this.leaderboardList.appendChild(entry);
        });
    }

    showWinnerEffect(username) {
        // Create celebration message
        const celebration = document.createElement('div');
        celebration.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #FFD700, #FF6347);
            color: #8B4513;
            padding: 20px 40px;
            border-radius: 20px;
            border: 5px solid #8B4513;
            font-size: 2rem;
            font-weight: bold;
            text-align: center;
            z-index: 1001;
            animation: celebration 3s ease-in-out;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        `;
        celebration.textContent = `🎉 ${username} WINS! 🎉`;
        
        document.body.appendChild(celebration);
        
        // Add celebration keyframes
        if (!document.getElementById('celebration-styles')) {
            const style = document.createElement('style');
            style.id = 'celebration-styles';
            style.textContent = `
                @keyframes celebration {
                    0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                    20% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
                    80% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                    100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Remove after animation
        setTimeout(() => {
            celebration.remove();
        }, 3000);
    }

    showLoading(show) {
        if (show) {
            this.loadingOverlay.classList.add('show');
        } else {
            this.loadingOverlay.classList.remove('show');
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.horseRacingGame = new HorseRacingGame();
    
    // Add some example usernames for demo
    const exampleUsernames = ['alice_codes', 'bob_debug', 'charlie_algo'];
    document.getElementById('usernames').placeholder = exampleUsernames.join(', ');
    
    // Pre-fill for easy testing
    document.getElementById('usernames').value = exampleUsernames.join(', ');
});

// Add CSS for winner effects
const additionalStyles = `
.winner-lane {
    background: linear-gradient(90deg, 
        rgba(255, 215, 0, 0.6) 0%, 
        rgba(255, 165, 0, 0.6) 100%) !important;
    animation: winnerGlow 1s ease-in-out infinite alternate;
}

.winner {
    animation: gallop-cycle-1 0.3s infinite, winnerBounce 0.5s ease-in-out infinite alternate;
}

@keyframes winnerGlow {
    0% { box-shadow: inset 0 0 20px rgba(255, 215, 0, 0.3); }
    100% { box-shadow: inset 0 0 20px rgba(255, 215, 0, 0.8); }
}

@keyframes winnerBounce {
    0% { transform: translateY(0px); }
    100% { transform: translateY(-3px); }
}
`;

const styleElement = document.createElement('style');
styleElement.textContent = additionalStyles;
document.head.appendChild(styleElement);