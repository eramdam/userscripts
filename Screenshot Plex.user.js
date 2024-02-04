// ==UserScript==
// @author      @Eramdam
// @description Add a screenshot button to Plex's player
// @grant       none
// @match       *://app.plex.tv/*
// @match       *://magneton.local:32400/*
// @name        Screenshot Plex
// @namespace   eramdam
// @require https://html2canvas.hertzen.com/dist/html2canvas.min.js
// @require https://unpkg.com/file-saver@2.0.2/dist/FileSaver.min.js
// @version     1.0
// @downloadURL https://github.com/eramdam/userscripts/raw/main/Screenshot Plex.user.js
// @updateURL https://github.com/eramdam/userscripts/raw/main/Screenshot Plex.user.js
// ==/UserScript==

// Taken from https://github.com/mgcrea/js-canvas-object-fit/
const EXIF_ORIENTATIONS = [
  { op: 'none', radians: 0 },
  { op: 'none', radians: 0 },
  { op: 'flip-x', radians: 0 },
  { op: 'none', radians: Math.PI },
  { op: 'flip-y', radians: 0 },
  { op: 'flip-x', radians: Math.PI / 2 },
  { op: 'none', radians: Math.PI / 2 },
  { op: 'flip-x', radians: -Math.PI / 2 },
  { op: 'none', radians: -Math.PI / 2 },
];
const drawImage = (
  ctx,
  image,
  x,
  y,
  width,
  height,
  {
    objectFit = 'cover',
    orientation = 0,
    offsetX = 1 / 2,
    offsetY = 1 / 2,
  } = {}
) => {
  // Orientation value
  const rotation = EXIF_ORIENTATIONS[orientation].radians;
  const isHalfRotated = rotation !== 0 && rotation % Math.PI === 0;
  const isQuarterRotated =
    rotation !== 0 && !isHalfRotated && rotation % (Math.PI / 2) === 0;
  const isRotatedClockwise = rotation / (Math.PI / 2) < 0; // @NOTE handle 2*PI rotation?
  // Size values
  const imageWidth = !isQuarterRotated ? image.width : image.height;
  const imageHeight = !isQuarterRotated ? image.height : image.width;
  // Resize values
  const resizeRatio = Math[objectFit === 'cover' ? 'max' : 'min'](
    width / imageWidth,
    height / imageHeight
  );
  const resizeWidth = !isQuarterRotated
    ? imageWidth * resizeRatio
    : imageHeight * resizeRatio;
  const resizeHeight = !isQuarterRotated
    ? imageHeight * resizeRatio
    : imageWidth * resizeRatio;
  // Cropping values
  const sWidth = !isQuarterRotated
    ? imageWidth / (resizeWidth / width)
    : imageHeight / (resizeWidth / height);
  const sHeight = !isQuarterRotated
    ? imageHeight / (resizeHeight / height)
    : imageWidth / (resizeHeight / width);
  const sX = (image.width - sWidth) * offsetX;
  const sY = (image.height - sHeight) * offsetY;
  // Positionning values
  let tX = 0;
  let tY = 0;
  if (isHalfRotated) {
    tX = -width - x;
    tY = -height - y;
  } else if (isQuarterRotated) {
    tX = !isRotatedClockwise ? x : -height - x;
    tY = isRotatedClockwise ? y : -width - y;
  }
  const tWidth = !isQuarterRotated ? width : height;
  const tHeight = !isQuarterRotated ? height : width;
  // Draw image
  if (rotation) {
    ctx.rotate(rotation);
  }
  if (objectFit !== 'none') {
    ctx.drawImage(image, sX, sY, sWidth, sHeight, tX, tY, tWidth, tHeight);
  } else {
    ctx.drawImage(image, tX, tY, tWidth, tHeight);
  }
  if (rotation) {
    ctx.rotate(-rotation);
  }
};

const svgPhotoIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 560" id="plex-icon-sidebar-photos-560" aria-hidden="true" class="PlexIcon-plexIcon-1hNiE2"><path d="M440 120h100c11.038 0 20 8.962 20 20v360c0 11.038-8.962 20-20 20H20c-11.038 0-20-8.962-20-20V140c0-11.038 8.962-20 20-20h100V60c0-11.038 8.962-20 20-20h280c11.038 0 20 8.962 20 20v60zm-160 40c-88.306 0-160 71.694-160 160s71.694 160 160 160 160-71.694 160-160-71.694-160-160-160zm0 80c44.153 0 80 35.847 80 80s-35.847 80-80 80-80-35.847-80-80 35.847-80 80-80z"></path></svg>`;

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
  const hasSubs = document.querySelectorAll('.libjass-subs').length > 0;

  if (html2canvas && hasSubs) {
    try {
      log('grabbing subs');
      const subNode = document.querySelector('.libjass-subs');
      const subCanvas = await html2canvas(subNode, {
        backgroundColor: null,
        foreignObjectRendering: true,
        ignoreElements: (element) => {
          const shouldIgnore =
            !element.closest('.libjass-wrapper') && !element.contains(subNode);
          log('maybe ignore?', {
            element,
            shouldIgnore,
          });

          return shouldIgnore;
        },
      });
      log('Got sub data', subCanvas);
      drawImage(ctx, subCanvas, 0, 0, c.width, c.height, {
        objectFit: 'contain',
      });
    } catch (e) {
      console.error(e);
    }
  }

  log('Drawn video image data');

  c.toBlob((blob) => {
    log('Gonna donlowd');

    saveAs(blob, `screencapture-${document.title}-${Date.now()}.png`);
    window.stop();
  });
}

(() => {
  const observer = new MutationObserver(() => {
    const playerUIRoot = document.querySelector(
      '[class^="PlayerContainer-container"]'
    );

    if (!playerUIRoot) {
      return;
    }

    if (
      !playerUIRoot.querySelector(
        '[class^="PlayerControls-buttonGroupCenter-"]'
      ) ||
      playerUIRoot.querySelector('.screenshotButton')
    ) {
      return;
    }

    const parent = playerUIRoot.querySelector(
      '[class^="PlayerControls-buttonGroupCenter-"]'
    );

    const newButton = document.createElement('button');
    newButton.className =
      'PlayerIconButton-playerButton-aW9TNw IconButton-button-2smHOM Link-link-3v-v0b Link-default-1dmcVx';
    newButton.classList.add('screenshotButton');
    newButton.setAttribute('aria-label', 'Take a screenshot');
    newButton.setAttribute('title', 'Take a screenshot');
    newButton.setAttribute('role', 'button');
    newButton.setAttribute('type', 'button');
    newButton.innerHTML = svgPhotoIcon;
    newButton.onclick = () => {
      log('Gonna take screenshot');
      takeScreenshot();
    };
    parent.insertAdjacentElement('beforeend', newButton);
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
