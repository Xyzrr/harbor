# Harbor - Electron

This is the Electron client for Harbor. It's built off [Electron React Boilerplate](https://electron-react-boilerplate.js.org/) and uses [styled-components](https://styled-components.com/) for styling. The server code is [here](https://github.com/Xyzrr/virtual-office-server).

![preview-macbook](https://user-images.githubusercontent.com/7032597/127399420-56dd71bb-3008-49af-b0cc-76bee1fb04c0.png)

## Setting up

Make sure you have [XCode](https://www.freecodecamp.org/news/how-to-download-and-install-xcode/) installed.
Otherwise, you will run into the following error:

```
xcrun: error: unable to find utility "xctest", not a developer tool or in PATH
```

Just clone and install dependencies with:

```bash
yarn
```

## Starting Development

To start a dev environment connected to the production server:

```bash
yarn start
```

You can set the environment variable `DEV_TOOLS=1` to make a dev tools window automatically open alongside every window, but this can be annoying because there's so many windows. By default, you can open devtools with cmd+shift+I.

To start a dev environment connected to a local server:

```bash
yarn hack
```

There's also `yarn hack2` and `yarn hack3` for spinning up on different ports.

## Packaging for Production

When you update the version number in `src/package.json` (NOT the top-level `package.json`) and push to Github, the Github action `.github/workflows/publish.yml` will automatically upload a new release to this repository after ~15-20 minutes. To make the release public, edit it and click publish. Clients will automatically find the new version and update themselves.

Sometimes the packaged build behaves differently than the dev build. To package a release locally with dev tools enabled, run:

```bash
DEBUG_PROD=1 yarn package
```

## About the architecture

### Processes

All electron apps have a main process and one or more renderer processes. Harbor has just one renderer process, but it spawns many `BrowserWindow`s and controls them synchronously within a single React app. Most of the magic that makes this possible is in `NewWindow.tsx`. The entry point for the main process is `main.dev.ts`, and from there the main window is spawned in `createWindow()`.

The entry point for the renderer process is `index.tsx`.

Harbor also spawns a third process with very little code: `active-win-loop.ts`. It just checks what app you currently have focused every 2 seconds.

Chromium also starts a few other processes. I'm not sure what they all do.

### State

Most of the state in the app is stored in contexts. Each context has a corresponding manager, except for VideoCallContext which has multiple managers that can be swapped out. Context managers depend on each other in a DAG structure.

1. UserSettingsContext - no dependencies. Covers entire app. Contains basic info about the user like their name, ID, and color. Provides functions for things like changing your name.

2. LocalMediaContext - no dependencies. Covers a single space. This manages of all the user's local media state, like whether their camera and mic are on. You toggle your camera and mic by calling functions provided by this context. This context also manages a MediaStreamTrack for local video and audio, available without being in a call. This is useful for previewing your video and volume before joining a room.

3. PlayerStateContext - no dependencies. Covers a single space, only after you've joined. Stores state that is local to a single session, like who you're currently whispering to.

4. ColyseusContext - depends on UserSettingsContext and LocalMediaContext. Covers a single space, only after you've joined. This talks to the server which runs [Colyseus](https://www.colyseus.io/), a multiplayer game framework that helps with synchronizing state across clients. Whenever you update your LocalMediaContext, ColyseusContext listens and tells the server so that it can broadcast the change to everyone else in the space. The Colyseus server tells you everything that you don't directly control, like what room you're in, where the other participants are, and their state.

5. VideoCallContext - depends on all of the above. Covers a single space, only after you've joined. This context's manager communicates with the video call API to provide track and track metadata info from nearby participants. It doesn't provide any functions to call; it operates on its own by listening to changes in LocalMediaContext and ColyseusContext. Currently the only VideoCallContext manager is DailyVideoCallContextProvider, which uses Daily (https://www.daily.co/), but it can be swapped out with other managers without changing code anywhere else. Moreover, we can actually swap out the VideoCallContext manager automatically based on what room you're in, allowing us to take advantage of the benefits of different APIs. For example, Agora (https://www.agora.io/en/) enables broadcasting from a small number of uploaders to an audience of a million, while Daily enables 200 participants talking to each other simultaneously. So we can have a broadcasting room use Agora and other rooms use Daily. This way we can also compare the call quality of different providers (including our own, when we roll one) without restarting the app.
