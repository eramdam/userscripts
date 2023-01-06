// ==UserScript==
// @name         Cohost click header scroll
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allows you to scroll to the top of the page by clicking on the header of the page. (Cohost)
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
