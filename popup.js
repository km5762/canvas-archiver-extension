const hostName = window.location.hostname;
document.getElementById('download-button').addEventListener('click', function () {
  chrome.runtime.sendMessage({ action: 'downloadButtonClicked' });
});