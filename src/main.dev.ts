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
import { app, BrowserWindow, shell, Tray, screen, ipcMain } from 'electron';
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

let mainWindow: BrowserWindow | null = null;
let spaceWindow: BrowserWindow | null = null;
let panelsWindow: BrowserWindow | null = null;
let popupWindow: BrowserWindow | undefined;

const createTray = async () => {};

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    title: 'Harbor',
    show: false,
    width: 420,
    height: 420,
    frame: false,
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 12, y: 24 },
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      nativeWindowOpen: true,
    },
  });

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

  mainWindow.on('close', (e) => {
    e.preventDefault();
    mainWindow?.hide();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  mainWindow.webContents.setWindowOpenHandler(
    ({ frameName, features, url }) => {
      if (frameName === 'space') {
        return {
          action: 'allow',
          overrideBrowserWindowOptions: {
            transparent: true,
            show: false,
            width: 200,
            height: 212,
            titleBarStyle: 'hidden',
          },
        };
      }

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

      if (frameName === 'popup') {
        return {
          action: 'allow',
          overrideBrowserWindowOptions: {
            width: 640,
            height: 400,
            minWidth: undefined,
            minHeight: undefined,
            resizable: false,
            maximizable: false,
            minimizable: false,
            backgroundColor: '#00000000',
            show: false,
            titleBarStyle: 'hidden',
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
      if (frameName === 'space') {
        spaceWindow = win;

        const tray = new Tray(getAssetPath('mic.png'));

        tray.on('click', () => {
          if (win.isVisible()) {
            win.hide();
          } else {
            win.show();
          }
        });

        const trayBounds = tray.getBounds();

        win.setPosition(
          trayBounds.x + trayBounds.width / 2 - 100,
          trayBounds.y + trayBounds.height + 4
        );
        win.setWindowButtonVisibility(false);
        win.on('ready-to-show', () => {
          win.show();
        });
        win.on('blur', () => {
          const focusedWindow = BrowserWindow.getFocusedWindow();
          console.log('FOCUSED WINDOW', focusedWindow);
          if (focusedWindow == null) {
            win.hide();
          }
        });
        win.on('close', () => {
          tray.destroy();
        });
        mainWindow?.hide();
      }

      if (frameName === 'panels') {
        panelsWindow = win;
        win.setWindowButtonVisibility(false);
        win.on('ready-to-show', () => {
          win.show();
        });
      }

      if (frameName === 'popup') {
        popupWindow = win;
        win.setWindowButtonVisibility(false);
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
  if (mainWindow == null) {
    createWindow();
  } else {
    mainWindow.show();
  }
});

ipcMain.on('setIgnoreMouseEvents', (e, ignore?: boolean) => {
  if (ignore) {
    panelsWindow?.setIgnoreMouseEvents(true, { forward: true });
  } else {
    panelsWindow?.setIgnoreMouseEvents(false);
  }
});

/**
 * Authentication
 */

let link: string | undefined;

// This will catch clicks on links such as <a href="harbor://abc=1">open in harbor</a>
app.on('open-url', function (event, data) {
  event.preventDefault();
  link = data;
  console.log('opened via url', event, data);
  mainWindow?.webContents.send('openUrl', data);
});

app.setAsDefaultProtocolClient('harbor');

ipcMain.handle('getUrl', () => {
  return link;
});

ipcMain.on('clearUrl', () => {
  link = undefined;
});

/**
 * Page switching
 */

ipcMain.on('setWindowSize', (e, size: { width: number; height: number }) => {
  if (mainWindow) {
    mainWindow.setMinimumSize(size.width, size.height);
    const bounds = mainWindow.getBounds();
    mainWindow.setBounds({
      x: bounds.x + (bounds.width - size.width) / 2,
      y: bounds.y + (bounds.height - size.height) / 2,
      width: size.width,
      height: size.height,
    });
  }
});

/**
 * Popups
 */

ipcMain.on('showPopup', (e, bounds: Electron.Rectangle) => {
  if (popupWindow && mainWindow) {
    const parentBounds = mainWindow.getBounds();
    popupWindow.show();
    popupWindow.setBounds({
      ...bounds,
      x: bounds.x + parentBounds.x,
      y: bounds.y + parentBounds.y,
    });
  }
});
