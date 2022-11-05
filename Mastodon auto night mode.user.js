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
    'https://octodon.social/packs/css/core/common-50d0784d.chunk.css',
    'sha256-c4lMl/Kd1OgQQfEufaXmD+M2j07FJEKma1Mu6eFoP/g=',
  ],
  [
    'https://octodon.social/packs/css/skins/vanilla/mastodon-light/common-d3c87180.chunk.css',
    'sha256-+nJK4FuNpVwKYQkJKpEUWd7Db27alINWb9DoswX6qxs=',
  ],
];

const glitchLightThemeStyles = [
  [
    'https://octodon.social/packs/css/core/common-50d0784d.chunk.css',
    'sha256-c4lMl/Kd1OgQQfEufaXmD+M2j07FJEKma1Mu6eFoP/g=',
  ],
  [
    'https://octodon.social/packs/css/skins/glitch/mastodon-light/common-774b8e36.chunk.css',
    'sha256-FUaNcgbHDxthAiEw5Spcwwi04nhnOMmOIxxQWhqA7yM=',
  ],
];

const vanillaDarkThemeStyles = [
  [
    'https://octodon.social/packs/css/core/common-50d0784d.chunk.css',
    'sha256-c4lMl/Kd1OgQQfEufaXmD+M2j07FJEKma1Mu6eFoP/g=',
  ],
  [
    'https://octodon.social/packs/css/flavours/vanilla/common-ee9ef219.chunk.css',
    'sha256-HYSGgi4ge38qrjvY1WOscY3yyuuAGvZtQcxeE7QSbiI=',
  ],
];
const glitchDarkThemeStyles = [
  [
    'https://octodon.social/packs/css/core/common-50d0784d.chunk.css',
    'sha256-c4lMl/Kd1OgQQfEufaXmD+M2j07FJEKma1Mu6eFoP/g=',
  ],
  [
    'https://octodon.social/packs/css/flavours/glitch/common-97cc3205.chunk.css',
    'sha256-nabwQ9NgKl/NuzQyfeMuyhQVfIVv1eg0Hu8AkyZtMGs=',
  ],
];

new MutationObserver((_mut, observer) => {
  const originalStyles = document.querySelectorAll(
    `link[rel=stylesheet][integrity]:not([media*="prefers-"])`
  );

  if (originalStyles.length > 1) {
    originalStyles.forEach((e) => e.remove());
  }

  const isReady = document.querySelector('body.app-body,body.admin');

  if (!isReady) {
    return;
  }

  if (document.querySelector('body.flavour-vanilla')) {
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
  } else {
    glitchDarkThemeStyles.forEach((newStyle) => {
      const newStyleLink = document.createElement('link');
      newStyleLink.rel = 'stylesheet';
      newStyleLink.href = newStyle[0];
      newStyleLink.integrity = newStyle[1];
      newStyleLink.media = '(prefers-color-scheme: dark)';
      document.documentElement.appendChild(newStyleLink);
    });
    glitchLightThemeStyles.forEach((newStyle) => {
      const newStyleLink = document.createElement('link');
      newStyleLink.rel = 'stylesheet';
      newStyleLink.href = newStyle[0];
      newStyleLink.integrity = newStyle[1];
      newStyleLink.media = '(prefers-color-scheme: light)';
      document.documentElement.appendChild(newStyleLink);
    });
  }

  observer.disconnect();
}).observe(document.documentElement, {
  subtree: true,
  childList: true,
});
