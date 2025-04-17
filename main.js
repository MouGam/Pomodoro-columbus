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
    showCompleted: false,
    todayCompleteTaskNum:0,
    goalCompleteTaskNum: 10,
    isDarkMode:false,
    taskList: []
  };
}

// function taskTemplate(id, taskName, isRoot, isLeaf, isToggled=false, isEnd=false, inputTime=0, completeNum=0, subTasks=[]){
//   const defaultTemplate = {
//     id: null, 
//     taskName: null, 
//     inputTime: 0, 
//     startDate: new Date().getTime(), 
//     endDate: 0, 
//     isRoot: null, 
//     isLeaf: null, 
//     isToggled: isToggled,
//     isEnd: isEnd, 
//     inputTime: inputTime,
//     completeNum: completeNum,
//     subTasks: subTasks
//   };

//   return defaultTemplate;
// }

function createWindow() {
  const win = new BrowserWindow({
    width: 720 + 450,
    height: 760,
    maximizable: false,    // 최대화 버튼 비활성화
    resizable: false,      // 창 크기 조절 불가
    fullscreenable: false, // 전체화면 모드 비활성화,
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

        const data = JSON.parse(await fs.promises.readFile(todosPath, 'utf-8'));

      // 새로 추가되거나 변경한 속성이 있다면 이쪽에 추가한다.
        if(data.isDarkMode === undefined)
          data.isDarkMode = false;

        return data;
    } catch (error) {
        console.error('Error reading todos:', error);
        return { error: error.message };
    }
});

ipcMain.handle('reset-todos', async () => {
    const defaultData = dataTemplate();
    return defaultData;
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