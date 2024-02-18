// ==UserScript==
// @name         Cohost click header scroll
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allows you to scroll to the top of the page by clicking on the header of the page. (Cohost)
// @author       @Eramdam
// @match        https://cohost.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cohost.org
// @grant        none
// @downloadURL https://github.com/eramdam/userscripts/raw/main/cohost click header to scroll.user.js
// @updateURL https://github.com/eramdam/userscripts/raw/main/cohost click header to scroll.user.js
// ==/UserScript==

(function () {
  'use strict';

  const header = document.querySelector('#app > div > header');

  if (header) {
    header.addEventListener('click', (e) => {
      if (
        e.target instanceof HTMLElement &&
        (e.target.closest('button') || e.target.closest('a'))
      ) {
        return;
      }
      if (document.documentElement.scrollTop > 10) {
        document.documentElement.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    });
  }
})();
