const activeWin = require('xyzrr/active-win');

setInterval(() => {
  process.send?.(activeWin.sync({ screenRecordingPermission: false }));
}, 2000);
