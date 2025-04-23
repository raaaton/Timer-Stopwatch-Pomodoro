const display = document.querySelector("#display");

const startButton = document.querySelector("#startButton");
const pauseButton = document.querySelector("#pauseButton");
const playButton = document.querySelector("#playButton");
const resetButton = document.querySelector("#resetButton");

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

if (document.querySelector("*[href='index.html'].active")) {
	onTimerPage = true;
	onStopwatchPage = false;
	onPomodoroPage = false;
} else if (document.querySelector("*[href='stopwatch.html'].active")) {
	onTimerPage = false;
	onStopwatchPage = true;
	onPomodoroPage = false;
} else if (document.querySelector("*[href='pomodoro.html'].active")) {
	onTimerPage = false;
	onStopwatchPage = false;
	onPomodoroPage = true;
}

if (onTimerPage) {
	hoursInput = document.querySelector("#hoursInput");
	minutesInput = document.querySelector("#minutesInput");
	secondsInput = document.querySelector("#secondsInput");
	startingHours = parseInt(hoursInput.value);
	startingMinutes = parseInt(minutesInput.value);
	startingSeconds = parseInt(secondsInput.value);
	alertCheckbox = document.querySelector("#alertCheckbox");
	soundCheckbox = document.querySelector("#soundCheckbox");
	isAlertEnabled = alertCheckbox.checked;
	isSoundEnabled = soundCheckbox.checked;
} else if (onPomodoroPage) {
	alertCheckbox = document.querySelector("#alertCheckbox");
	soundCheckbox = document.querySelector("#soundCheckbox");
	isAlertEnabled = alertCheckbox.checked;
	isSoundEnabled = soundCheckbox.checked;
}

let time = onTimerPage ? startingHours * 3600 + startingMinutes * 60 + startingSeconds : onPomodoroPage ? 25 * 60 : 0;


let intervalID = 0;
let isPaused = true;
let isRunning = false;

if (onPomodoroPage) { isWorking = true; }

updateCountdown();
setInterval(tick, 1);

startButton.addEventListener("click", function () { startTimer();});
pauseButton.addEventListener("click", function () { pauseTimer();});
playButton.addEventListener("click", function () { playTimer();});
resetButton.addEventListener("click", function () { resetTimer();});

function tick() {
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

	console.log(onTimerPage ? "Timer" : onStopwatchPage ? "Stopwatch" : onPomodoroPage ? "Pomodoro" : "none");
}

function renderTimer() {
	if (!time) {
		time = 0;
	}

	let hours = Math.floor(time / 3600);
	let minutes = Math.floor((time % 3600) / 60);
	let seconds = time % 60;

	hours = hours < 10 ? "0" + hours : hours;
	hours = hours == 0 ? "" : hours + ":";
	minutes = minutes < 10 ? "0" + minutes : minutes;
	seconds = seconds < 10 ? "0" + seconds : seconds;

	display.textContent = `${hours}${minutes}:${seconds}`;
} 

function updateCountdown() {
	if (onTimerPage || onPomodoroPage) {
		if (time == 0 && !isPaused) {
			isRunning = false;
			clearInterval(intervalID);
			if (isSoundEnabled) {
				new Audio("./assets/alarm.mp3").play();
			}
			if (isAlertEnabled) {
				if (onPomodoroPage) {
					alert(isWorking ? "Work time is over! Let's take a break!" : "Break time is over! Let's get back to work!");
				} else {
					alert("Time's up!");
				}
			}
			if (onPomodoroPage) {
				isWorking = isWorking ? false : true; // Toggle between work and break
			}
			time = onPomodoroPage ? isWorking ? 25 * 60 : 5 * 60 : onTimerPage ? startingHours * 3600 + startingMinutes * 60 + startingSeconds : 0;
			renderTimer();
		} else if (!isPaused) {
			renderTimer();
			time--;
		}
	} else {
		if (!isPaused) {
			renderTimer();
			time++;
		}
	}
}

function startTimer() {
	isPaused = false;

	if (onPomodoroPage) { time = isWorking ? 25 * 60 : 5 * 60; } // 25 minutes for work, 5 minutes for break }

	if (onTimerPage) {
		if (!hoursInput.value || !minutesInput.value || !secondsInput.value) {
			invalidTime();
			return;
		}
		
		startingHours = parseInt(hoursInput.value);
		startingMinutes = parseInt(minutesInput.value);
		startingSeconds = parseInt(secondsInput.value);
		
		time = startingHours * 3600 + startingMinutes * 60 + startingSeconds;
		
		if (time == 0) {
			invalidTime();
			return;
		}
	}
	
	if (!isRunning) {intervalID = setInterval(updateCountdown, 1000);}
	isRunning = true;
}

function resetTimer() {
	isRunning = false;
	isWorking = true;
	time = onPomodoroPage ? isWorking ? 25 * 60 : 5 * 60 : onTimerPage ? startingHours * 3600 + startingMinutes * 60 + startingSeconds : 0;
	updateCountdown();
	clearInterval(intervalID);
	if (onTimerPage || onPomodoroPage) { time++; }
	renderTimer();
	time = onStopwatchPage ? 0 : time;
}

function pauseTimer() {
	isPaused = true;
}

function playTimer() {
	isPaused = false;
}

function invalidTime() {
	isPaused = true;
	isRunning = false;
	display.textContent = "00:01";
	hoursInput.value = "0";
	minutesInput.value = "0";
	secondsInput.value = "1";
	time = 1;
	alert("Please enter a valid time.");
}