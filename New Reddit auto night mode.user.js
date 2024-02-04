// ==UserScript==
// @author      @Eramdam
// @description Switches night mode on/off in Reddit's new layout
// @match       *://www.reddit.com/*
// @name        New Reddit auto night mode
// @namespace   eramdam
// @version     1.0
// @downloadURL https://github.com/eramdam/userscripts/raw/main/New Reddit auto night mode.user.js
// @updateURL https://github.com/eramdam/userscripts/raw/main/New Reddit auto night mode.user.js
// ==/UserScript==

let gotStore = false;

function onStoreGet(store) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const onSystemDarkModeChange = (ev) => {
    const hasSystemDarkMode = ev.matches;
    const isNightModeEnabled = store.getState().user.prefs.nightmode;
    if (isNightModeEnabled !== hasSystemDarkMode) {
      store.dispatch({
        type: 'PREFERENCES__NIGHTMODE_TOGGLED',
        payload: {
          nightmode: hasSystemDarkMode,
        },
      });
    }
  };

  mediaQuery.addEventListener('change', onSystemDarkModeChange);

  setTimeout(() => {
    onSystemDarkModeChange({ matches: mediaQuery.matches });
  }, 0);
}

const noop = () => {};

const rendererInterfaces = new Map();
const hook = {
  rendererInterfaces,
  listeners: noop,
  renderers: noop,
  emit: noop,
  getFiberRoots: noop,
  inject: noop,
  on: noop,
  off: noop,
  sub: noop,
  supportsFiber: true,
  checkDCE: noop,
  onCommitFiberUnmount: noop,

  onCommitFiberRoot(_rendererID, root) {
    if (
      !root.current.memoizedState.element.props.children.props.store.dispatch ||
      gotStore
    ) {
      return;
    }

    gotStore = true;
    onStoreGet(root.current.memoizedState.element.props.children.props.store);
  },
};

if (!window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
  Object.defineProperty(window, '__REACT_DEVTOOLS_GLOBAL_HOOK__', {
    configurable: false,
    enumerable: false,
    get() {
      return hook;
    },
  });
} else {
  const fiberNode = Array.from(
    __REACT_DEVTOOLS_GLOBAL_HOOK__.getFiberRoots(1)
  )[0];
  const store =
    fiberNode.current.memoizedState.element.props.children.props.store;
  onStoreGet(store);
}
