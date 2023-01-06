// ==UserScript==
// @name         Click header to scroll to the top
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       @Eramdam
// @match        https://cohost.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cohost.org
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const header = document.querySelector('#root > #app > div > header');

  if (header) {
    header.addEventListener('click', () => {
      if (document.documentElement.scrollTop > 10) {
        document.documentElement.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    });
  }
})();
