const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('renderer/index.html');
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

// JSON 읽기
ipcMain.handle('read-todos', async () => {
    try {
      const todosPath = path.join(__dirname, 'assets', 'datas', 'todos.json');
      const data = fs.readFileSync(todosPath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      return { error: err.message };
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