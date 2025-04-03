const { contextBridge, ipcRenderer } = require('electron');
// const { v4: uuidv4 } = require('uuid');

contextBridge.exposeInMainWorld('todoAPI', {
  readTodos: () => ipcRenderer.invoke('read-todos'),
  writeTodos: (todos) => ipcRenderer.invoke('write-todos', todos),
});

contextBridge.exposeInMainWorld('uuidAPI', {
    generate: () => ipcRenderer.invoke('get-uuid')
  });
  
// contextBridge.exposeInMainWorld('uuid', {
//     generate: () => uuidv4()
//   });