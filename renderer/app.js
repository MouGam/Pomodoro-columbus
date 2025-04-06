import { jsonSecondsToMinutes, parseMinutesToSeconds, findTaskById} from './utils.js';
import { toggleTimer, resetTimer} from './timer.js';
import { renderTopTasks, addTodoRoot, setCurrentTask } from './tasks.js';

window.addEventListener('DOMContentLoaded', async () => {
  try {
      const todos = await window.todoAPI.readTodos();
      if(typeof todos === 'string'){
        window.todos = JSON.parse(todos);
      }else if(typeof todos === 'object'){
        window.todos = todos;
      }
      if (todos.error) {
        console.error('읽기 실패:', todos.error);
      } else {
        console.log('읽은 todos:', typeof todos);
      }
    } catch (err) {
      console.error('readTodos 중 에러 발생:', err);
  }
  // 초기 타이머 세팅
  resetTimer();

  // 타이머 시작 버튼 클릭 시 이벤트 처리
  document.getElementById('start-btn').addEventListener('click', () => {
    toggleTimer();
  });

  // 타이머 초기화 버튼 클릭 시 이벤트 처리
  document.getElementById('reset-btn').addEventListener('click', () => {
    resetTimer();
  });

  // task 렌더링
  renderTopTasks();

  // 새 할 일 추가 버튼 클릭 시 이벤트 처리
  document.getElementById('add-todo-btn').addEventListener('click', () => {
    addTodoRoot();
  });

  // Enter 키 이벤트 추가
  document.getElementById('todo-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTodoRoot();
    }
  });
});


document.addEventListener('click', (e) => {
  // 2. 클릭된 요소나 그 부모 중에서 'action' 클래스를 가진 가장 가까운 요소 찾기
  const actionButton = e.target.closest('.action');
  // console.log(actionButton.dataset.action);
  if(!actionButton)
    return;
  
  const taskId = actionButton.dataset.taskId;

  if (actionButton.dataset.action === 'pre-add-subtask') {
      
      // 5. 해당 task의 input-container 찾기
      const inputContainer = document.querySelector(
          `.input-container[data-parent-id="${taskId}"]`
      );
      
      // 6. input-container 보이게 하기
      inputContainer.classList.remove('none');
      
      // 7. 입력창에 포커스
      const input = document.getElementById(`todo-input-${taskId}`);
      input.focus();
  }

  if (actionButton.dataset.action === 'cancel-add-subtask') {
    console.log(actionButton);
    const inputContainer = document.querySelector(
        `.input-container[data-parent-id="${taskId}"]`
    );
    inputContainer.classList.add('none');
  }
  
  if(actionButton.dataset.action === 'add-subtask'){
    console.log(actionButton);
  }

  if(actionButton.dataset.action === 'set-current'){
    // const task = findTaskById(taskId);
    setCurrentTask(taskId);
  }
});