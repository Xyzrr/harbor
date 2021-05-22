import activeWin from '@xyzrr/active-win';

setInterval(() => {
  try {
    const aw = activeWin.sync({ screenRecordingPermission: false });
    if (aw == null) {
      throw new Error(`activeWin.sync returned ${aw}`);
    }
    process.send?.(aw);
  } catch (err) {
    console.error(`ACTIVE-WIN ERROR: ${err}`);
  }
}, 2000);
