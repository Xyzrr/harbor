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
  screen,
  ipcMain,
  systemPreferences,
  MenuItem,
  Menu,
  Dock,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder, { quittingFromMenu } from './menu';
import { openSystemPreferences } from 'electron-util';
import activeWin from 'xyzrr/active-win';
import * as _ from 'lodash';
import { fork } from 'child_process';

let menu: Menu | null = null;

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;

    const hideAllUpdaterMenuItems = () => {
      const items = [
        'check-for-update',
        'checking-for-update',
        'update-available',
        'on-latest-version',
        'error-updating',
        'downloading-update',
        'update-and-restart',
      ];
      items.forEach((id) => {
        const item = menu?.getMenuItemById(id);
        if (item) {
          item.visible = false;
        }
      });
    };

    autoUpdater.on('checking-for-update', () => {
      hideAllUpdaterMenuItems();
      const item = menu?.getMenuItemById('checking-for-update');
      if (item) {
        item.visible = true;
      }
      Menu.setApplicationMenu(menu);
    });

    autoUpdater.on('update-available', () => {
      hideAllUpdaterMenuItems();
      const item = menu?.getMenuItemById('downloading-update');
      if (item) {
        item.visible = true;
      }
      Menu.setApplicationMenu(menu);
    });

    autoUpdater.on('update-not-available', () => {
      hideAllUpdaterMenuItems();
      const item = menu?.getMenuItemById('on-latest-version');
      if (item) {
        item.visible = true;
      }
      Menu.setApplicationMenu(menu);
    });

    autoUpdater.on('error', (err) => {
      hideAllUpdaterMenuItems();
      const item = menu?.getMenuItemById('error-updating');
      if (item) {
        item.visible = true;
      }
      Menu.setApplicationMenu(menu);
    });

    autoUpdater.on('download-progress', (progressObj) => {
      log.info(`Download progress: ${progressObj.percent}%`);
    });

    autoUpdater.on('update-downloaded', () => {
      hideAllUpdaterMenuItems();
      const item = menu?.getMenuItemById('update-and-restart');
      if (item) {
        item.visible = true;
      }
      Menu.setApplicationMenu(menu);
    });

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
  require('electron-debug')({ showDevTools: process.env.DEV_TOOLS });
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      { loadExtensionOptions: { allowFileAccess: true }, forceDownload }
    )
    .catch(console.log);
};

let mainWindow: BrowserWindow | null = null;
let spaceWindow: BrowserWindow | null = null;
let panelsWindow: BrowserWindow | null = null;
let popupWindow: BrowserWindow | null = null;

/**
 * App tracking
 */

let onActiveWin:
  | ((
      aw:
        | activeWin.MacOSResult
        | activeWin.LinuxResult
        | activeWin.WindowsResult
        | undefined
    ) => void)
  | undefined;

const activeWinLoop = fork(
  path.join(__dirname, 'active-win-loop.prod.js'),
  [],
  {
    stdio: 'inherit',
  }
);
activeWinLoop.on('message', (aw: any) => {
  // console.log('active win', aw);
  onActiveWin?.(aw);
  mainWindow?.webContents.send('activeWin', aw);
});

/**
 * Home window hack
 */

