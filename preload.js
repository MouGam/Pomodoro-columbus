const { contextBridge, ipcRenderer } = require('electron');
// const { v4: uuidv4 } = require('uuid');

contextBridge.exposeInMainWorld('todoAPI', {
  readTodos: async () => {
    const result = await ipcRenderer.invoke('read-todos');
    return typeof result === 'string' ? JSON.parse(result) : result;
  },
  writeTodos: (todos) => ipcRenderer.invoke('write-todos', todos),
});

contextBridge.exposeInMainWorld('uuidAPI', {
    generate: () => ipcRenderer.invoke('get-uuid')
  });
  
// contextBridge.exposeInMainWorld('uuid', {
//     generate: () => uuidv4()
//   });