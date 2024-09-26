// ==UserScript==
// @name         Warn on save on Bear blog
// @namespace    http://tampermonkey.net/
// @version      2024-09-26
// @description  try to take over the world!
// @author       You
// @match        https://bearblog.dev/damien/dashboard/posts/kQbXWjTbgQiTjgbpSbCp/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bearblog.dev
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  let isDirty = false;
  const textareas = Array.from(document.querySelectorAll('textarea'));

  textareas.forEach((t) => {
    t.addEventListener('change', () => {
      isDirty = true;
    });
  });

  window.onbeforeunload = function () {
    if (!isDirty) {
      return undefined;
    }

    return 'You have unsaved changes, are you sure?';
  };
  // Your code here...
})();
