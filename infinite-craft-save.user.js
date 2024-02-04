// ==UserScript==
// @author      @Eramdam
// @name        Export/Import infinite craft data
// @grant       none
// @match       https://neal.fun/infinite-craft/
// @version     1.1
// ==/UserScript==

(async () => {
  const fileInput = document.createElement('input');
  fileInput.style =
    'position: absolute !important;height: 1px;width: 1px;overflow: hidden;clip: rect(1px, 1px, 1px, 1px);';
  fileInput.type = 'file';
  fileInput.accept = 'application/json';

  fileInput.onchange = () => {
    reader = new FileReader();
    reader.onload = (e) => {
      localStorage.setItem('infinite-craft-data', e.target.result);
      window.location.reload();
    };
    console.log(fileInput.files[0]);
    reader.readAsText(fileInput.files[0]);
  };
  document.body.appendChild(fileInput);

  const fileSelect = document.createElement('button');
  fileSelect.onclick = () => {
    fileInput.click();
  };
  fileSelect.style = 'position: fixed; bottom: 0; left: 40vw;';
  fileSelect.innerText = 'Import';

  document.body.appendChild(fileSelect);

  const fileDownload = document.createElement('button');
  fileDownload.style = 'position: fixed; bottom: 0; left: 35vw;';
  fileDownload.innerText = 'Export';
  fileDownload.onclick = () => {
    fileUrl = URL.createObjectURL(
      new Blob([localStorage.getItem('infinite-craft-data')], {
        type: 'application/octet-stream',
      })
    );
    a = document.createElement('a');
    a.href = fileUrl;
    a.download = 'elements.json';
    a.click();
    a.remove();
    URL.revokeObjectURL(fileUrl);
  };
  document.body.appendChild(fileDownload);
})();
