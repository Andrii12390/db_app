const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs-extra');
const readline = require('readline');

const FILE_COUNT = 10;

class ElectronApp {
  constructor() {
    this.mainWindow = null;
    this.initializeFiles = this.initializeFiles.bind(this);
    this.createWindow = this.createWindow.bind(this);
    this.getUserDataPath = this.getUserDataPath.bind(this);
    this.getFileName = this.getFileName.bind(this);
    this.sharrSearch = this.sharrSearch.bind(this);
    this.updateIndexFile = this.updateIndexFile.bind(this);
    this.restructureDataFiles = this.restructureDataFiles.bind(this);
  }

  createWindow() {
    this.mainWindow = new BrowserWindow({
      width: 900,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: false,
        contextIsolation: true,
      }
    });

    this.mainWindow.setMenuBarVisibility(false);
    this.mainWindow.loadURL('http://localhost:3000');
    // this.mainWindow.loadFile(path.join(__dirname, 'index.html'));
  }

  getUserDataPath(folderName) {
    return path.join(app.getPath('userData'), folderName);
  }

  async initializeFiles() {
    await fs.ensureDir(this.getUserDataPath('data'));
    await fs.ensureDir(this.getUserDataPath('index'));
    
    for (let i = 0; i < FILE_COUNT; i++) {
      const dataFilePath = path.join(this.getUserDataPath('data'), `data${i}.txt`);
      if (!(await fs.pathExists(dataFilePath))) {
        await fs.outputFile(dataFilePath, '');
      }
    }

    const indexFilePath = path.join(this.getUserDataPath('index'), 'index.txt');
    const indexContent = `10 0\n20 1\n30 2\n40 3\n50 4\n60 5\n70 6\n80 7\n90 8\n100 9\n`;

    if (!(await fs.pathExists(indexFilePath))) {
      await fs.outputFile(indexFilePath, indexContent);
    }
  }

  async addRecord(id, username, password) {
    try {
      const dataFilePath = await this.getFileName(id);
      await fs.promises.appendFile(dataFilePath, `${id},${username},${password}\n`);
    } catch (error) {
      console.error('Error adding record:', error);
    }
  }

  async generateRecords(records) {
    try {
      for (const record of records) {
        const { id, username, password } = record;
        const dataFilePath = await this.getFileName(id);
        await fs.promises.appendFile(dataFilePath, `${id},${username},${password}\n`);
      }
    } catch (error) {
      console.error("Error generating records:", error);
    }
  }

  async loadBlock(blockIndex) {
    const dataFilePath = path.join(this.getUserDataPath('data'), `data${blockIndex}.txt`);
    try {
      const data = await fs.readFile(dataFilePath, 'utf-8');
      const records = data.split('\n').map(line => {
        const [id, username, password] = line.split(',');
        return { 
          id: id ? parseInt(id, 10) : NaN, 
          username: username || undefined, 
          password: password || undefined 
        };
      });
      return records;
    } catch (error) {
      return [];
    }
  }

  async getAllRecords() {
    try {
      const allRecords = [];
      for (let i = 0; i < FILE_COUNT; i++) {
        const dataFilePath = path.join(this.getUserDataPath('data'), `data${i}.txt`);
        const data = await fs.readFile(dataFilePath, 'utf-8');
        const records = data.split('\n').map(line => {
          const [id, username, password] = line.split(',');
          return { 
            id: id ? parseInt(id, 10) : NaN, 
            username, 
            password 
          };
        });
        allRecords.push(...records);
      }
      return allRecords.filter(record => !isNaN(record.id));
    } catch (error) {
      return [];
    }
  }

  async deleteRecord(id) {
    try { 
      const dataFilePath = await this.getFileName(id);
      const data = await fs.promises.readFile(dataFilePath, 'utf-8');
      const fileRecords = data.split('\n').filter(line => line.trim()).map(line => {
        const [fileId, uname, pwd] = line.split(',');
        return { id: parseInt(fileId, 10), username: uname, password: pwd };
      });

      const indexToDelete = this.sharrSearch(fileRecords, id);
      if (indexToDelete === -1) {
        return;
      }

      fileRecords.splice(indexToDelete, 1); 

      const updatedData = fileRecords.map(record => `${record.id},${record.username},${record.password}`).join('\n') + '\n';
      await fs.promises.writeFile(dataFilePath, updatedData);

    } catch (error) { }
  }

  async editRecord(id, username, password) {
    try {
      const dataFilePath = await this.getFileName(id);
      const data = await fs.promises.readFile(dataFilePath, 'utf-8');
      const fileRecords = data.split('\n').filter(line => line.trim()).map(line => {
        const [fileId, uname, pwd] = line.split(',');
        return { id: parseInt(fileId, 10), username: uname, password: pwd };
      });

      const indexToEdit = this.sharrSearch(fileRecords, id);

      if (indexToEdit === -1) {
        return;
      }
      fileRecords[indexToEdit].username = username;
      fileRecords[indexToEdit].password = password;

      const updatedData = fileRecords.map(record => `${record.id},${record.username},${record.password}`).join('\n');
      await fs.promises.writeFile(dataFilePath, updatedData);

    } catch (error) { }
  }

  sharrSearch(records, targetId) {
    let left = 0;
    let right = records.length - 1;
  
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      
      if (records[mid].id === targetId) {
        return mid;
      }
  
      if (records[mid].id < targetId) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  
    return -1; 
  }


  async updateIndexFile() {
    const indexFilePath = path.join(this.getUserDataPath('index'), 'index.txt');
    try {
      const fileStream = fs.createReadStream(indexFilePath);
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity, 
      });

      const updatedLines = [];

      for await (const line of rl) {
        const [maxIndex, blockIndex] = line.split(' ').map(Number);
        const updatedMaxIndex = maxIndex * 2;
        updatedLines.push(`${updatedMaxIndex} ${blockIndex}`);
      }

      await fs.promises.writeFile(indexFilePath, updatedLines.join('\n') + '\n');
    } catch (error) { }
  }

  async getFileName(id) {
    const indexFilePath = path.join(this.getUserDataPath('index'), 'index.txt');
    
    try {
      const fileStream = fs.createReadStream(indexFilePath);
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,  
      });

      for await (const line of rl) {
        const [maxIndex, blockIndex] = line.split(' ').map(Number);

        if (id <= maxIndex) {
          return path.join(this.getUserDataPath('data'), `data${blockIndex}.txt`); 
        }
      }
      await this.restructureDataFiles();  
      return await this.getFileName(id);  
    } catch (error) {
      return null;
    }
  }

  async restructureDataFiles() {
    const allRecords = [];

    for (let i = 0; i < FILE_COUNT; i++) {
      const dataFilePath = path.join(this.getUserDataPath('data'), `data${i}.txt`);
      const data = await fs.readFile(dataFilePath, 'utf-8');
      const fileRecords = data.split('\n').filter(line => line.trim()).map(line => {
        const [id, username, password] = line.split(',');
        return { id: parseInt(id, 10), username, password };
      });
      allRecords.push(...fileRecords);
    }

    await this.updateIndexFile();

    const indexFilePath = path.join(this.getUserDataPath('index'), 'index.txt');
    const blockLimits = [];

    const fileStream = fs.createReadStream(indexFilePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      const [maxIndex, blockIndex] = line.split(' ').map(Number);
      blockLimits[blockIndex] = maxIndex;
    }

    const blocks = Array.from({ length: FILE_COUNT }, () => []);
    allRecords.forEach(record => {
      const blockIndex = blockLimits.findIndex(limit => record.id <= limit);
      if (blockIndex !== -1) {
        blocks[blockIndex].push(record);
      }
    });

    for (let i = 0; i < blocks.length; i++) {
      const paddedRecords = blocks[i].map(record => record ? `${record.id},${record.username},${record.password}` : " , , ").join('\n') + '\n';
      await fs.outputFile(path.join(this.getUserDataPath('data'), `data${i}.txt`), paddedRecords);
    }
  }
}

const electronApp = new ElectronApp();

app.on('ready', async () => {
  await electronApp.initializeFiles(); 
  electronApp.createWindow();
});


ipcMain.handle('add-record', async (event, { id, username, password }) => {
  await electronApp.addRecord(id, username, password);
});

ipcMain.handle('get-all-records', async () => {
  return await electronApp.getAllRecords();
});

ipcMain.handle('delete-record', async (event, id) => {
  await electronApp.deleteRecord(id);
});

ipcMain.handle('edit-record', async (event, { id, username, password }) => {
  await electronApp.editRecord(id, username, password);
});

ipcMain.handle('generate-records', async (event, records) => {
  await electronApp.generateRecords(records);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
