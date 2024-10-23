var _a = require('electron/main'), app = _a.app, BrowserWindow = _a.BrowserWindow;
var createWindow = function () {
    var win = new BrowserWindow({
        width: 600,
        height: 400
    });
    win.loadFile('index.html');
};
app.whenReady().then(function () {
    createWindow();
});
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        app.quit();
});
