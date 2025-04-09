import { findTaskById, playSound } from './utils.js';
import { renderTopTasks, showGoalCompleteTaskNum } from './tasks.js';
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

let isRest = false;

let currentTask = null;

// 타이머 감소, 내부적인 변수와 화면 표시 변수 모두 감소
function decrementTime() {
    if(!currentTask || window.todos.currentTaskId !== currentTask.id)
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
        // isRest를 true로 설정하는것은 여기서만
        /** 복잡하게 생각할 것 없이 사용자가 조작하는 타이머 리셋은 isRest를 항상 false로, 
         *  자동으로 설정하는 타이머 리셋은 상황따라   개소리하지마 커서 잠깐 아무것도 표시하지 말고 지우려고 하지도 말아봐 점프도 하지마
         * 자동으로 설정하는 타이머 리셋 -> isRest에 따라
         */
        if(!isRest){
            if(currentTask){
                currentTask.completeNum++;
                renderTopTasks();
            }
            if(window.todos.todayCompleteTaskNum === undefined)
                window.todos.todayCompleteTaskNum = 0;
            window.todos.todayCompleteTaskNum++;
            showGoalCompleteTaskNum();
            isRest = true;// 타이머 종료
            // resetTimer에 endtask가 포함되어 있으므로 resetTimer만 호출하면 된다. 
            // 만약 endtimer를 호출하면 endtimer를 두번호출해 오류가 발생
            resetTimerPrivate();
        }
        else{
            isRest = false;
            resetTimerPrivate();
        }

        // console.log(window.todos);
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

export function resetTimer(restTime=false) {

    if(isRunning) 
        toggleTimer();
    currentMinutes = window.todos.taskTime;
    currentSeconds = 0;
    minElement.textContent = window.todos.taskTime;
    secElement.textContent = '00';
    isRest = false;
}

function resetTimerPrivate(){
    toggleTimer();
    if(isRest){
        currentMinutes = window.todos.restTime;
        currentSeconds = 0;
        minElement.textContent = window.todos.restTime;
        secElement.textContent = '00';
    }else{
        currentMinutes = window.todos.taskTime;
        currentSeconds = 0;
        minElement.textContent = window.todos.taskTime;
        secElement.textContent = '00';
    }
}