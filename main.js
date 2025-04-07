const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

function dataTemplate(){
  return {
    currentTaskId: null,
    taskTime: 25,
    restTime: 5,
    alarmType: 'basic',
    taskList: []
  };
}

function createWindow() {
  const win = new BrowserWindow({
    width: 718 + 450,
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

  win.loadFile(path.join(__dirname, 'renderer/index.html'));
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

// 사용자의 데이터 디렉토리 경로 얻기
const userDataPath = app.getPath('userData');
const todosPath = path.join(userDataPath, 'todos.json');

// IPC 핸들러에서
ipcMain.handle('write-todos', async (event, todosJson) => {
    try {
        await fs.promises.writeFile(todosPath, JSON.stringify(todosJson, null, 2), 'utf-8');
        return { success: true };
    } catch (error) {
        console.error('Error writing todos:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('read-todos', async () => {
    try {
        // 파일이 없으면 기본 데이터로 생성
        if (!fs.existsSync(todosPath)) {
            const defaultData = dataTemplate();
            await fs.promises.writeFile(
                todosPath, 
                JSON.stringify(defaultData, null, 2)
            );
            return defaultData;
        }

        const data = await fs.promises.readFile(todosPath, 'utf-8');
        return data;
    } catch (error) {
        console.error('Error reading todos:', error);
        return { error: error.message };
    }
});

ipcMain.handle('get-alarm-type', async () => {
    try{
      const alarmType = await fs.promises.readdir(path.join(__dirname, 'assets/audio'));
      return alarmType;
    }catch(error){
      console.error('Error reading alarm type:', error);
      return { error: error.message };
    }
});

// uuid 받아오기
ipcMain.handle('get-uuid', () => {
    return uuidv4();
});