const display = document.querySelector("#display");

const startButton = document.querySelector("#startButton");
const pauseButton = document.querySelector("#pauseButton");
const playButton = document.querySelector("#playButton");
const resetButton = document.querySelector("#resetButton");

// Variables that aren't used in all pages.
let hoursInput = null;
let minutesInput = null;
let secondsInput = null;
let alertCheckbox = null;
let soundCheckbox = null;
let startingHours = null;
let startingMinutes = null;
let startingSeconds = null;
let isAlertEnabled = null;
let isSoundEnabled = null;
let isWorking = null;

let onTimerPage = true;
let onStopwatchPage = false;
let onPomodoroPage = false;

if (document.querySelector("*[href='index.html'].active")) { // If you're on the timer page : set onTimerPage to true
	onTimerPage = true;
	onStopwatchPage = false;
	onPomodoroPage = false;
} else if (document.querySelector("*[href='stopwatch.html'].active")) { // If you're on the stopwatch page : set onStopwatchPage to true
	onTimerPage = false;
	onStopwatchPage = true;
	onPomodoroPage = false;
} else if (document.querySelector("*[href='pomodoro.html'].active")) { // If you're on the pomodoro page : set onPomodoroPage to true
	onTimerPage = false;
	onStopwatchPage = false;
	onPomodoroPage = true;
}

if (onTimerPage) {
	// Get the time input elements when you're on the timer page and their values
	hoursInput = document.querySelector("#hoursInput");
	minutesInput = document.querySelector("#minutesInput");
	secondsInput = document.querySelector("#secondsInput");
	minutesInput.value = "10"; // Set default values for the inputs (10 minutes)
	startingHours = parseInt(hoursInput.value);
	startingMinutes = parseInt(minutesInput.value);
	startingSeconds = parseInt(secondsInput.value);
	// Get the settings checkbox elements when you're on the timer page and their values (true/false)
	alertCheckbox = document.querySelector("#alertCheckbox");
	soundCheckbox = document.querySelector("#soundCheckbox");
	isAlertEnabled = alertCheckbox.checked;
	isSoundEnabled = soundCheckbox.checked;
} else if (onPomodoroPage) {
	// Get the settings checkbox elements when you're on the pomodoro page and their values (true/false)
	alertCheckbox = document.querySelector("#alertCheckbox");
	soundCheckbox = document.querySelector("#soundCheckbox");
	isAlertEnabled = alertCheckbox.checked;
	isSoundEnabled = soundCheckbox.checked;
}

let time = onTimerPage ? startingHours * 3600 + startingMinutes * 60 + startingSeconds : onPomodoroPage ? 25 * 60 : 0; // If on timer page -> set time to the input values, if on pomodoro page -> set time to 25 minutes (25 * 60 seconds), if on stopwatch page -> set time to 0


let intervalID = 0; // Interval ID for the countdowns and to be able to stop them
let isPaused = true;
let isRunning = false;

if (onPomodoroPage) { isWorking = true; }

// Add event listeners to the click of the buttons
startButton.addEventListener("click", function () { startTimer();});
pauseButton.addEventListener("click", function () { pauseTimer();});
playButton.addEventListener("click", function () { playTimer();});
resetButton.addEventListener("click", function () { resetTimer();});

setInterval(tick, 1);

function tick() { // This function is called every millisecond to update the timer display and the buttons
	renderTimer();

	if (isPaused) {
		pauseButton.style.display = "none";
		playButton.style.display = "inline";
	} else {
		pauseButton.style.display = "inline";
		playButton.style.display = "none";
	}

	if (isRunning) {
		startButton.style.display = "none";
		resetButton.style.display = "inline";
	} else {
		startButton.style.display = "inline";
		pauseButton.style.display = "none";
		playButton.style.display = "none";
		resetButton.style.display = "none";
	}

	if (onTimerPage || onPomodoroPage) {
		isAlertEnabled = alertCheckbox.checked;
		isSoundEnabled = soundCheckbox.checked;
	}
}

