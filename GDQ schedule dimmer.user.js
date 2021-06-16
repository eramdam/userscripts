// ==UserScript==
// @author      @eevee
// @description https://twitter.com/eevee/status/950119009638232064
// @grant       none
// @include     https://gamesdonequick.com/schedule
// @name        GDQ schedule dimmer
// @run-at      document-end
// @version     2
// ==/UserScript==

(function () {
  const PROGRESS_COLOR = '#9f8';
  const UPDATE_INTERVAL = 10 * 1000; // every 10s keeps it relatively smooth

  function style_run(now, run) {
    if (now > run.end) {
      // This run is over
      for (let row of [run.row1, run.row2]) {
        row.style.backgroundColor = '#eee';
        row.style.color = '#666';
        // Clear out any CSS left over from the branch below
        for (let prop of [
          'backgroundImage',
          'backgroundAttachment',
          'boxShadow',
        ]) {
          row.style[prop] = '';
        }
      }
    } else if (now > run.start) {
      // This is the current run
      // Draw a progress bar using a gradient background
      let pct =
        String(Math.round(((now - run.start) / run.duration) * 1000) / 10) +
        '%';
      let gradient = `linear-gradient(to right, ${PROGRESS_COLOR} 0%, ${PROGRESS_COLOR} ${pct}, transparent ${pct}, transparent 100%)`;
      for (let row of [run.row1, run.row2]) {
        row.style.backgroundColor = '#efd';
        row.style.backgroundImage = gradient;
        // Tricky CSS problem: the gradient image (or maybe this is background
        // images in general?) adamantly refuses to extend down below the
        // bounds of the row itself, so nothing ever appears in the rowspanned
        // cell at the end.  To fix this, we use background-attachment: fixed;,
        // which makes the background image draw relative to the entire
        // viewport.  We don't care about height because it's a horizontal
        // gradient, and the table is the full width of the viewport anyway so
        // that works out too.
        row.style.backgroundAttachment = 'fixed';
        row.style.color = '#260';
      }
      // Outlining a block of two rows is tricky, so fake it with box shadow
      run.row1.style.boxShadow = 'inset 0 9px 3px -8px #694';
      run.row2.style.boxShadow = 'inset 0 -10px 3px -8px #694';
    } else {
      // This has yet to start
    }
  }

  let runs = [];

  // Each row in the table contains a cell like this:
  // <td class="start-time text-right">2018-01-07T17:02:00Z</td>
  let table = document.getElementById('runTable');
  let cells = table.querySelectorAll('td.start-time');
  for (let cell of cells) {
    let match = cell.textContent.match(
      /^\s*(\d+)-(\d+)-(\d+)T(\d+):(\d+):(\d+)Z\s*$/
    );
    if (!match) {
      continue;
    }
    let args = match.slice(1).map((n) => parseInt(n, 10));
    // Date's month is 0-based!
    args[1]--;
    let start = Date.UTC(...args);

    // Grab the second row, containing the estimated time, e.g.:
    // <td class="text-right "> <i class="fa fa-clock-o" aria-hidden="true"></i> 0:32:00 </td>
    let row1 = cell.parentNode;
    let row2 = row1.nextElementSibling;
    if (!row2) {
      // No ETA means this is probably the finale
      continue;
    }
    let duration_cell = row2.firstElementChild;
    match = duration_cell.textContent.match(/^\s*(\d+):(\d+):(\d+)\s*$/);
    let duration =
      parseInt(match[1], 10) * 3600 +
      parseInt(match[2], 10) * 60 +
      parseInt(match[3], 10);
    duration *= 1000;

    // Remember each run now and let the live updater code apply styling
    runs.push({
      row1: row1,
      row2: row2,
      start: start,
      duration: duration,
      end: start + duration,
    });
  }

  let current_run = 0;
  // Update runs until we find one that hasn't started
  function update_runs() {
    let now = Date.now();
    while (true) {
      let run = runs[current_run];
      style_run(now, run);
      if (now <= run.end) {
        // This run either hasn't started or is still going;
        // stop here and check again later
        break;
      }

      current_run++;
      if (current_run >= runs.length) {
        // GDQ's over!
        return;
      }
    }
    window.setTimeout(update_runs, UPDATE_INTERVAL);
  }
  update_runs();
})();
