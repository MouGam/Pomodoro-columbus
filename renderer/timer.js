import { findTaskById, playSound } from './utils.js';
const minElement = document.getElementById('minuates');
const secElement = document.getElementById('seconds');
const resetButton = document.getElementById('reset-button');
const startButton = document.getElementById('start-btn');

const playButton = document.getElementById('play-button');
const pauseButton = document.getElementById('pause-button');
const timerInterval = 1000;

let currentMinutes = 0;
let currentSeconds = 0;
let intervalId = null;  // interval ID 저장용
let isRunning = false; // 타이머 상태 추적

let currentTask = null;

// 타이머 감소, 내부적인 변수와 화면 표시 변수 모두 감소
function decrementTime() {
    if(!currentTask)
        currentTask = findTaskById(window.todos.currentTaskId);
    
    if(currentTask)
        currentTask.inputTime++;
    
    if (currentSeconds > 0) {
        currentSeconds--;
        secElement.textContent = String(currentSeconds).padStart(2, '0');

    } else if (currentMinutes > 0) {
        currentMinutes--;
        currentSeconds = 59;
        minElement.textContent = currentMinutes;
        secElement.textContent = String(currentSeconds).padStart(2, '0');
    } else {
        playSound(window.todos.alarmType);

        // 타이머 종료
        stopTimer();
    }
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        intervalId = setInterval(decrementTime, timerInterval);
    }
}

function stopTimer() {
    if (isRunning) {
        clearInterval(intervalId);
        intervalId = null;
        isRunning = false;
    }
}

export function toggleTimer() {
    if (playButton.classList.contains('none')) {
        playButton.classList.remove('none');
        pauseButton.classList.add('none');
        stopTimer();
    } else {
        playButton.classList.add('none');
        pauseButton.classList.remove('none');
        startTimer();
    }
}

export async function setTimer(minuates, seconds) {
    minElement.textContent = minuates;
    secElement.textContent = String(seconds).padStart(2, '0');
}

export function resetTimer() {

    if(isRunning) 
        toggleTimer();
    currentMinutes = window.todos.taskTime;
    currentSeconds = 0;
    minElement.textContent = window.todos.taskTime;
    secElement.textContent = '00';
}
