/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build:main`, this file is compiled to
 * `./src/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import {
  app,
  BrowserWindow,
  shell,
  Tray,
  Menu,
  screen,
  ipcMain,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../assets');

const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

let tray: Tray | null = null;
let mainWindow: BrowserWindow | null = null;
let panelsWindow: BrowserWindow | null = null;

const createTray = async () => {
  tray = new Tray(getAssetPath('mic.png'));

  tray.on('click', () => {
    if (!mainWindow) {
      return;
    }

    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });
};

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  const trayBounds = tray!.getBounds();

  console.log('mw bounds', mainWindow, trayBounds);

  mainWindow = new BrowserWindow({
    transparent: true,
    show: false,
    width: 200,
    height: 212,
    titleBarStyle: 'hidden',
    x: trayBounds.x + trayBounds.width / 2 - 100,
    y: trayBounds.y + trayBounds.height + 4,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      nativeWindowOpen: true,
    },
  });

  mainWindow.setWindowButtonVisibility(false);

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  mainWindow.webContents.setWindowOpenHandler(
    ({ frameName, features, url }) => {
      if (frameName === 'panels') {
        const workareaBounds = screen.getPrimaryDisplay().workArea;

        return {
          action: 'allow',
          overrideBrowserWindowOptions: {
            width: 252,
            height: workareaBounds.height,
            alwaysOnTop: true,
            y: workareaBounds.y,
            x: workareaBounds.width - 252,
            acceptFirstMouse: true,
            resizable: false,
            maximizable: false,
            minimizable: false,
            focusable: false,
            closable: false,
          },
        };
      }

      shell.openExternal(url);

      return { action: 'deny' };
    }
  );

  mainWindow.webContents.on(
    'did-create-window',
    (win, { frameName, options }) => {
      if (frameName === 'panels') {
        panelsWindow = win;
        win.setWindowButtonVisibility(false);
        win.on('ready-to-show', () => {
          win.show();
        });
      }
    }
  );

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

const trackMouse = () => {
  setInterval(() => {
    if (!panelsWindow || !mainWindow) {
      return;
    }

    const t = Date.now();
    const panelsWindowPosition = panelsWindow.getPosition();
    const cursorPoint = screen.getCursorScreenPoint();
    const mousePosition = [
      cursorPoint.x - panelsWindowPosition[0],
      cursorPoint.y - panelsWindowPosition[1],
    ];

    mainWindow.webContents.send('mousePosition', mousePosition);
  }, 100);
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(createTray)
  .then(createWindow)
  .then(trackMouse)
  .catch(console.log);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

ipcMain.on('setIgnoreMouseEvents', (e, ignore?: boolean) => {
  if (ignore) {
    panelsWindow?.setIgnoreMouseEvents(true, { forward: true });
  } else {
    panelsWindow?.setIgnoreMouseEvents(false);
  }
});
