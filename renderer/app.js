import { showSettingValue, setSettingValue, saveTodoJson, resetTodoJson, setDarkMode } from './utils.js';
import { toggleTimer, resetTimer} from './timer.js';
import { 
  renderTopTasks, 
  addTodoRoot, 
  setCurrentTask, 
  toggleTask, 
  addTodoSubtask, 
  endTask, 
  notEndTask, 
  deleteTask,
  editTask,
  showGoalCompleteTaskNum,
  resetTodayCompleteTaskNum
 } from './tasks.js';

window.addEventListener('DOMContentLoaded', async () => {
  try {
      const todos = await window.todoAPI.readTodos();

      // for debugging
      console.log(todos);

      if(typeof todos === 'string'){
        window.todos = JSON.parse(todos);
      }else if(typeof todos === 'object'){
        window.todos = todos;
      }
      if (todos.error) {
        console.error('읽기 실패:', todos.error);
      }
      // else {
        // console.log('읽은 todos:', typeof todos);
      // }
    } catch (err) {
      console.error('readTodos 중 에러 발생:', err);
  }
  // await resetTodoJson();
  // 초기 타이머 세팅
  resetTimer();
  setDarkMode();
  showGoalCompleteTaskNum();
  // resetTodayCompleteTaskNum();
  // 타이머 시작 버튼 클릭 시 이벤트 처리
  document.getElementById('start-btn').addEventListener('click', () => {
    // console.log('start-btn');
    renderTopTasks();
    toggleTimer();
  });

  // 타이머 초기화 버튼 클릭 시 이벤트 처리
  document.getElementById('reset-btn').addEventListener('click', () => {
    renderTopTasks();
    resetTimer();
  });

  // task 렌더링
  renderTopTasks();
  // console.log(window.todos);
  // 새 할 일 추가 버튼 클릭 시 이벤트 처리
  document.getElementById('add-todo-btn').addEventListener('click', () => {
    addTodoRoot();
  });

  // // Enter 키 이벤트 추가
  // document.getElementById('todo-input').addEventListener('keydown', (e) => {
  //   if (e.key === 'Enter') {
  //     e.preventDefault();
  //     addTodoRoot();
  //   }
  // });
});


document.addEventListener('click', (e) => {
  // 2. 클릭된 요소나 그 부모 중에서 'action' 클래스를 가진 가장 가까운 요소 찾기
  const actionButton = e.target.closest('.action');
  if(!actionButton)
    return;
  
  const taskId = actionButton.dataset.taskId;

  if (actionButton.dataset.action === 'pre-add-subtask') {
      
      // 5. 해당 task의 input-container 찾기
      const inputContainer = document.querySelector(
          `.input-container[data-parent-id="${taskId}"]`
      );
      
      if(inputContainer.classList.contains('none')){
        // 6. input-container 보이게 하기
        inputContainer.classList.remove('none');
        
        // 7. 입력창에 포커스
        const input = document.getElementById(`todo-input-${taskId}`);
        input.focus();
      }else{
        inputContainer.classList.add('none');
      }
  }

  if (actionButton.dataset.action === 'cancel-add-subtask') {
    console.log(actionButton);
    const inputContainer = document.querySelector(
        `.input-container[data-parent-id="${taskId}"]`
    );
    inputContainer.classList.add('none');
  }
  
  if(actionButton.dataset.action === 'add-subtask'){
    const taskName = document.getElementById(`todo-input-${taskId}`).value;
    addTodoSubtask(taskId, taskName);
  }

  if(actionButton.dataset.action === 'set-current'){
    setCurrentTask(taskId);
  }

  if(actionButton.dataset.action === 'expand'){
    toggleTask(taskId);
  }

  if(actionButton.dataset.action === 'edit'){
    const input = document.querySelector(
      `.list-task-name[data-task-id="${taskId}"]`
    );
    editTask(taskId, input.value);
  }

  if(actionButton.dataset.action === 'complete'){
    endTask(taskId);
  }

  if(actionButton.dataset.action === 'incomplete'){
    notEndTask(taskId);
  }

  if(actionButton.dataset.action === 'delete'){
    deleteTask(taskId);
  }
});

document.getElementById('setting-button').addEventListener('click', () => {
  const modal = document.getElementById('settings-modal');

  showSettingValue();
  modal.classList.remove('none');

});

document.getElementById('save-settings').addEventListener('click', async () => {
  await  setSettingValue();
  await showSettingValue();
  await saveTodoJson();
  resetTimer();
  setDarkMode();
  showGoalCompleteTaskNum();
  renderTopTasks();
});

document.getElementById('close-settings').addEventListener('click', () => {
  const modal = document.getElementById('settings-modal');
  modal.classList.add('none');
});

document.getElementById('today-complete-task-num-reset').addEventListener('click', () => {
  resetTodayCompleteTaskNum();
});