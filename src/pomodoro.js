const pomodoroDisplay = document.querySelector("#pomodoroDisplay");

const startButton = document.querySelector("#startButton");
const pauseButton = document.querySelector("#pauseButton");
const playButton = document.querySelector("#playButton");
const resetButton = document.querySelector("#resetButton");

const alertCheckbox = document.querySelector("#alertCheckbox");
const soundCheckbox = document.querySelector("#soundCheckbox");

let isAlertEnabled = alertCheckbox.checked;
let isSoundEnabled = soundCheckbox.checked;

let time = 25 * 60; // 25 minutes in seconds

let intervalID = 0;
let isPaused = true;
let isRunning = false;

let isWorking = true;

updateCountdown();
setInterval(tick, 1);

startButton.addEventListener("click", function () { startPomodoro();});
pauseButton.addEventListener("click", function () { pausePomodoro();});
playButton.addEventListener("click", function () { playPomodoro();});
resetButton.addEventListener("click", function () { resetPomodoro();});

function tick() {
	renderPomodoro();

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

	isAlertEnabled = alertCheckbox.checked;
	isSoundEnabled = soundCheckbox.checked;
}

function renderPomodoro() {
	if (!time && time !== 0) {
		time = 25 * 60;
		pomodoroDisplay.textContent = "25:00";
	}

	let hours = Math.floor(time / 3600);
	let minutes = Math.floor((time % 3600) / 60);
	let seconds = time % 60;

	hours = hours < 10 ? "0" + hours : hours;
	hours = hours == 0 ? "" : hours + ":";
	minutes = minutes < 10 ? "0" + minutes : minutes;
	seconds = seconds < 10 ? "0" + seconds : seconds;

	pomodoroDisplay.textContent = `${hours}${minutes}:${seconds}`;
} 

function updateCountdown() {
	if (time == 0 && !isPaused) {
		isRunning = false;
		clearInterval(intervalID);
		if (!isWorking) {
			time = 25 * 60; // 25 minutes in seconds
		} else {
			time = 5 * 60; // 5 minutes in seconds
		}
		if (isSoundEnabled) {
			new Audio("./assets/alarm.mp3").play();
		}
		if (isAlertEnabled) {
			alert(isWorking ? "Work time is over! Let's take a break!" : "Break time is over! Let's get back to work!");
		}
		
		isWorking = isWorking ? false : true; // Toggle between work and break
	} else if (!isPaused) {
		renderPomodoro();
		time--;
	}
}

function startPomodoro() {
	isPaused = false;
	time = isWorking ? 25 * 60 : 5 * 60; // 25 minutes for work, 5 minutes for break
	
	if (!isRunning) {intervalID = setInterval(updateCountdown, 1000);}
	isRunning = true;
}

function resetPomodoro() {
	isRunning = false;
	isWorking = true;
	time = 25 * 60;
	updateCountdown();
	clearInterval(intervalID);
	time++;
	renderPomodoro();
}

function pausePomodoro() {
	isPaused = true;
}

function playPomodoro() {
	isPaused = false;
}