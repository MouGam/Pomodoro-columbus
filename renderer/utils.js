export function jsonSecondsToMinutes(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return {
        minuates:`${mins}`,
        seconds: `${secs.toString().padStart(2, '0')}`
    };
}

export function playSound(soundId){
    const sound = document.getElementById(`timer-${soundId}`);
    sound.currentTime = 0;
    sound.play();
}

export function parseMinutesToSeconds(min, seconds) {
    // const [mins, secs] = timeStr.split(':').map(Number);
    return min * 60 + seconds;
}

export async function saveTodoJson(){
    // const todoJson = JSON.stringify(window.todos, null, 4);
    await window.todoAPI.writeTodos(window.todos);
}

export function findTaskById(id, list=null){
    if(id === null)
        return null;
    let findTask;
    if(list === null)
        findTask = window.todos.taskList.find(task => id.includes(task.id));
    else
        findTask = list.find(task => id.includes(task.id));
        
    if(!findTask)
        return null;

    if(findTask.id === id)
        return findTask;
    else
        return findTaskById(id, findTask.subTasks);
}

export function findParentTask(id){
    const taskLoot = id.split(' ');
    if(taskLoot.length === 0 || taskLoot.length === 1)
        return null;
    const parentTaskId = taskLoot.slice(0, taskLoot.length - 1).join(' ');
    return findTaskById(parentTaskId);
}

const workTimeInput = document.getElementById('work-time');
const breakTimeInput = document.getElementById('break-time');
const showCompletedInput = document.getElementById('show-completed');
const goalCompleteTaskNumInput = document.getElementById('goal-complete-task-num');
const isDarkModeInput = document.getElementById('is-dark-mode');
const alarmTypeSelect = document.getElementById('alarm-type');

export async function showSettingValue(){
    if(window.todos.goalCompleteTaskNum === undefined)
        window.todos.goalCompleteTaskNum = 10;
    workTimeInput.value = window.todos.taskTime;
    breakTimeInput.value = window.todos.restTime;
    showCompletedInput.checked = window.todos.showCompleted;
    isDarkModeInput.checked = window.todos.isDarkMode;
    goalCompleteTaskNumInput.value = window.todos.goalCompleteTaskNum;
    const alarmType = (await window.alarmAPI.getAlarmType()).map(e=>e.replace('.mp3', ''));
    alarmTypeSelect.innerHTML = alarmType.map(type => `<option value="${type}">${type}</option>`).join('');
    alarmTypeSelect.value = window.todos.alarmType;
}

export async function setSettingValue(){
    window.todos.taskTime = workTimeInput.value;
    window.todos.restTime = breakTimeInput.value;
    window.todos.showCompleted = showCompletedInput.checked;
    window.todos.goalCompleteTaskNum = goalCompleteTaskNumInput.value;
    window.todos.isDarkMode = isDarkModeInput.checked;
    window.todos.alarmType = alarmTypeSelect.value;
    // console.log(window.todos);
    await saveTodoJson();
}

export async function resetTodoJson(){
    const defaultData = await window.todoAPI.resetTodos();
    defaultData.taskList = window.todos.taskList;
    window.todos = defaultData;
    await saveTodoJson();
}

export function setDarkMode(){
    if(window.todos.isDarkMode){
        document.body.classList.add('dark-mode');
    }else{
        document.body.classList.remove('dark-mode');
    }
}
