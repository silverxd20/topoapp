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
let urlInstrucciones;
let urlProxified;
const winURL = process.env.NODE_ENV === "development" ? `http://localhost:9080` : `file://${__dirname}/index.html`;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    show: false,
    useContentSize: true,
    frame: false,
    backgroundColor: "#f1efeb",
    webPreferences: {
      nodeIntegration: true
      //devTools: false,
    }
  });

  mainWindow.setMenu(null);
  mainWindow.maximize();
  mainWindow.show();
  mainWindow.webContents.loadURL(winURL);

  //Cambia el título
  mainWindow.setTitle("Toposat vector");

  mainWindow.on("page-title-updated", (event, title) => {
    event.preventDefault();
  });

  // Open dev tools initially when in development mode
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.on("did-frame-finish-load", () => {
      mainWindow.webContents.once("devtools-opened", () => {
        mainWindow.focus();
      });
      mainWindow.webContents.openDevTools();
    });
  }

  //Listener del evento close de la ventana principal
  mainWindow.on("closed", event => {
    console.log("Cerrado");
    instructionsWindow.destroy();
  });

  //.........................segunda ventana instrucciones..............

  instructionsWindow = new BrowserWindow({
    show: false,
    useContentSize: true,
    backgroundColor: "#f1efeb",
    javascript: true,
    webPreferences: {
      devTools: false
    }
  });

  //Quita el menu
  instructionsWindow.setMenu(null);
  //Cambia el título
  instructionsWindow.setTitle("Instrucciones del trabajo");

  instructionsWindow.on("page-title-updated", (event, title) => {
    event.preventDefault();
  });

  //Muestra la ventana de instrucciones
  ipcMain.on("show-instrucciones", (event, url) => {
    urlInstrucciones = url;
    urlProxified = "http://translate.google.com/translate?hl=&sl=en&tl=es&u=" + urlInstrucciones + "&sandbox=1";
    instructionsWindow.webContents.loadURL(urlProxified);
    instructionsWindow.maximize();
    instructionsWindow.show();
  });

  instructionsWindow.webContents.on("dom-ready", e => {
    instructionsWindow.webContents.insertCSS("#clp-btn { visibility: hidden !important; }");
    instructionsWindow.webContents.insertCSS("#wtgbr { margin-top: -60px !important; }");
    instructionsWindow.webContents.insertCSS("#contentframe { top: 37px !important; }");
    instructionsWindow.webContents.insertCSS("#gt-appbar { padding: 3px 38px !important; }");
    instructionsWindow.webContents.insertCSS("#gt-sl, #gt-tl { pointer-events: none !important; }");
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
  instructionsWindow.webContents.on("did-fail-load", (event, errorCode, errorDescription, validatedURL) => {
    console.log("Reintentando conexión con las instrucciones");
    if (errorCode == -3) {
      console.log("Codigo de error: " + errorCode + " validatedURL: " + validatedURL);
    } else {
      instructionsWindow.webContents.loadURL(urlProxified);
    }
  });
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("app_version", event => {
  event.sender.send("app_version", { version: app.getVersion() });
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

import { autoUpdater } from "electron-updater";

// Cuando se descarga una vuena version muestra la notificación de reiniciar el app
autoUpdater.on("update-downloaded", () => {
  mainWindow.webContents.send("update_downloaded");
});
// Reinicia la aplicación e instala la actualización
ipcMain.on("restart_app", () => {
  autoUpdater.quitAndInstall();
});

app.on("ready", () => {
  createWindow();
  //autoUpdater.checkForUpdates()
  if (process.env.NODE_ENV === "production") autoUpdater.checkForUpdates();
});
