document
  .getElementById("download-button")
  .addEventListener("click", function () {
    chrome.runtime.sendMessage({ action: "downloadButtonClicked" });
  });