let quitting = false;
app.on('before-quit', () => {
  quitting = true;
});

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
    width: 360,
    height: 360,
    vibrancy: 'menu',
    titleBarStyle: process.platform === 'win32' ? 'default' : 'hidden',
    autoHideMenuBar: true,
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
    if (!quitting && !quittingFromMenu) {
      e.preventDefault();
      mainWindow?.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menu = menuBuilder.buildMenu();

  Menu.setApplicationMenu(menu);

  mainWindow.webContents.setWindowOpenHandler(
    ({ frameName, features, url }) => {
      const [windowType, uniqueID] = frameName.split(':');

      if (windowType === 'space') {
        return {
          action: 'allow',
          overrideBrowserWindowOptions: {
            transparent: true,
            show: false,
            width: 240,
            height: 252,
            minWidth: 240,
            minHeight: 252,
            titleBarStyle: 'hidden',
            vibrancy: undefined,
          },
        };
      }

      if (windowType === 'panels') {
        const workareaBounds = screen.getPrimaryDisplay().workArea;

        return {
          action: 'allow',
          overrideBrowserWindowOptions: {
            width: 272,
            height: workareaBounds.height,
            alwaysOnTop: true,
            y: workareaBounds.y,
            x: workareaBounds.width - 272,
            acceptFirstMouse: true,
            resizable: false,
            maximizable: false,
            minimizable: false,
            focusable: false,
            transparent: true,
            hasShadow: false,
            vibrancy: undefined,
          },
        };
      }

      if (windowType === 'popup') {
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
            focusable: false,
            alwaysOnTop: true,
            show: false,
            titleBarStyle: 'hidden',
            vibrancy: undefined,
          },
        };
      }

      if (windowType === 'screen-share-picker') {
        return {
          action: 'allow',
          overrideBrowserWindowOptions: {
            width: 840,
            height: 600,
            minWidth: undefined,
            minHeight: undefined,
            resizable: false,
            transparent: false,
            backgroundColor: '#222',
            maximizable: false,
            minimizable: false,
            show: false,
            vibrancy: undefined,
          },
        };
      }

      if (windowType === 'screen-share-toolbar') {
        const workAreaBounds = screen.getPrimaryDisplay().workArea;

        return {
          action: 'allow',
          overrideBrowserWindowOptions: {
            width: 252,
            height: 52,
            x: workAreaBounds.x + workAreaBounds.width / 2 - 252 / 2,
            y: workAreaBounds.y + workAreaBounds.height - 52 - 8,
            minWidth: undefined,
            minHeight: undefined,
            resizable: false,
            transparent: false,
            vibrancy: 'menu',
            focusable: false,
            alwaysOnTop: true,
            titleBarStyle: 'hidden',
            show: false,
          },
        };
      }

      if (windowType === 'screen-share-overlay') {
        return {
          action: 'allow',
          overrideBrowserWindowOptions: {
            transparent: true,
            minWidth: undefined,
            minHeight: undefined,
            titleBarStyle: 'hidden',
            hasShadow: false,
            show: false,
            vibrancy: undefined,
          },
        };
      }

      if (windowType === 'permission-helper-window') {
        return {
          action: 'allow',
          overrideBrowserWindowOptions: {
            width: 640,
            height: 400,
            minWidth: undefined,
            minHeight: undefined,
            resizable: false,
            transparent: false,
            maximizable: false,
            minimizable: false,
            backgroundColor: '#00000000',
            show: false,
            vibrancy: undefined,
          },
        };
      }

      if (windowType === 'profile') {
        return {
          action: 'allow',
          overrideBrowserWindowOptions: {
            width: 640,
            height: 400,
            minWidth: undefined,
            minHeight: undefined,
            show: false,
          },
        };
      }

      if (windowType === 'local-video-preview') {
        const spaceWindowBounds = spaceWindow?.getBounds();
        if (!spaceWindowBounds) {
          return { action: 'deny' };
        }

        return {
          action: 'allow',
          overrideBrowserWindowOptions: {
            x: spaceWindowBounds.x,
            y: spaceWindowBounds.y + spaceWindowBounds.height + 8,
            width: 160,
            height: 90,
            hasShadow: false,
            show: false,
            focusable: false,
            alwaysOnTop: true,
          },
        };
      }

      if (windowType === 'remote-user-panel') {
        return {
          action: 'allow',
          overrideBrowserWindowOptions: {
            width: 480,
            height: 270,
            show: false,
          },
        };
      }

      if (windowType === 'remote-screen-panel') {
        return {
          action: 'allow',
          overrideBrowserWindowOptions: {
            width: 640,
            height: 400,
            show: false,
          },
        };
      }

      if (windowType === 'debug-panel') {
        return {
          action: 'allow',
          overrideBrowserWindowOptions: {
            width: 300,
            height: 500,
            minWidth: undefined,
            minHeight: undefined,
            resizable: false,
            maximizable: false,
            backgroundColor: '#00000000',
            show: true,
            titleBarStyle: 'hidden',
            vibrancy: undefined,
          },
        };
      }

      if (windowType === 'popup-shield') {
        const screenBounds = screen.getPrimaryDisplay().bounds;

        return {
          action: 'allow',
          overrideBrowserWindowOptions: {
            x: 0,
            y: 0,
            width: screenBounds.width,
            height: screenBounds.height,
            minWidth: undefined,
            minHeight: undefined,
            resizable: false,
            maximizable: false,
            focusable: false,
            alwaysOnTop: true,
            transparent: true,
            frame: false,
            hasShadow: false,
            backgroundColor: '#00000000',
            show: true,
            titleBarStyle: 'hidden',
            vibrancy: undefined,
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
      const [windowType, uniqueID] = frameName.split(':');

      if (windowType === 'space') {
        spaceWindow = win;

        const tray = new Tray(getAssetPath('mic_on_camera_off@2x.png'));

        const revealSpace = () => {
          const trayBounds = tray.getBounds();
          const windowSize = win.getSize();

          win.setPosition(
            trayBounds.x +
              Math.round(trayBounds.width / 2) -
              Math.round(windowSize[0] / 2),
            trayBounds.y + trayBounds.height + 4
          );

          win.show();
        };

        tray.on('click', () => {
          if (win.isVisible()) {
            win.hide();
          } else {
            revealSpace();
          }
        });

        win.setWindowButtonVisibility?.(false);
        win.on('ready-to-show', () => {
          // Timeout is needed on Big Sur because of dumb bug;
          // the tray bounds are wrong for the first 100ms.
          setTimeout(() => {
            revealSpace();
          }, 100);
        });
        win.on('blur', () => {
          const focusedWindow = BrowserWindow.getFocusedWindow();
          if (focusedWindow == null) {
            win.hide();
          }
        });
        win.on('resize', () => {
          revealSpace();
        });

        const onMediaSettingsChange = (
          e: Electron.IpcMainEvent,
          settings: {
            localAudioInputOn: boolean;
            localVideoInputOn: boolean;
          }
        ) => {
          if (settings.localAudioInputOn && settings.localVideoInputOn) {
            tray.setImage(getAssetPath('mic_on_camera_on@2x.png'));
          } else if (
            !settings.localAudioInputOn &&
            settings.localVideoInputOn
          ) {
            tray.setImage(getAssetPath('mic_off_camera_on@2x.png'));
          } else if (
            settings.localAudioInputOn &&
            !settings.localVideoInputOn
          ) {
            tray.setImage(getAssetPath('mic_on_camera_off@2x.png'));
          } else {
            tray.setImage(getAssetPath('mic_off_camera_off@2x.png'));
          }
        };

        ipcMain.on('media-settings', onMediaSettingsChange);

        win.on('close', () => {
          spaceWindow = null;
          ipcMain.off('media-settings', onMediaSettingsChange);
          tray.destroy();
          mainWindow?.show();
        });
        mainWindow?.hide();
      }

      if (windowType === 'panels') {
        panelsWindow = win;
        win.setWindowButtonVisibility?.(false);
        win.on('ready-to-show', () => {
          win.show();
        });
        win.on('close', () => {
          panelsWindow = null;
        });
      }

      if (windowType === 'popup') {
        popupWindow = win;
        win.setWindowButtonVisibility?.(false);
        win.on('close', () => {
          popupWindow = null;
        });
      }

      if (windowType === 'screen-share-picker') {
        win.on('ready-to-show', () => {
          win.show();
        });
      }

      if (windowType === 'screen-share-toolbar') {
        win.setWindowButtonVisibility?.(false);
        win.on('ready-to-show', () => {
          win.show();
        });
      }

      if (windowType === 'screen-share-overlay') {
        win.setIgnoreMouseEvents(true);
        win.setContentProtection(true);
        win.setWindowButtonVisibility?.(false);

        const { shareSourceId } = options as any;

        const [sourceType, sourceId, sourceTab] = shareSourceId.split(':');
        const sourceIdNumber = parseInt(sourceId, 10);

        if (sourceType === 'screen') {
          const sharedDisplay = screen
            .getAllDisplays()
            .find((d) => d.id === sourceIdNumber);

          if (sharedDisplay) {
            win.setPosition(sharedDisplay.bounds.x, sharedDisplay.bounds.y);
          }

          win.show();
          win.setSimpleFullScreen(true);
          win.setAlwaysOnTop(true, 'screen-saver');
          win.setVisibleOnAllWorkspaces(true, {
            visibleOnFullScreen: true,
          });
          win.on('close', () => {
            win.hide();
            win.setSimpleFullScreen(false);
          });
        } else {
          win.setAlwaysOnTop(true, 'floating', -1);

          onActiveWin = (aw) => {
            if (aw && aw.id === sourceIdNumber) {
              if (!win.isVisible()) {
                win.show();
              }

              if (!_.isEqual(win.getBounds(), aw.bounds)) {
                win.setBounds(aw.bounds);
              }
              if (!win.isAlwaysOnTop()) {
                win.setAlwaysOnTop(true, 'floating', -1);
              }
            } else {
              if (!win.isVisible()) {
                return;
              }

              if (win.isAlwaysOnTop()) {
                win.setAlwaysOnTop(false);
                win.moveAbove(`window:${sourceIdNumber}:0`);
              }
            }
          };

          win.on('close', () => {
            onActiveWin = undefined;
          });
        }
      }

      if (windowType === 'permission-helper-window') {
        win.on('ready-to-show', () => {
          win.show();
        });
      }

      if (windowType === 'profile') {
        win.on('ready-to-show', () => {
          win.show();
        });
      }

      if (windowType === 'local-video-preview') {
        win.on('ready-to-show', () => {
          win.setWindowButtonVisibility?.(false);
          win.show();
        });
      }

      if (windowType === 'remote-user-panel') {
        win.on('ready-to-show', () => {
          win.show();
        });
      }

      if (windowType === 'remote-screen-panel') {
        win.on('ready-to-show', () => {
          win.show();
        });
      }

      if (windowType === 'popup-shield') {
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

app.whenReady().then(createWindow).then(trackMouse).catch(console.log);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow == null) {
    createWindow();
  } else if (spaceWindow && !spaceWindow.isVisible()) {
    spaceWindow.show();
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
    // Weird windows bug where winow becomes 16px narrower.
    const adjustedWidth = size.width + (process.platform === 'win32' ? 16 : 0);
    mainWindow.setMinimumSize(adjustedWidth, size.height);
    const bounds = mainWindow.getBounds();
    mainWindow.setBounds({
      x: bounds.x + (bounds.width - size.width) / 2,
      y: bounds.y + (bounds.height - size.height) / 2,
      width: adjustedWidth,
      height: size.height,
    });
  }
});

/**
 * Popups
 */

ipcMain.on('showPopup', (e, bounds: Electron.Rectangle) => {
  if (popupWindow) {
    popupWindow.setBounds({
      ...bounds,
      x: bounds.x,
      y: bounds.y,
    });
    popupWindow.show();
  }
});

/**
 * Screen sharing
 */

ipcMain.handle(
  'getMediaAccessStatus',
  (e, mediaType: 'microphone' | 'camera' | 'screen') => {
    return systemPreferences.getMediaAccessStatus(mediaType);
  }
);

ipcMain.handle('askForMediaAccess', (e, mediaType: 'microphone' | 'camera') => {
  return systemPreferences.askForMediaAccess(mediaType);
});

ipcMain.on(
  'openSystemPreferences',
  (
    e,
    pane: 'universalaccess' | 'security' | 'speech' | 'sharing' | undefined,
    section: string
  ) => {
    openSystemPreferences(pane, section as any);
  }
);

/**
 * Dragging for Windows
 */

ipcMain.on('dragWindow', (e, { mouseX, mouseY }) => {
  const focusedWindow = BrowserWindow.getFocusedWindow();

  if (!focusedWindow) {
    return;
  }

  if (focusedWindow.isMaximized()) {
    focusedWindow.unmaximize();
  }

  const { width } = focusedWindow.getBounds();
  if (mouseX > width) {
    mouseX = width;
  }

  const { x, y } = screen.getCursorScreenPoint();
  focusedWindow.setPosition(x - mouseX, y - mouseY);
});

/**
 * Hide windows with setContentProtection(true) from screen share
 */

app.commandLine.appendSwitch('disable-features', 'IOSurfaceCapturer');
