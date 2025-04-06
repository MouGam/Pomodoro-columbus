import { saveTodoJson, findTaskById } from './utils.js';

const listTopElement = document.getElementById('list-top');
const todoInputElement = document.getElementById('todo-input');
const addTodoBtnElement = document.getElementById('add-todo-btn');
const currentTaskElement = document.getElementById('current-task');

export function renderTopTasks(){
    listTopElement.innerHTML = '';
    const topList = window.todos.taskList;
    console.log(topList);
    topList.forEach(task => {
        const topListElement = document.createElement('div');
        topListElement.classList.add('top-list');
        topListElement.innerHTML = taskElement(task);
        listTopElement.appendChild(topListElement);
    });
}

export function renderSubTasks(){

}


/**
 * 
 * {
	taskName:string,
	id:string,
	inputTime:number(seconds),
	startDate:number(그거),
	endDate:number(그거),
	isRoot:boolean,
	isLeaf:boolean,
	isEnd:boolean,
	subTasks:[
		task,
		task,
		...
	]
}
 */
function taskElement(task){
    console.log('taskElement:',task);
    return `<div class="list-element-container">
        <div class="list-task-name-container">
            <img src="../assets/images/button.svg" 
            class="${task.isRoot ? 'none ': ''}
            action expand-button" data-task-id="${task.id}" data-action="expand">
            <div class="list-task-name">${task.taskName}</div>
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
                class="todo-input action font-small"
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
        <div class="list">
            ${task.subTasks.map(task => task.isEnd === false ? taskElement(task) : '').join('')}
        </div>
    </div>`
}

export async function addTodoRoot(){
    const todo = todoInputElement.value;

    if(todo.replaceAll(' ', '') === '')
        return;

    const todoId = await window.uuidAPI.generate();


    window.todos.taskList.push({id: todoId, taskName: todo, inputTime: 0, startDate: 0, endDate: 0, isRoot: true, isLeaf: true, isEnd: false, subTasks: []});

    todoInputElement.value = '';

    await saveTodoJson();
    renderTopTasks();
}

export function setCurrentTask(taskId){
    const task = findTaskById(taskId);
    currentTaskElement.innerHTML = 
    `<div class="list-element font-xlarge">${task.taskName}</div>
    <div class="task-actions font-small">
            <div class="action" data-action="pre-add-subtask" data-task-id="${task.id}">하위목록 추가</div>
            <div class="action" data-action="complete" data-task-id="${task.id}">완료</div>
            <div class="action" data-action="delete" data-task-id="${task.id}">삭제</div>
        </div>
        <div class="input-container none" data-parent-id="${task.id}">
            <input 
                type="text" 
                class="todo-input action font-small"
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
    `;
}