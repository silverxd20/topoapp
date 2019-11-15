import { app, BrowserWindow, ipcMain, Menu } from "electron";

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
  global.__static = require("path")
    .join(__dirname, "/static")
    .replace(/\\/g, "\\\\");
}

let mainWindow;
let instructionsWindow;
let urlInstrucciones
const winURL = process.env.NODE_ENV === "development" ? `http://localhost:9080` : `file://${__dirname}/index.html`;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    show: false,
    useContentSize: true,
    frame: false,
    backgroundColor: "#f1efeb"
  });

  mainWindow.maximize();
  mainWindow.show();
  mainWindow.loadURL(winURL);

  //Listener del evento close de la ventana principal
  mainWindow.on("closed", event => {
    console.log("Cerrado");
    instructionsWindow.hide();
  });

  //.........................segunda ventana instrucciones..............

  instructionsWindow = new BrowserWindow({
    show: false,
    useContentSize: true,
    frame: true,
    backgroundColor: "#f1efeb"
  });
  //Quita el menu
  instructionsWindow.setMenu(null);
  //Cambia el título
  instructionsWindow.setTitle("Instrucciones del trabajo");

  //Muestra la ventana de instrucciones
  ipcMain.on("show-instrucciones", (event, url) => {
    urlInstrucciones = url
    instructionsWindow.webContents.loadURL(urlInstrucciones);
    instructionsWindow.maximize();
    instructionsWindow.show();
  });

  //Listener cuando da click al daskboard
  ipcMain.on("click-dashboard", e => {
    instructionsWindow.hide();
  });

  //Evita que se cierre la ventana
  instructionsWindow.on(
    "close",
    (instructionsWindow.onbeforeunload = e => {
      console.log("I do not want to be closed");

      e.preventDefault();
      //e.returnValue = false;
    })
  );

  //Si falla la carga
  instructionsWindow.webContents.on("did-fail-load",(e)=>{
    console.log("Falló en cargar,Reintentando")
    instructionsWindow.webContents.loadURL(urlInstrucciones);
  })
}
app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
