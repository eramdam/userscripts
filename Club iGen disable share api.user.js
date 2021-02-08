// ==UserScript==
// @name        Club iGen disable share api
// @match       *://clubigen.fr/*
// @namespace   eramdam
// @version     1.0
// @author      @Eramdam
// @description Disables the Share API on clubigen.fr
// ==/UserScript==

setTimeout(() => {
  navigator.share = undefined;
}, 1);
