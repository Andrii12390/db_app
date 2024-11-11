const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs-extra');
const readline = require('readline');

const FILE_COUNT = 10;

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadURL('http://localhost:3000');
};

const getUserDataPath = (folderName) => {
  return path.join(app.getPath('userData'), folderName);
};

ipcMain.handle('add-record', async (event, id, username, password) => {
  try {
    const dataFilePath = await getFileName(id);
    await fs.promises.appendFile(dataFilePath, `${id},${username},${password}\n`);
  } catch (error) {
    console.error('Error adding record:', error);
  }
});

ipcMain.handle('generate-records', async (event, records) => {
  try {
    for (const record of records) {
      const { id, username, password } = record;
      const dataFilePath = await getFileName(id);
      await fs.promises.appendFile(dataFilePath, `${id},${username},${password}\n`);
    }
  } catch (error) {
    console.error("Error generating records:", error);
  }
});

ipcMain.handle('load-block', async (event, blockIndex) => {
  const dataFilePath = path.join(getUserDataPath('data'), `data${blockIndex}.txt`);
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
});

ipcMain.handle('get-all-records', async () => {
  try {
    const allRecords = [];
    for (let i = 0; i < FILE_COUNT; i++) {
      const dataFilePath = path.join(getUserDataPath('data'), `data${i}.txt`);
      const data = await fs.readFile(dataFilePath, 'utf-8');
      const records = data.split('\n').map(line => {
        const [id, username, password] = line.split(',');
        return { 
          id: id ? parseInt(id, 10) : NaN, 
          username: username, 
          password: password 
        };
      });
      allRecords.push(...records);
    }
    return allRecords.filter((record) => !isNaN(record.id));
  } catch (error) {
    return [];
  }
});

ipcMain.handle('delete-record', async (event, id) => {
  try { 
    const dataFilePath = await getFileName(id);
    const data = await fs.promises.readFile(dataFilePath, 'utf-8');
    const fileRecords = data.split('\n').filter(line => line.trim()).map(line => {
      const [fileId, uname, pwd] = line.split(',');
      return { id: parseInt(fileId, 10), username: uname, password: pwd };
    });

    const indexToDelete = sharrSearch(fileRecords, id);
    if (indexToDelete === -1) {
      return;
    }

    fileRecords.splice(indexToDelete, 1); 

    const updatedData = fileRecords.map(record => `${record.id},${record.username},${record.password}`).join('\n') + '\n';
    await fs.promises.writeFile(dataFilePath, updatedData);

  } catch (error) { }
});

ipcMain.handle('edit-record', async (event, id, username, password) => {
  try {
    const dataFilePath = await getFileName(id);
    const data = await fs.promises.readFile(dataFilePath, 'utf-8');
    const fileRecords = data.split('\n').filter(line => line.trim()).map(line => {
      const [fileId, uname, pwd] = line.split(',');
      return { id: parseInt(fileId, 10), username: uname, password: pwd };
    });

    const indexToEdit = sharrSearch(fileRecords, id);

    if (indexToEdit === -1) {
      return;
    }
    fileRecords[indexToEdit].username = username;
    fileRecords[indexToEdit].password = password;

    const updatedData = fileRecords.map(record => `${record.id},${record.username},${record.password}`).join('\n');
    await fs.promises.writeFile(dataFilePath, updatedData);

  } catch (error) { }
});

async function initializeFiles() {
  await fs.ensureDir(getUserDataPath('data'));
  await fs.ensureDir(getUserDataPath('index'));
  
  for (let i = 0; i < FILE_COUNT; i++) {
    const dataFilePath = path.join(getUserDataPath('data'), `data${i}.txt`);
    if (!(await fs.pathExists(dataFilePath))) {
      await fs.outputFile(dataFilePath, '');
    }
  }

  const indexFilePath = path.join(getUserDataPath('index'), 'index.txt');
  const indexContent = `10 0\n20 1\n30 2\n40 3\n50 4\n60 5\n70 6\n80 7\n90 8\n100 9\n`;

  if (!(await fs.pathExists(indexFilePath))) {
    await fs.outputFile(indexFilePath, indexContent);
  }
}

function sharrSearch(records, targetId) {
  if (records.length === 1) {
    return 0;
  }
  let left = 0;
  let right = records.length - 1;

  while (left <= right) {
    const mid = Math.floor(left + ((right - left) / (records[right].id - records[left].id)) * (targetId - records[left].id));

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

async function updateIndexFile() {
  const indexFilePath = path.join(getUserDataPath('index'), 'index.txt');
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

async function getFileName(id) {
  const indexFilePath = path.join(getUserDataPath('index'), 'index.txt');
  
  try {
    const fileStream = fs.createReadStream(indexFilePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,  
    });

    for await (const line of rl) {
      const [maxIndex, blockIndex] = line.split(' ').map(Number);

      if (id <= maxIndex) {
        return path.join(getUserDataPath('data'), `data${blockIndex}.txt`); 
      }
    }
    await restructureDataFiles();  
    return await getFileName(id);  
  } catch (error) {
    return null;
  }
}

async function restructureDataFiles() {
  const allRecords = [];

  for (let i = 0; i < FILE_COUNT; i++) {
    const dataFilePath = path.join(getUserDataPath('data'), `data${i}.txt`);
    const data = await fs.readFile(dataFilePath, 'utf-8');
    const fileRecords = data.split('\n').filter(line => line.trim()).map(line => {
      const [id, username, password] = line.split(',');
      return { id: parseInt(id, 10), username, password };
    });
    allRecords.push(...fileRecords);
  }

  await updateIndexFile();

  const indexFilePath = path.join(getUserDataPath('index'), 'index.txt');
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
    await fs.outputFile(path.join(getUserDataPath('data'), `data${i}.txt`), paddedRecords);
  }
}

app.on('ready', async () => {
  await initializeFiles(); 
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
