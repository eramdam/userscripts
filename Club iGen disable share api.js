// ==UserScript==
// @author      @Eramdam
// @description Disables the Share API on clubigen.fr
// @match       *://clubigen.fr/*
// @name        Club iGen disable share api
// @namespace   eramdam
// @version     1.0
// ==/UserScript==

setTimeout(() => {
  navigator.share = undefined;
}, 1);
