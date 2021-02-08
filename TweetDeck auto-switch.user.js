// ==UserScript==
// @name        TweetDeck auto-switch
// @description Switches between dark and light theme on TweetDeck
// @match       https://tweetdeck.twitter.com/
// @inject-into auto
// @author      @Eramdam
// @namespace   eramdam
// ==/UserScript==

const onSystemDarkModeChange = (ev) => {
  const hasSystemDarkMode = ev.matches;
  const html = document.querySelector('html');

  if (!html) {
    return;
  }

  if (hasSystemDarkMode) {
    html.classList.add('dark');
  } else if (!hasSystemDarkMode) {
    html.classList.remove('dark');
  }
};

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

mediaQuery.addEventListener('change', onSystemDarkModeChange);
const appNode = document.querySelector('.application');
new MutationObserver((mutations, observer) => {
  if (document.querySelectorAll('.column').length) {
    observer.disconnect();
    onSystemDarkModeChange({ matches: mediaQuery.matches });
  }
}).observe(appNode, {
  childList: true,
});
