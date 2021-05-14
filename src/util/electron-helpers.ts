import { BrowserWindow } from 'electron';

export const centerOnParent = (child: BrowserWindow) => {
  const bounds = child.getBounds();
  const parentBounds = child.getParentWindow().getBounds();

  child.setPosition(
    Math.round(parentBounds.x + parentBounds.width / 2 - bounds.width / 2),
    Math.round(parentBounds.y + parentBounds.height / 2 - bounds.height / 2)
  );
};
