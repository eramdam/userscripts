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

  if (hasSystemDarkMode && !html.classList.contains('dark')) {
    html.classList.add('dark');
  } else if (!hasSystemDarkMode && html.classList.contains('dark')) {
    html.classList.remove('dark');
  }
};

mediaQuery.addEventListener('change', onSystemDarkModeChange);

onSystemDarkModeChange({ matches: mediaQuery.matches });
