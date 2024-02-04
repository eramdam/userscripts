// ==UserScript==
// @name         Force Bsky.app to desktop mode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Force Bsky.app to desktop mode
// @author       Eramdam
// @match        https://bsky.app/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bsky.app
// @grant        none
// @downloadURL https://github.com/eramdam/userscripts/raw/main/bluesky force desktop.user.js
// @updateURL https://github.com/eramdam/userscripts/raw/main/bluesky force desktop.user.js
// ==/UserScript==

(function () {
  'use strict';

  const baseMatchMedia = window.matchMedia;
  // Monkey patch matchMedia to make the React code think we're always in desktop mode
  window.matchMedia = (query) => {
    if (query === 'only screen and (max-width: 1230px)') {
      return {
        matches: false,
        addListener: () => {},
        removeListener: () => {},
      };
    }

    if (query === '(min-width: 1230px)') {
      return {
        matches: true,
        addListener: () => {},
        removeListener: () => {},
      };
    }

    return baseMatchMedia(query);
  };

  // Hide the right sidebar
  const style = document.createElement('style');
  style.innerText =
    'html body div#root div.css-175oi2r.r-13awgt0 div.css-175oi2r.r-1pi2tsx.r-kemksi div.css-175oi2r.r-1u20jyi.r-u8s1d.r-1ej1qmr.r-ryqm5k {display: none;}';
  document.body.appendChild(style);
})();
