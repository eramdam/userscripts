// @ts-check
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
const vanillaLightThemeStyles = [
  [
    'https://octodon.social/packs/css/core/common-a844dc34.chunk.css',
    'sha256-TqG4aY9sRserz6ezqW5i6LhnoG/zZTkQ9DdiaCAc13o=',
  ],
  [
    'https://octodon.social/packs/css/skins/vanilla/mastodon-light/common-34bcf7b4.chunk.css',
    'sha256-1+qK9rpxf4CSE0zvqtL9UhvZzRMHkqHlU7sbw0sumwo=',
  ],
];

const glitchLightThemeStyles = [
  [
    'https://octodon.social/packs/css/core/common-fccd12a2.chunk.css',
    'sha256-QXkqWo4J20SxB8f1zQm39dnjZ4bRvrDmOHL6VMSgrOQ=',
  ],
  [
    'https://octodon.social/packs/css/skins/glitch/mastodon-light/common-e57f4dec.chunk.css',
    'sha256-5/eZZaLBtX3L/vAliFDJcbwA8BWz5PS4BTtdOBKQuZc=',
  ],
];

const glitchDarkThemeStyles = [
  [
    'https://octodon.social/packs/css/core/common-fccd12a2.chunk.css',
    'sha256-QXkqWo4J20SxB8f1zQm39dnjZ4bRvrDmOHL6VMSgrOQ=',
  ],
  [
    'https://octodon.social/packs/css/flavours/glitch/common-1c295280.chunk.css',
    'sha256-yPa7+jD8s8XCYP2MT06UaGLR8/o5qdCkf1lxwzUNb+I=',
  ],
];

const vanillaDarkThemeStyles = [
  [
    'https://octodon.social/packs/css/core/common-a844dc34.chunk.css',
    'sha256-TqG4aY9sRserz6ezqW5i6LhnoG/zZTkQ9DdiaCAc13o=',
  ],
  [
    'https://octodon.social/packs/css/flavours/vanilla/common-20dcab1a.chunk.css',
    'sha256-I3Fzks5AWaz4NKRSotULDINUCtrqnG0CKiynlH1aC/c=',
  ],
];

vanillaDarkThemeStyles.forEach((newStyle) => {
  const newStyleLink = document.createElement('link');
  newStyleLink.rel = 'stylesheet';
  newStyleLink.href = newStyle[0];
  newStyleLink.integrity = newStyle[1];
  newStyleLink.media = '(prefers-color-scheme: dark)';
  document.documentElement.appendChild(newStyleLink);
});
vanillaLightThemeStyles.forEach((newStyle) => {
  const newStyleLink = document.createElement('link');
  newStyleLink.rel = 'stylesheet';
  newStyleLink.href = newStyle[0];
  newStyleLink.integrity = newStyle[1];
  newStyleLink.media = '(prefers-color-scheme: light)';
  document.documentElement.appendChild(newStyleLink);
});

new MutationObserver((_mut, observer) => {
  const originalStyles = document.querySelectorAll(
    `link[rel=stylesheet][integrity]:not([media*="prefers-"])`
  );

  if (originalStyles.length > 1) {
    observer.disconnect();
    originalStyles.forEach((e) => e.remove());

    setTimeout(() => {
      if (navigator.platform.includes('Mac')) {
        [...document.styleSheets].forEach((sheet) => {
          Object.entries(sheet.cssRules).forEach(([index, rule]) => {
            if (rule instanceof CSSStyleRule) {
              if (rule.selectorText.includes('::-webkit-scrollbar')) {
                sheet.deleteRule(Number(index));
              }
            }
          });
        });
      }
    }, 1);
  }
}).observe(document.documentElement, {
  subtree: true,
  childList: true,
});
