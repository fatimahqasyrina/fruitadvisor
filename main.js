const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let analysisWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadFile('renderer/index.html');
}

function createAnalysisWindow() {
  analysisWindow = new BrowserWindow({
    width: 600,
    height: 500,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  analysisWindow.loadFile('renderer/analysis.html');
}

// Simpan buah ke JSON 
ipcMain.on('save-fruit', (event, data) => {
  const dirPath = path.join(__dirname, 'data');
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);
  
  const filePath = path.join(dirPath, 'recommendations.json');
  let fruits = [];

  if (fs.existsSync(filePath)) {
    fruits = JSON.parse(fs.readFileSync(filePath));
  }
  fruits.push(data);
  fs.writeFileSync(filePath, JSON.stringify(fruits, null, 2));
});

ipcMain.on('update-fruit-note', (event, { index, note }) => {
    const filePath = path.join(__dirname, 'data', 'recommendations.json');
    if (fs.existsSync(filePath)) {
        let fruits = JSON.parse(fs.readFileSync(filePath));
        
        // Simpan nota 
        if (fruits[index]) {
            fruits[index].notes = note; 
        }
        
        fs.writeFileSync(filePath, JSON.stringify(fruits, null, 2));
    }
});

// Listener untuk buka window analysis
ipcMain.on('open-analysis-window', () => {
  createAnalysisWindow();
});

// Load senarai buah (Read)
ipcMain.handle('load-fruits', () => {
  const filePath = path.join(__dirname, 'data', 'recommendations.json');
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath));
  }
  return [];
});

// del buah
ipcMain.on('delete-fruit', (event, index) => {
    const filePath = path.join(__dirname, 'data', 'recommendations.json');
    if (fs.existsSync(filePath)) {
        let fruits = JSON.parse(fs.readFileSync(filePath));
        fruits.splice(index, 1);
        fs.writeFileSync(filePath, JSON.stringify(fruits, null, 2));
    }
});


app.whenReady().then(createMainWindow);