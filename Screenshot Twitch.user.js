// ==UserScript==
// @author      @Eramdam
// @name        Screenshot Twitch
// @namespace screenshot.twitch
// @description Adds a screenshot button to Twitch's player
// @grant       none
// @match       *://*.twitch.tv/*
// @require https://unpkg.com/file-saver@2.0.2/dist/FileSaver.min.js
// @version     1.0
// @downloadURL https://github.com/eramdam/userscripts/raw/main/Screenshot Twitch.user.js
// @updateURL https://github.com/eramdam/userscripts/raw/main/Screenshot Twitch.user.js
// ==/UserScript==

const svgPhotoIcon = `<svg type="color-fill-current" width="20px" height="20px" version="1.1" viewBox="0 0 20 20" x="0px" y="0px" class="ScSvg-sc-1j5mt50-1 jLaQtw"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M10 5.892a4.108 4.108 0 100 8.216 4.108 4.108 0 000-8.216zm0 6.774a2.667 2.667 0 110-5.333 2.667 2.667 0 010 5.333z"></path><path d="M15.23 5.73a.96.96 0 11-1.92 0 .96.96 0 011.92 0z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M10 2c-2.173 0-2.445.01-3.299.048-.851.039-1.432.174-1.941.372a3.918 3.918 0 00-1.417.923c-.445.445-.719.89-.923 1.417-.198.509-.333 1.09-.372 1.941C2.01 7.555 2 7.827 2 10s.01 2.445.048 3.298c.039.852.174 1.433.372 1.942.205.526.478.972.923 1.417.445.445.89.718 1.417.923.509.198 1.09.333 1.942.372C7.555 17.99 7.827 18 10 18s2.445-.01 3.298-.048c.852-.039 1.434-.174 1.942-.372a3.918 3.918 0 001.417-.923 3.92 3.92 0 00.923-1.417c.198-.509.333-1.09.372-1.942.039-.853.048-1.125.048-3.298s-.01-2.445-.048-3.299c-.039-.851-.174-1.433-.372-1.941a3.918 3.918 0 00-.923-1.417 3.92 3.92 0 00-1.417-.923c-.51-.198-1.09-.333-1.942-.372C12.445 2.01 12.172 2 10 2zm0 1.441c2.136 0 2.389.009 3.232.047.78.036 1.204.166 1.486.275.373.146.64.319.92.599.28.28.453.546.598.92.11.282.24.705.275 1.485.039.844.047 1.097.047 3.233s-.008 2.389-.047 3.232c-.035.78-.165 1.204-.275 1.486-.145.373-.319.64-.598.92-.28.28-.547.454-.92.598-.282.11-.706.24-1.486.276-.843.038-1.096.046-3.232.046s-2.39-.008-3.233-.046c-.78-.036-1.203-.166-1.485-.276a2.481 2.481 0 01-.92-.598 2.474 2.474 0 01-.599-.92c-.11-.282-.24-.706-.275-1.486-.038-.843-.047-1.096-.047-3.232s.009-2.39.047-3.233c.036-.78.166-1.203.275-1.485.145-.374.319-.64.599-.92.28-.28.546-.454.92-.599.282-.11.705-.24 1.485-.275.844-.038 1.097-.047 3.233-.047z"></path></g></svg>`;

const log = (...args) => console.log('[SCREENSHOT-PLEX]', ...args);

async function takeScreenshot() {
  log('gonna create imageBitmap');
  const videoNode = document.querySelector('video');
  const c = document.createElement('canvas');
  c.width = videoNode.videoWidth;
  c.height = videoNode.videoHeight;

  const ctx = c.getContext('2d');
  log('Got video data', videoNode);
  const imageBitmap = await createImageBitmap(
    videoNode,
    0,
    0,
    videoNode.videoWidth,
    videoNode.videoHeight
  );
  ctx.drawImage(imageBitmap, 0, 0, videoNode.videoWidth, videoNode.videoHeight);

  log('Drawn video image data');

  c.toBlob((blob) => {
    log('Gonna donlowd');

    saveAs(blob, `screencapture-${document.title}-${Date.now()}.png`);
  });
}

(() => {
  const observer = new MutationObserver(() => {
    if (
      !document.querySelector('[class*="player-controls__right"]') ||
      document.querySelector('.screenshotButton')
    ) {
      return;
    }

    const parent = document.querySelector('[class*="player-controls__right"]');

    const buttonWrapper = document.createElement('div');
    buttonWrapper.className =
      'tw-inline-flex tw-relative tw-tooltip__container screenshotButton tw-button-icon tw-button-icon--overlay';
    const newButton = document.createElement('button');
    newButton.innerHTML = `<span class="tw-button-icon__icon">${svgPhotoIcon}</span>`;
    newButton.onclick = () => {
      takeScreenshot();
    };
    buttonWrapper.insertAdjacentElement('beforeend', newButton);
    buttonWrapper.insertAdjacentHTML(
      'beforeend',
      `<div class="tw-tooltip tw-tooltip--align-right tw-tooltip--up" data-a-target="tw-tooltip-label" role="tooltip">Screenshot</div>`
    );
    parent.insertAdjacentElement('afterbegin', buttonWrapper);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  document.body.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'F9') {
        event.preventDefault();
        event.stopPropagation();
        takeScreenshot();
      }
    },
    true
  );
})();
