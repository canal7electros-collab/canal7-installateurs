/* Canal 7 pour ordi : ouvre l'app en ligne dans sa propre fenêtre, sans navigateur.
   Les mises à jour de l'app arrivent toutes seules (c'est l'app en ligne). */
const { app, BrowserWindow, shell } = require('electron');
const APP = 'https://canal7-app.pages.dev/';
const ORIGINE = new URL(APP).origin;

if (!app.requestSingleInstanceLock()) app.quit();

function fenetre() {
  const w = new BrowserWindow({
    width: 1280, height: 860, minWidth: 375, minHeight: 600,
    backgroundColor: '#111111', title: 'Canal 7', autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, sandbox: true }
  });
  w.loadURL(APP);
  /* liens vers d'autres sites (PayPal, cartes, emails…) : dans le navigateur de l'ordi */
  w.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith(ORIGINE)) return { action: 'allow' };
    shell.openExternal(url); return { action: 'deny' };
  });
  w.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith(ORIGINE)) { e.preventDefault(); shell.openExternal(url); }
  });
  return w;
}

app.on('second-instance', () => { const w = BrowserWindow.getAllWindows()[0]; if (w) { if (w.isMinimized()) w.restore(); w.focus(); } });
app.whenReady().then(() => { fenetre(); app.on('activate', () => { if (!BrowserWindow.getAllWindows().length) fenetre(); }); });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
