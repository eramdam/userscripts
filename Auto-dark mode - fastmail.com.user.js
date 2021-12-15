// ==UserScript==
// @name        Auto-dark mode - fastmail.com
// @namespace   Violentmonkey Scripts
// @match       https://www.fastmail.com/*
// @grant       none
// @version     1.0
// @author      @Eramdam
// @description 6/15/2021, 9:47:45 PM
// ==/UserScript==

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

const onSystemDarkModeChange = (ev) => {
  const hasSystemDarkMode = ev.matches;

  FastMail.theme.set('theme', hasSystemDarkMode ? 'dark' : 'steel');
};

mediaQuery.addEventListener('change', onSystemDarkModeChange);

new MutationObserver((_mutation, observer) => {
  setTimeout(() => {
    if (document.querySelector('#mail.app')) {
      observer.disconnect();
      onSystemDarkModeChange({ matches: mediaQuery.matches });
    }
  }, 0);
}).observe(document.querySelector('body'), {
  attributeFilter: ['class'],
  attributes: true,
});
