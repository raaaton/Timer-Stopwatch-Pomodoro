const stopwatchDisplay = document.querySelector("#stopwatchDisplay");

const startButton = document.querySelector("#startButton");
const pauseButton = document.querySelector("#pauseButton");
const playButton = document.querySelector("#playButton");
const resetButton = document.querySelector("#resetButton");

let time = 0;

let intervalID = 0;
let isPaused = true;
let isRunning = false;

updateCounter();
setInterval(tick, 1);

startButton.addEventListener("click", function () { startStopwatch();});
pauseButton.addEventListener("click", function () { pauseStopwatch();});
playButton.addEventListener("click", function () { playStopwatch();});
resetButton.addEventListener("click", function () { resetStopwatch();});

function tick() {
	renderStopwatch();

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
}

function renderStopwatch() {
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

	stopwatchDisplay.textContent = `${hours}${minutes}:${seconds}`;
} 

function updateCounter() {
	if (!isPaused) {
		renderStopwatch();
		time++;
	}
}

function startStopwatch() {
	isPaused = false;
	time = 0;
	
	if (!isRunning) {intervalID = setInterval(updateCounter, 1000);}
	isRunning = true;
}

function resetStopwatch() {
	isRunning = false;
	updateCounter();
	time = 0;
	clearInterval(intervalID);
	renderStopwatch();
}

function pauseStopwatch() {
	isPaused = true;
}

function playStopwatch() {
	isPaused = false;
}