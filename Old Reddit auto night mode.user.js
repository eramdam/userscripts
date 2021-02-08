// ==UserScript==
// @author      @Eramdam
// @description Switches night mode on/off in Reddit's old layout
// @match       *://www.reddit.com/*
// @name        Old Reddit auto night mode
// @namespace   eramdam
// @version     1.0
// ==/UserScript==

// serene
const whiteTheme =
  'https://b.thumbs.redditmedia.com/JZRzZnnOIpG9yzKHn__oFtpVnxWAW6jXBYQV6LbdbUM.css';
// darkserene
const darkTheme =
  'https://b.thumbs.redditmedia.com/-_DwfElLeh_YO8aowR3HbdKRJQnwtOthqRnV2OMzt4Y.css';

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

const onSystemDarkModeChange = (ev) => {
  const hasSystemDarkMode = ev.matches;
  const themeStyleEl = document.querySelector(
    'link[ref="applied_subreddit_stylesheet"]'
  );

  if (themeStyleEl) {
    themeStyleEl.setAttribute(
      'href',
      hasSystemDarkMode ? darkTheme : whiteTheme
    );
  }
};

mediaQuery.addEventListener('change', onSystemDarkModeChange);

onSystemDarkModeChange({ matches: mediaQuery.matches });
