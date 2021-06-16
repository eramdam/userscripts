// ==UserScript==
// @name        Mastodon auto night mode
// @description Switch between dark and light theme on Mastodon
// @match       *://octodon.social/*
// @inject-into auto
// @author      @Eramdam
// @namespace   eramdam
// ==/UserScript==

// These URLs are gonna break next time the instance gets deployed...
const whiteTheme = [
  "https://octodon.social/packs/css/common-6632dedd.css",
  "https://octodon.social/packs/css/mastodon-light-998eb457.chunk.css",
  "https://octodon.social/inert.css"
];
const darkTheme = [
  "https://octodon.social/packs/css/common-6632dedd.css",
  "https://octodon.social/packs/css/default-751f3f06.chunk.css",
  "https://octodon.social/inert.css"
];



const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

const onSystemDarkModeChange = (ev) => {
  const hasSystemDarkMode = ev.matches;
  const themeLinks = hasSystemDarkMode ? darkTheme : whiteTheme;
  const themeElements = [...document.querySelectorAll('link[rel=stylesheet]')];
  
  
  themeLinks.forEach(theme => {
    
    const newThemeLink = document.createElement('link');
  newThemeLink.rel = 'stylesheet';
  newThemeLink.href = theme;
  
  document.head.appendChild(newThemeLink);
  })
  
  themeElements.map(s => s.remove())

};

mediaQuery.addEventListener('change', onSystemDarkModeChange);

onSystemDarkModeChange({ matches: mediaQuery.matches });
