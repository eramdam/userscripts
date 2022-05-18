// ==UserScript==
// @name        Mastodon auto night mode
// @description Switch between dark and light theme on Mastodon
// @match       *://octodon.social/*
// @version     1.0.0
// @author      @Eramdam
// @namespace   eramdam
// @run-at      document-start
// ==/UserScript==

// `copy([...document.querySelectorAll('link[rel=stylesheet][integrity]')].map(i => [i.href, i.integrity]))`
// These URLs are gonna break next time the instance gets deployed...
const lightThemeStyles = [
  [
    'https://octodon.social/packs/css/core/common-fccd12a2.chunk.css',
    'sha256-QXkqWo4J20SxB8f1zQm39dnjZ4bRvrDmOHL6VMSgrOQ=',
  ],
  [
    'https://octodon.social/packs/css/skins/vanilla/mastodon-light/common-28cc4baa.chunk.css',
    'sha256-KNB+Ku8heYoFfaz7Ne+YP0N3ZQqz1XRvy5u8o7ADgaQ=',
  ],
];

const darkThemeStyles = [
  [
    'https://octodon.social/packs/css/core/common-fccd12a2.chunk.css',
    'sha256-QXkqWo4J20SxB8f1zQm39dnjZ4bRvrDmOHL6VMSgrOQ=',
  ],
  [
    'https://octodon.social/packs/css/flavours/vanilla/common-5335f48a.chunk.css',
    'sha256-aR8EDVVQ6oOVZfqWFu0LoCjUakWvCXuQRF9RlqR33T0=',
  ],
];

darkThemeStyles.forEach((newStyle) => {
  const newStyleLink = document.createElement('link');
  newStyleLink.rel = 'stylesheet';
  newStyleLink.href = newStyle[0];
  newStyleLink.integrity = newStyle[1];
  newStyleLink.media = '(prefers-color-scheme: dark)';
  document.head.appendChild(newStyleLink);
});
lightThemeStyles.forEach((newStyle) => {
  const newStyleLink = document.createElement('link');
  newStyleLink.rel = 'stylesheet';
  newStyleLink.href = newStyle[0];
  newStyleLink.integrity = newStyle[1];
  newStyleLink.media = '(prefers-color-scheme: light)';
  document.head.appendChild(newStyleLink);
});

new MutationObserver((_mut, observer) => {
  const originalStyles = document.querySelectorAll(
    `link[rel=stylesheet][integrity]:not([media*="prefers-"])`
  );

  if (originalStyles.length > 1) {
    observer.disconnect();
    originalStyles.forEach((e) => e.remove());
  }
}).observe(document.documentElement, {
  subtree: true,
  childList: true,
});
