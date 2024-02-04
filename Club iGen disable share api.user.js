// ==UserScript==
// @author      @Eramdam
// @description Disables the Share API on clubigen.fr
// @match       *://clubigen.fr/*
// @name        Club iGen disable share api
// @namespace   eramdam
// @version     1.0
// @downloadURL https://github.com/eramdam/userscripts/raw/main/Club iGen disable share api.user.js
// @updateURL https://github.com/eramdam/userscripts/raw/main/Club iGen disable share api.user.js
// ==/UserScript==

setTimeout(() => {
  navigator.share = undefined;
}, 1);
