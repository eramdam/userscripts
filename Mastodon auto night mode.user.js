// ==UserScript==
// @name        Mastodon auto night mode
// @description Switch between dark and light theme on Mastodon
// @match       *://octodon.social/*
// @version     1.0.0
// @author      @Eramdam
// @namespace   eramdam
// @run-at      document-start
// ==/UserScript==

// `copy([document.querySelector('link[rel=stylesheet][href*="chunk."]')?.href, document.querySelector('link[rel=stylesheet][href*="chunk."]')?.integrity)
// These URLs are gonna break next time the instance gets deployed...
const whiteTheme = [
  'https://octodon.social/packs/css/mastodon-light-e831b6ee.chunk.css',
  'sha256-KcsfarZX47nuIGhRW29a6D4sXiYIJtezpTyJGHgSqM8=',
];

const darkTheme = [
  'https://octodon.social/packs/css/default-4fb6b0ab.chunk.css',
  'sha256-d0k6MMFKhwfoTs1uMLgY1D5uS9KuxxUtLdthw7FScgo=',
];

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

const onSystemDarkModeChange = (ev) => {
  const hasSystemDarkMode = ev.matches;
  const [theme, integrity] = hasSystemDarkMode ? darkTheme : whiteTheme;
  const styleToChange = document.querySelector(
    'link[rel=stylesheet][href*="chunk."]'
  );

  if (styleToChange) {
    const newThemeLink = document.createElement('link');
    newThemeLink.rel = 'stylesheet';
    newThemeLink.href = theme;
    newThemeLink.integrity = integrity;
    document.head.appendChild(newThemeLink);
    styleToChange.remove();
  }
};

mediaQuery.addEventListener('change', onSystemDarkModeChange);
onSystemDarkModeChange({ matches: mediaQuery.matches });
