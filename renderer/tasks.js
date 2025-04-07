import { saveTodoJson, findTaskById, findParentTask, jsonSecondsToMinutes } from './utils.js';

const listTopElement = document.getElementById('list-top');
const todoInputElement = document.getElementById('todo-input');
const addTodoBtnElement = document.getElementById('add-todo-btn');
const currentTaskElement = document.getElementById('current-task');

// parentTaskId가 null 일 경우는 루트 태스크
async function taskTemplate(taskName, parentTaskId = null){
    const currentDate = new Date();
    const taskId = parentTaskId === null ?
        await window.uuidAPI.generate() : parentTaskId + ' ' + await window.uuidAPI.generate();
    
    return {
        id: taskId, 
        taskName: taskName, 
        inputTime: 0, 
        startDate: currentDate.getTime(), 
        endDate: 0, 
        isRoot: parentTaskId === null, 
        isLeaf: true, 
        isToggled:false,
        isEnd: false, 
        inputTime: 0,
        completeNum: 0,
        subTasks: []
    };
}

export function renderTopTasks(){
    listTopElement.innerHTML = '';
    const topList = window.todos.taskList;
    // console.log(topList);
    topList.forEach(task => {
        if(task.isEnd)
            return;
        const topListElement = document.createElement('div');
        topListElement.classList.add('top-list');
        topListElement.innerHTML = taskElement(task);
        listTopElement.appendChild(topListElement);
    });
}

function taskElement(task){
    console.log('taskElement:',task);
    const time = jsonSecondsToMinutes(task.inputTime);
    const timeStr = time.minuates + ':' + time.seconds;
    return `<div class="list-element-container">
        <div class="list-task-name-container">
            <img 
                src="../assets/images/button.svg" 
                class="${ task.subTasks.filter(task => !task.isEnd).length ? '': 'none'} ${task.isToggled ? 'toggled' : ''}
                    action expand-button" 
                data-task-id="${task.id}" 
                data-action="expand"
            >
            <div class="list-task-name font-large">${task.taskName}<span class="font-small left-mg-4">${task.inputTime > 0 ? timeStr : ''}</span><span class="font-small left-mg-4">${task.completeNum ? task.completeNum : 0}</span></div>
        </div>
        <div class="task-actions">
            <div class="action font-small" data-action="set-current" data-task-id="${task.id}">현재업무로</div>
            <div class="action font-small" data-action="pre-add-subtask" data-task-id="${task.id}">하위목록 추가</div>
            <div class="action font-small" data-action="complete" data-task-id="${task.id}">완료</div>
            <div class="action font-small" data-action="delete" data-task-id="${task.id}">삭제</div>
        </div>
        <div class="input-container none" data-parent-id="${task.id}">
            <input 
                type="text" 
                class="todo-input action font-medium"
                id="todo-input-${task.id}"
                data-task-id="${task.id}" 
                placeholder="할 일을 입력하세요" 
            />
            <div>
                <button 
                    class="action add-todo-btn font-small"
                    data-task-id="${task.id}"
                    data-action="add-subtask"
                >추가</button>
                <button 
                    class="action add-todo-btn font-small"
                    data-task-id="${task.id}"
                    data-action="cancel-add-subtask"
                >취소</button>
            </div>
        </div>
        <div class="list" data-task-id="${task.id}">
            ${ !task.isLeaf && task.isToggled ? 
                task.subTasks.map(task => !task.isEnd ? taskElement(task) : '')
                .join('') : ''}
        </div>
    </div>`
}

export async function addTodoRoot(){
    const todo = todoInputElement.value;

    if(todo.replaceAll(' ', '') === '')
        return;

    const task = await taskTemplate(todo);
    await window.todos.taskList.push(task);

    todoInputElement.value = '';

    await saveTodoJson();
    renderTopTasks();
}

export async function setCurrentTask(taskId=null){

    const task = findTaskById(taskId);
    window.todos.currentTaskId = taskId;

    const currentTask = findTaskById(window.todos.currentTaskId);
    if(!currentTask || currentTask.isEnd){
        window.todos.currentTaskId = null;
    }

    await saveTodoJson();
    if(taskId){
        currentTaskElement.innerHTML = 
        `<div class="list-element font-xlarge">${task.taskName}</div>
        <div class="task-actions font-small">
            <div class="action" data-action="complete" data-task-id="${task.id}">완료</div>
            <div class="action" data-action="delete" data-task-id="${task.id}">삭제</div>
        </div>
        `;
    }else{
        currentTaskElement.innerHTML = '';
    }
}

export async function addTodoSubtask(taskToBeAddedId, taskName){
    const taskToBeAdded = findTaskById(taskToBeAddedId);

    taskToBeAdded.isToggled = true;
    taskToBeAdded.isLeaf = false;
    
    const taskToAdd = await taskTemplate(taskName, taskToBeAddedId);

    taskToBeAdded.subTasks.push(taskToAdd);

    await saveTodoJson();
    renderTopTasks();
}

export async function toggleTask(taskId){
    const task = findTaskById(taskId);
    task.isToggled = !task.isToggled;
    await saveTodoJson();
    renderTopTasks();
    // renderTopTasks();
    // const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    // console.log(taskElement);
    // taskElement.classList.toggle('toggled');
}

export async function endTask(taskId){
    const task = findTaskById(taskId);
    task.isEnd = true;
    task.endDate = new Date().getTime();
    await saveTodoJson();

    if(window.todos.currentTaskId === taskId)
        setCurrentTask();

    renderTopTasks();
}

export async function deleteTask(taskId){
    const taskToBeDeleted = findTaskById(taskId);

    if(taskToBeDeleted.isRoot){
        window.todos.taskList = 
            window.todos.taskList.filter(task => task.id !== taskToBeDeleted.id);
    }else{
        const parentTask = findParentTask(taskToBeDeleted.id);
        parentTask.subTasks = parentTask.subTasks.filter(task => task.id !== taskToBeDeleted.id);

        if(parentTask.subTasks.length === 0)
            parentTask.isLeaf = true;
        
    }

    await saveTodoJson();
    renderTopTasks();
}

export async function completeNumAdd(taskId){
    const task = findTaskById(taskId);
    task.completeNum++;
    await saveTodoJson();
    renderTopTasks();
}

