const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('electron', {
  addRecord: (id, username, password) => {
    return ipcRenderer.invoke('add-record',id, username, password);
  },

  getAllRecords: () => {
    return ipcRenderer.invoke('get-all-records');
  },

  deleteRecord: (id) => {
    return ipcRenderer.invoke('delete-record', id);
  },
  editRecord: (id, username, password) => {
    return ipcRenderer.invoke('edit-record', id, username, password);
  },
  generateRecords: (records) => {
    return ipcRenderer.invoke('generate-records', records);
  }
});
