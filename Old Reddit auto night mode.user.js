// ==UserScript==
// @author      @Eramdam
// @description Switches night mode on/off in Reddit's old layout
// @match       *://www.reddit.com/*
// @name        Old Reddit auto night mode
// @version     1.0
// ==/UserScript==

// serene
const whiteTheme = [
  'https://b.thumbs.redditmedia.com/JZRzZnnOIpG9yzKHn__oFtpVnxWAW6jXBYQV6LbdbUM.css',
  '(prefers-color-scheme: light)',
];
// darkserene
const darkTheme = [
  'https://b.thumbs.redditmedia.com/7Mo6f2471PkG5Ip35ZWa4MzFRYjl2sI1RcHuDEkv7Zk.css',
  '(prefers-color-scheme: dark)',
];

[whiteTheme, darkTheme].forEach((theme) => {
  const styleEl = document.createElement('link');
  styleEl.setAttribute('ref', 'applied_subreddit_stylesheet');
  styleEl.setAttribute('rel', 'stylesheet');
  styleEl.setAttribute('type', 'text/css');
  styleEl.setAttribute('href', theme[0]);
  styleEl.setAttribute('media', theme[1]);
  document.head.appendChild(styleEl);
});
