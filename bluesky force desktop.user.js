// ==UserScript==
// @name         Force Bsky.app to desktop mode
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Force Bsky.app to desktop mode (left sidebar with item names) and hides the right sidebar
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
    console.log({ query });
    if (query === 'only screen and (max-width: 1300px)') {
      return {
        matches: false,
        addListener: () => {},
        removeListener: () => {},
      };
    }

    if (query === '(min-width: 1300px)') {
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
  style.innerText = `
      html
      body
      div#root
      div.css-175oi2r.r-13awgt0
      div.css-175oi2r.r-1pi2tsx.r-kemksi
      div.css-175oi2r.r-1u20jyi.r-u8s1d.r-1ej1qmr.r-ryqm5k {
      display: none;
    }

    @media only screen and (max-width: 1300px) {
      .css-175oi2r.r-pgf20v.r-1rnoaur.r-1xcajam.r-1awozwy.r-13l2t4g.r-1pi2tsx.r-1d2f490.r-12ijkx4.r-ipm5af.r-z2g584 {
        width: 220px !important;
        left: calc(-540px + 50vw) !important;
        align-items: stretch !important;
        border: none !important;
      }
    }

  `;
  document.body.appendChild(style);
})();
