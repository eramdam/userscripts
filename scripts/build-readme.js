const glob = require('glob');
const fs = require('fs');
const path = require('path');
const userScriptParser = require('userscript-parser');
const userCss = require('usercss-meta');
const prettier = require('prettier');

let markdown = fs.readFileSync('./README.md').toString();
const TABLE_TARGET = '<!-- Insert files table -->';

(async () => {
  const files = glob.sync('./*.{js,css}');
  const filesData = Array.from(files)
    .map((f) => path.basename(f))
    .map((f) => {
      const fileText = fs.readFileSync(f).toString();
      if (String(f).endsWith('.css')) {
        const data = userCss.parse(fileText, {
          allowErrors: true,
        });
        return {
          filename: f,
          ...data.metadata,
        };
      }
      const data = userScriptParser(fileText);
      return {
        filename: f,
        ...data.meta,
      };
    });

  const re = new RegExp(`${TABLE_TARGET}[\\w\\W]+`);
  markdown = markdown.replace(re, `${TABLE_TARGET}\n\n`);

  markdown += `
|${['Name', 'Author', 'Description'].join('|')}|
|---|---|
`;

  filesData.forEach((file) => {
    const filenameURL = `https://github.com/eramdam/userscripts/blob/main/${file.filename}`;
    markdown += `|${[
      `[${file.name}](${encodeURI(filenameURL)})`,
      file.author,
      file.description,
    ].join('|')}|\n`;
  });

  const formatted = prettier.format(markdown, {
    parser: 'markdown',
  });

  fs.writeFileSync('./README.md', formatted);
  Array.from(files)
    .map((f) => path.basename(f))
    .filter((f) => f.endsWith('.js'))
    .forEach((f) => {
      maybeAddURLsToScripts(f);
    });
  Array.from(files)
    .map((f) => path.basename(f))
    .filter((f) => f.endsWith('.css'))
    .forEach((f) => {
      maybeAddURLsToStyles(f);
    });
})();

/**
 * @param {string} filename
 */
async function maybeAddURLsToStyles(filename) {
  const fileText = fs.readFileSync(filename).toString();
  const { metadata } = userCss.parse(fileText, { allowErrors: true });

  if (filename.endsWith('.js')) {
    return;
  }

  if (metadata.homepageURL && metadata.supportURL && metadata.updateURL) {
    return;
  }

  const oldData = userCss.stringify(metadata);
  const newData = userCss.stringify({
    ...metadata,
    homepageURL: `https://github.com/eramdam/userscripts/raw/main/${filename}`,
    supportURL: `https://github.com/eramdam/userscripts/raw/main/${filename}`,
    updateURL: `https://github.com/eramdam/userscripts/raw/main/${filename}`,
  });
  const newText = fileText.replace(
    /\/\* ==UserStyle==[\w\W]+==\/UserStyle== \*\//gi,
    newData
  );

  fs.writeFileSync(filename, newText, 'utf-8');
}

/**
 * @param {string} filename
 */
async function maybeAddURLsToScripts(filename) {
  const fileText = fs.readFileSync(filename).toString();
  const data = userScriptParser(fileText);
  if (
    (data.meta.downloadURL && data.meta.updateURL) ||
    filename.endsWith('.css')
  ) {
    return;
  }

  const url = `https://github.com/eramdam/userscripts/raw/main/${filename}`;
  const newText = fileText.replace(
    `// ==/UserScript==`,
    `// @downloadURL ${url}\n// @updateURL ${url}\n// ==/UserScript==`
  );
  fs.writeFileSync(filename, newText, 'utf-8');
}
