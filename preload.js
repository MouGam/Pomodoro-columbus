const { contextBridge, ipcRenderer } = require('electron');
// const { v4: uuidv4 } = require('uuid');

contextBridge.exposeInMainWorld('todoAPI', {
  readTodos: async () => {
    const result = await ipcRenderer.invoke('read-todos');
    return typeof result === 'string' ? JSON.parse(result) : result;
  },
  writeTodos: (todos) => ipcRenderer.invoke('write-todos', todos),
  resetTodos: () => ipcRenderer.invoke('reset-todos')
});

contextBridge.exposeInMainWorld('uuidAPI', {
    generate: () => ipcRenderer.invoke('get-uuid')
  });
  
// contextBridge.exposeInMainWorld('uuid', {
//     generate: () => uuidv4()
//   });

contextBridge.exposeInMainWorld('alarmAPI', {
  getAlarmType: () => ipcRenderer.invoke('get-alarm-type')
});

// Tray 타이머 업데이트를 위한 API 추가
contextBridge.exposeInMainWorld('trayAPI', {
  updateTimer: (time) => ipcRenderer.send('update-tray-timer', time)
});

// contextBridge.exposeInMainWorld('windowControls', {
//   // minimize: () => ipcRenderer.send('minimize-window'),
//   close: () => ipcRenderer.send('close-window'),
// });