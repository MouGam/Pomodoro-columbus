export function jsonSecondsToMinutes(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return {
        minuates:`${mins}`,
        seconds: `${secs.toString().padStart(2, '0')}`
    };
}

export function parseMinutesToSeconds(min, seconds) {
    // const [mins, secs] = timeStr.split(':').map(Number);
    return min * 60 + seconds;
}

export async function saveTodoJson(){
    const todoJson = JSON.stringify(window.todos);
    await window.todoAPI.writeTodos(todoJson);
}

export function findTaskById(id, list=null){
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