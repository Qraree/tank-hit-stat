const {app, BrowserWindow} = require('electron');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 900,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })

    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()
})



app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