function renderTimer() {
	if (!time) {
		time = 0;
	}

	let hours = Math.floor(time / 3600);
	let minutes = Math.floor((time % 3600) / 60);
	let seconds = time % 60;

	hours = hours < 10 ? "0" + hours : hours;
	hours = hours == 0 ? "" : hours + ":"; // If there isn't any hours, don't display them (only display minutes and seconds)
	minutes = minutes < 10 ? "0" + minutes : minutes;
	seconds = seconds < 10 ? "0" + seconds : seconds;

	display.textContent = `${hours}${minutes}:${seconds}`; // Display the timer in the format HH:MM:SS
} 

function updateCountdown() {
	if (onTimerPage || onPomodoroPage) {
		if (time == 0 && !isPaused) { // If there isn't any time left and the timer is not paused / not started
			isRunning = false;
			clearInterval(intervalID); // Stops the countdown (repeat of the updateCountdown function every second)
			if (isSoundEnabled) {
				new Audio("./assets/alarm.mp3").play(); // Play the sound when the timer is over if the checkbox is checked
			}
			if (isAlertEnabled) {
				if (onPomodoroPage) {
					alert(isWorking ? "Work time is over! Let's take a break!" : "Break time is over! Let's get back to work!"); // Alert when the timer is over if the checkbox is checked and if you're in the work state or break state
				} else {
					alert("Time's up!"); // Alert when the timer is over if the checkbox is checked and if you're in the timer page
				}
			}
			if (onPomodoroPage) {
				isWorking = isWorking ? false : true; // Toggle between work and break when the timer is over
			}
			time = onPomodoroPage ? isWorking ? 25 * 60 : 5 * 60 : onTimerPage ? startingHours * 3600 + startingMinutes * 60 + startingSeconds : 0; // If you're on the pomodoro page, set the time to 25 minutes if you're working and 5 minutes if you're on break. If you're on the timer page, set the time to the input values. If you're on the stopwatch page, set the time to 0.
			renderTimer();
		} else if (!isPaused) {
			renderTimer();
			time--; // Decrease the time by 1 second every second when on timer page or pomodoro page
		}
	} else {
		if (!isPaused) {
			renderTimer();
			time++; // Increase the time by 1 second every second when on stopwatch page
		}
	}
}

function startTimer() {
	isPaused = false;

	if (onPomodoroPage) { time = isWorking ? 25 * 60 : 5 * 60; } // 25 minutes for working state, 5 minutes for breaking state

	if (onTimerPage) {
		if (!hoursInput.value || !minutesInput.value || !secondsInput.value) {
			invalidTime(); // Display an alert if the input values are empty
			return;
		}
		
		startingHours = parseInt(hoursInput.value);
		startingMinutes = parseInt(minutesInput.value);
		startingSeconds = parseInt(secondsInput.value);
		
		time = startingHours * 3600 + startingMinutes * 60 + startingSeconds; // Convert the input values to seconds
		
		if (!time) {
			invalidTime(); // Display an alert if the input values are empty, invalid or equal to 0
			return;
		}
	}
	
	if (!isRunning) {intervalID = setInterval(updateCountdown, 1000);} // Start the countdown (repeat of the updateCountdown function every second)
	isRunning = true;
}

function resetTimer() {
	isRunning = false;
	isWorking = true; // Reset the pomodoro state to default values (working state)
	time = onPomodoroPage ? isWorking ? 25 * 60 : 5 * 60 : onTimerPage ? startingHours * 3600 + startingMinutes * 60 + startingSeconds : 0; // If you're on the pomodoro page, set the time to 25 minutes if you're working and 5 minutes if you're on break. If you're on the timer page, set the time to the input values. If you're on the stopwatch page, set the time to 0.
	clearInterval(intervalID); // Stops the countdown (repeat of the updateCountdown function every second)
	renderTimer();
	time = onStopwatchPage ? 0 : time; // If you're on the stopwatch page, set the time to 0 on reset.
}

function pauseTimer() {
	isPaused = true;
}

function playTimer() {
	isPaused = false;
}

function invalidTime() { // Display an alert when called and set the timer to 1 second to be valid (only for the timer page)
	isPaused = true;
	isRunning = false;
	display.textContent = "00:01";
	hoursInput.value = "0";
	minutesInput.value = "0";
	secondsInput.value = "1";
	time = 1;
	alert("Please enter a valid time.");
}