// ==UserScript==
// @name        Mastodon auto night mode
// @description Switch between dark and light theme on Mastodon
// @match       *://octodon.social/*
// @inject-into auto
// ==/UserScript==

// These URLs are gonna break next time the instance gets deployed...
const whiteTheme =
  'https://octodon.social/packs/css/mastodon-light-32dee7b3.chunk.css';
const darkTheme = 'https://octodon.social/packs/css/default-7924916e.chunk.css';

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

const onSystemDarkModeChange = (ev) => {
  const hasSystemDarkMode = ev.matches;
  const themeStyleEl = (document.querySelectorAll('link[rel="stylesheet"]') ||
    [])[1];

  if (themeStyleEl) {
    themeStyleEl.setAttribute(
      'href',
      hasSystemDarkMode ? darkTheme : whiteTheme
    );
  }
};

mediaQuery.addEventListener('change', onSystemDarkModeChange);

onSystemDarkModeChange({ matches: mediaQuery.matches });
