const timerDisplay = document.querySelector("#timerDisplay");

const hoursInput = document.querySelector("#hoursInput");
const minutesInput = document.querySelector("#minutesInput");
const secondsInput = document.querySelector("#secondsInput");

const startButton = document.querySelector("#startButton");
const pauseButton = document.querySelector("#pauseButton");
const playButton = document.querySelector("#playButton");
const resetButton = document.querySelector("#resetButton");

const alertCheckbox = document.querySelector("#alertCheckbox");
const soundCheckbox = document.querySelector("#soundCheckbox");

let startingHours = parseInt(hoursInput.value);
let startingMinutes = parseInt(minutesInput.value);
let startingSeconds = parseInt(secondsInput.value);

let isAlertEnabled = alertCheckbox.checked;
let isSoundEnabled = soundCheckbox.checked;

let time = startingHours * 3600 + startingMinutes * 60 + startingSeconds;

let intervalID = 0;
let isPaused = true;
let isRunning = false;

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

	isAlertEnabled = alertCheckbox.checked;
	isSoundEnabled = soundCheckbox.checked;
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

	timerDisplay.textContent = `${hours}${minutes}:${seconds}`;
} 

function updateCountdown() {
	if (time == 0 && !isPaused) {
		isRunning = false;
		timerDisplay.textContent = "00:00";
		clearInterval(intervalID);
		if (isSoundEnabled) {
			new Audio("alarm.mp3").play();
		}
		if (isAlertEnabled) {
			alert("Time's up!");
		}
	} else if (!isPaused) {
		renderTimer();
		time--;
	}
}

function startTimer() {
	isPaused = false;

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
	
	if (!isRunning) {intervalID = setInterval(updateCountdown, 1000);}
	isRunning = true;
}

function resetTimer() {
	isRunning = false;
	time = startingHours * 3600 + startingMinutes * 60 + startingSeconds;
	updateCountdown();
	clearInterval(intervalID);
	time++;
	renderTimer();
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
	timerDisplay.textContent = "00:01";
	hoursInput.value = "0";
	minutesInput.value = "0";
	secondsInput.value = "1";
	time = 1;
	alert("Please enter a valid time.");
}