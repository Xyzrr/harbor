import React from 'react';
import ReactDOM from 'react-dom';
import { StyleSheetManager } from 'styled-components';
import { jssPreset, StylesProvider } from '@material-ui/styles';
import { create, Jss } from 'jss';

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
  onClose?(): void;
}

const NewWindow: React.FC<NewWindowProps> = ({
  name,
  features,
  children,
  onClose,
}) => {
  React.useEffect(() => {
    console.log('MOUNTED NEWWIN');
    return () => {
      console.log('UNMOUNTED NEWWIN');
    };
  }, []);
  const [containerEl, setContainerEl] = React.useState<Element>();
  const [newWindow, setNewWindow] = React.useState<Window | null>();

  const [jss, setJss] = React.useState<Jss>();
  const [sheetsManager, setSheetsManager] = React.useState<any>();

  React.useEffect(() => {
    const el = document.createElement('div');
    const win = window.open('', name, features);

    if (win == null) {
      throw new Error('Could not open new window.');
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

  console.log('CONTAINER MOUNT', containerEl);

  if (newWindow == null || containerEl == null) {
    return null;
  }

  return (
    <StyleSheetManager target={newWindow.document.body}>
      <StylesProvider jss={jss} sheetsManager={sheetsManager} injectFirst>
        {ReactDOM.createPortal(children, containerEl)}
      </StylesProvider>
    </StyleSheetManager>
  );
};

export default NewWindow;
