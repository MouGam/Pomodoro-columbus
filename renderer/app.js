import { jsonSecondsToMinutes, parseMinutesToSeconds} from './utils.js';


window.addEventListener('DOMContentLoaded', async () => {

    try {
        const todos = await window.todoAPI.readTodos();
      
        if (todos.error) {
          console.error('읽기 실패:', todos.error);
        } else {
          console.log('읽은 todos:', todos);
        }
      } catch (err) {
        console.error('readTodos 중 에러 발생:', err);
    }
  
    

    // 예: 저장 버튼 클릭 시 JSON 저장
    // document.querySelector('#saveBtn').addEventListener('click', async () => {
    //   const newTodos = [
    //     { id: 1, title: '할 일 A', done: false },
    //     { id: 2, title: '할 일 B', done: true }
    //   ];
  
    //   const result = await window.todoAPI.writeTodos(newTodos);
    //   if (result.success) {
    //     alert('저장 성공!');
    //   } else {
    //     console.error('저장 실패:', result.error);
    //   }
    // });
  });
  