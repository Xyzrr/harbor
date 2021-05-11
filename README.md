# Harbor - Electron

This is the Electron client for Harbor. It's built off [Electron React Boilerplate](https://electron-react-boilerplate.js.org/) and uses [styled-components](https://styled-components.com/) for styling.

## Setting up

Just clone and install dependencies with:

```bash
yarn
```

## Starting Development

For the normal dev environment:

```bash
yarn start
```

For a low-power, audio-off version so you can run multiple instances without frying your computer:

```bash
yarn hack
```

There's also `yarn hack2` and `yarn hack3` for spinning up on different ports.

## Packaging for Production

To package apps for the local platform:

```bash
yarn package
```

## About the architecture

Much of the state is stored in a set of 4 contexts. Each context has a corresponding manager, except for VideoCallContext which has multiple managers that can be swapped out. Context managers depend on each other in a DAG structure.

1. LocalInfoContext - no dependencies. This contains basic info about the user like their name and ID. Provides functions for things like changing your name.

2. LocalMediaContext - no dependencies. This manages of all the user's local media state, like whether their camera and mic are on. You toggle your camera and mic by calling functions provided by this context. This context also manages a MediaStreamTrack for local video and audio, available without being in a call. This is useful for previewing your video and volume before joining a room.

3. ColyseusContext - depends on LocalInfoContext and LocalMediaContext. This talks to the server which runs [Colyseus](https://www.colyseus.io/), a multiplayer game framework that helps with synchronizing state across clients. Whenever you update your LocalMediaContext, ColyseusContext listens and tells the server so that it can broadcast the change to everyone else in the space. The Colyseus server tells you everything that you don't directly control, like what room you're in, where the other participants are, and their state.

4. VideoCallContext - depends on all of the above. This context's manager communicates with the video call API to provide track and track metadata info from nearby participants. It doesn't provide any functions to call; it operates on its own by listening to changes in LocalMediaContext and ColyseusContext. Currently the only VideoCallContext manager is DailyVideoCallContextProvider, which uses Daily (https://www.daily.co/), but it can be swapped out with other managers without changing code anywhere else. Moreover, we can actually swap out the VideoCallContext manager automatically based on what room you're in, allowing us to take advantage of the benefits of different APIs. For example, Agora (https://www.agora.io/en/) enables broadcasting from a small number of uploaders to an audience of a million, while Daily enables 200 participants talking to each other simultaneously. So we can have a broadcasting room use Agora and other rooms use Daily. This way we can also compare the call quality of different providers (including our own, when we roll one) without restarting the app.
