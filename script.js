let timerDisplay = document.querySelector(".timer");
let startPauseBtn = document.querySelector(".startPause");
let resetBtn = document.querySelector(".reset");
let resetSettingsBtn = document.querySelector(".resetSettings");
let settingBtn = document.querySelector(".setting");
let pomodoroBtn = document.querySelector(".pomodoro");
let shortBreakBtn = document.querySelector(".shortBreak");
let longBreakBtn = document.querySelector(".longBreak");

let settingsModal = document.querySelector(".settingsModal");
let settingsContent = document.querySelector(".settingsContent");
let closeSettingsBtn = document.querySelector(".closeSettings");
let saveSettingsBtn = document.querySelector(".saveSettings");
let pomodoroInput = document.querySelector("#pomodoroDuration");
let shortBreakInput = document.querySelector("#shortBreakDuration");
let longBreakInput = document.querySelector("#longBreakDuration");

let countdown;
let timeLeft = 1500; // Default 25 minutes
let isRunning = false;
let currentMode = "pomodoro"; // Track the current mode
let rotateAngle = 0;

// Default durations
let pomodoroDuration = 1500; // 25 minutes
let shortBreakDuration = 300; // 5 minutes
let longBreakDuration = 600; // 10 minutes

// Update the timer display
function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

// Start or pause the timer
function startPauseTimer() {
    if (isRunning) {
        clearInterval(countdown);
        startPauseBtn.textContent = "Start";
    } else {
        countdown = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                clearInterval(countdown);
                isRunning = false;
                startPauseBtn.textContent = "Start";
                alert("Time's up!");
            }
        }, 1000);
        startPauseBtn.textContent = "Pause";
    }
    isRunning = !isRunning;
}

// Reset the timer to the current mode's duration
function resetTimer() {
    clearInterval(countdown);
    isRunning = false;
    // Reset to the current mode's duration
    switch (currentMode) {
        case "pomodoro":
            timeLeft = 25*60;
            break;
        case "shortBreak":
            timeLeft = shortBreakDuration;
            break;
        case "longBreak":
            timeLeft = longBreakDuration;
            break;
    }
    updateDisplay();
    startPauseBtn.textContent = "Start";
    // Rotate reset button animation
    rotateAngle = rotateAngle >= 360 ? 0 : rotateAngle + 180;
    resetBtn.style.transition = "transform 0.3s ease";
    resetBtn.style.transform = `rotate(${rotateAngle}deg)`;
}

// Set the timer based on the selected mode
function setTimer(time, mode) {
    clearInterval(countdown);
    isRunning = false;
    timeLeft = time;
    currentMode = mode; // Update the current mode
    updateDisplay();
    startPauseBtn.textContent = "Start";

    // Remove active class from all buttons
    pomodoroBtn.classList.remove("active");
    shortBreakBtn.classList.remove("active");
    longBreakBtn.classList.remove("active");

    // Add active class to the selected button
    document.querySelector(`.${mode}`).classList.add("active");
}

// Event listeners for mode buttons
pomodoroBtn.addEventListener("click", () => setTimer(pomodoroDuration, "pomodoro"));
shortBreakBtn.addEventListener("click", () => setTimer(shortBreakDuration, "shortBreak"));
longBreakBtn.addEventListener("click", () => setTimer(longBreakDuration, "longBreak"));

// Event listeners for start/pause and reset buttons
startPauseBtn.addEventListener("click", startPauseTimer);
resetBtn.addEventListener("click", resetTimer);
resetSettingsBtn.addEventListener("click", resetSettings);

// Open settings modal
settingBtn.addEventListener("click", () => {
    settingsModal.classList.remove("hidden");
    settingsModal.style.display = "flex"; // Ensure visibility
    // Populate input fields with current durations
    pomodoroInput.value = pomodoroDuration / 60;
    shortBreakInput.value = shortBreakDuration / 60;
    longBreakInput.value = longBreakDuration / 60;
});

// Close settings modal when clicking the cancel button
closeSettingsBtn.addEventListener("click", () => {
    settingsModal.classList.add("hidden");
    settingsModal.style.display = "none";
});

// Close settings modal when clicking outside the settings content
document.addEventListener("click", (event) => {
    // Check if the click is outside the settingsModal
    if (!settingsModal.contains(event.target) && !settingBtn.contains(event.target)) {
        settingsModal.classList.add("hidden");
        settingsModal.style.display = "none";
    }
});

function resetSettings() {
    // Default durations in minutes
    const defaultPomodoro = 25;
    const defaultShortBreak = 5;
    const defaultLongBreak = 10;

    // Reset input fields to default values
    pomodoroInput.value = defaultPomodoro;
    shortBreakInput.value = defaultShortBreak;
    longBreakInput.value = defaultLongBreak;

    // Update global duration variables (in seconds)
    pomodoroDuration = defaultPomodoro * 60;
    shortBreakDuration = defaultShortBreak * 60;
    longBreakDuration = defaultLongBreak * 60;

    // If the current mode is active, update the timer display
    switch (currentMode) {
        case "pomodoro":
            timeLeft = pomodoroDuration;
            break;
        case "shortBreak":
            timeLeft = shortBreakDuration;
            break;
        case "longBreak":
            timeLeft = longBreakDuration;
            break;
    }

    // Update the timer display
    updateDisplay();
}

// Save settings
saveSettingsBtn.addEventListener("click", () => {
    // Convert decimal input values to total seconds
    let newPomodoroTime = parseFloat(pomodoroInput.value) * 60;
    let newShortBreakTime = parseFloat(shortBreakInput.value) * 60;
    let newLongBreakTime = parseFloat(longBreakInput.value) * 60;

    // Update durations if the values are valid
    if (!isNaN(newPomodoroTime) && newPomodoroTime > 0) pomodoroDuration = newPomodoroTime;
    if (!isNaN(newShortBreakTime) && newShortBreakTime > 0) shortBreakDuration = newShortBreakTime;
    if (!isNaN(newLongBreakTime) && newLongBreakTime > 0) longBreakDuration = newLongBreakTime;

    // Hide the settings modal
    settingsModal.classList.add("hidden");
    settingsModal.style.display = "none";

    // Apply the new time if the user is in the current mode
    switch (currentMode) {
        case "pomodoro":
            timeLeft = pomodoroDuration;
            break;
        case "shortBreak":
            timeLeft = shortBreakDuration;
            break;
        case "longBreak":
            timeLeft = longBreakDuration;
            break;
    }
    updateDisplay();
});

// Ensure Pomodoro is selected on page load
setTimer(pomodoroDuration, "pomodoro");

// Initialize the display
updateDisplay();