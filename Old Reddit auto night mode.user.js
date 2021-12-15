// ==UserScript==
// @author      @Eramdam
// @description Switches night mode on/off in Reddit's old layout
// @match       *://www.reddit.com/*
// @name        Old Reddit auto night mode
// @version     1.0
// ==/UserScript==

// serene
const whiteTheme =
      'https://b.thumbs.redditmedia.com/JZRzZnnOIpG9yzKHn__oFtpVnxWAW6jXBYQV6LbdbUM.css';
// darkserene
const darkTheme =
      'https://b.thumbs.redditmedia.com/7Mo6f2471PkG5Ip35ZWa4MzFRYjl2sI1RcHuDEkv7Zk.css';

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

const onSystemDarkModeChange = (ev) => {
    const hasSystemDarkMode = ev.matches;
    const themeStyleEl = document.querySelector(
        'link[rel="applied_subreddit_stylesheet"]'
    );

    if (themeStyleEl) {
        themeStyleEl.setAttribute(
            'href',
            hasSystemDarkMode ? darkTheme : whiteTheme
        );
    } else {
        const styleEl = document.createElement('link');
        styleEl.setAttribute('ref', 'applied_subreddit_stylesheet');
        styleEl.setAttribute('rel', 'stylesheet');
        styleEl.setAttribute('type', 'text/css');
        styleEl.setAttribute('href', hasSystemDarkMode ? darkTheme : whiteTheme);
        document.head.appendChild(styleEl);
    }
};

mediaQuery.addEventListener('change', onSystemDarkModeChange);

onSystemDarkModeChange({ matches: mediaQuery.matches });
