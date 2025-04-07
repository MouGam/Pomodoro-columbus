const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');



function createWindow() {
  const win = new BrowserWindow({
    width: 718,
    height: 830,
    maximizable: false,    // 최대화 버튼 비활성화
    resizable: false,      // 창 크기 조절 불가
    fullscreenable: false, // 전체화면 모드 비활성화
    // frame: false, 
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
  });

  win.loadFile('renderer/index.html');
  // win.webContents.openDevTools();

  // 앱이 종료되기 전에 실행
  app.on('before-quit', () => {
    // 렌더러에 종료 신호 보내기
    win.webContents.send('app-closing');
  });
}

app.whenReady().then(createWindow);

// JSON 읽기
ipcMain.handle('read-todos', async () => {
    try {
      const todosPath = path.join(__dirname, 'assets', 'datas', 'todos.json');
      const data = fs.readFileSync(todosPath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      return {
        currentTaskId:  null, 
        taskTime :  25,
        restTime :  5,
        taskList : [], 
        todayInputTime :  0,
        todayTaskNumber :  0,
        alarmType: "basic"
      };
    }
  });

// JSON 저장
ipcMain.handle('write-todos', async (event, todos) => {
  const todosPath = path.join(__dirname, 'assets', 'datas', 'todos.json');
  try {
    fs.writeFileSync(todosPath, JSON.stringify(todos, null, 2), 'utf-8');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
});

// uuid 받아오기
ipcMain.handle('get-uuid', () => {
    return uuidv4();
});
