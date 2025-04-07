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

export async function showSettingValue(){
    workTimeInput.value = window.todos.taskTime;
    breakTimeInput.value = window.todos.restTime;
    showCompletedInput.checked = window.todos.showCompleted;
}

export async function setSettingValue(){
    window.todos.taskTime = workTimeInput.value;
    window.todos.restTime = breakTimeInput.value;
    window.todos.showCompleted = showCompletedInput.checked;
    await saveTodoJson();
}