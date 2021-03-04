// ==UserScript==
// @name        Mastodon auto night mode
// @description Switch between dark and light theme on Mastodon
// @match       *://octodon.social/*
// @inject-into auto
// @author      @Eramdam
// @namespace   eramdam
// ==/UserScript==

// These URLs are gonna break next time the instance gets deployed...
const whiteTheme = 'https://octodon.social/packs/css/mastodon-light-531dc14a.chunk.css',;
const darkTheme = 'https://octodon.social/packs/css/default-08e1136f.chunk.css',;

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

const onSystemDarkModeChange = (ev) => {
  const hasSystemDarkMode = ev.matches;
  const themeStyleEl = (document.querySelectorAll('link[rel="stylesheet"]') ||
    [])[1];
  const theme = hasSystemDarkMode ? darkTheme : whiteTheme;
  const newThemeLink = document.createElement('link');
  newThemeLink.rel = 'stylesheet';
  newThemeLink.href = theme;

  if (themeStyleEl) {
    themeStyleEl.remove();
    document.head.appendChild(newThemeLink);
  }
};

mediaQuery.addEventListener('change', onSystemDarkModeChange);

onSystemDarkModeChange({ matches: mediaQuery.matches });
