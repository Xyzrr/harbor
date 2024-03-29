import React from 'react';
import ReactDOM from 'react-dom';
import { StyleSheetManager } from 'styled-components';
import { jssPreset, StylesProvider } from '@material-ui/styles';
import { create, Jss } from 'jss';
import { uniqueId } from 'lodash';

export const NewWindowContext = React.createContext<Window>(window);

function copyStyles(sourceDoc: Document, targetDoc: Document) {
  Array.from(sourceDoc.styleSheets).forEach((styleSheet) => {
    if (styleSheet.cssRules) {
      // for <style> elements
      const newStyleEl = sourceDoc.createElement('style');

      Array.from(styleSheet.cssRules).forEach((cssRule) => {
        // write the text of each rule into the body of the style element
        newStyleEl.appendChild(sourceDoc.createTextNode(cssRule.cssText));
      });

      targetDoc.head.appendChild(newStyleEl);
    } else if (styleSheet.href) {
      // for <link> elements loading CSS from a URL
      const newLinkEl = sourceDoc.createElement('link');

      newLinkEl.rel = 'stylesheet';
      newLinkEl.href = styleSheet.href;
      targetDoc.head.appendChild(newLinkEl);
    }
  });
}

export interface NewWindowProps {
  className?: string;
  name: string;
  features?: string;
  windowRef?: React.MutableRefObject<Window | null>;
  onClose?(): void;
}

const NewWindow: React.FC<NewWindowProps> = ({
  name,
  features,
  children,
  windowRef,
  onClose,
}) => {
  const [containerEl, setContainerEl] = React.useState<Element>();
  const [newWindow, setNewWindow] = React.useState<Window | null>();

  const [jss, setJss] = React.useState<Jss>();
  const [sheetsManager, setSheetsManager] = React.useState<any>();

  React.useEffect(() => {
    const el = document.createElement('div');
    const win = window.open('', uniqueId(`${name}:`), features);

    if (win == null) {
      throw new Error('Could not open new window.');
    }

    if (windowRef) {
      windowRef.current = win;
    }

    setContainerEl(el);
    setNewWindow(win);

    setJss(
      create({
        ...jssPreset(),
        insertionPoint: win.document.head,
      })
    );
    setSheetsManager(new Map());

    win.document.body.appendChild(el);
    copyStyles(window.document, win.document);
    win.addEventListener('beforeunload', () => {
      onClose?.();
    });

    return () => {
      win.close();
    };
  }, []);

  console.debug('CONTAINER MOUNT', containerEl);

  if (newWindow == null || containerEl == null) {
    return null;
  }

  return (
    <NewWindowContext.Provider value={newWindow}>
      <StyleSheetManager target={newWindow.document.body}>
        <StylesProvider jss={jss} sheetsManager={sheetsManager}>
          <>{ReactDOM.createPortal(children, containerEl)}</>
        </StylesProvider>
      </StyleSheetManager>
    </NewWindowContext.Provider>
  );
};

export default NewWindow;
