document
  .getElementById("download-input")
  .addEventListener("change", (event) => {
    event.preventDefault();
    chrome.runtime.sendMessage({
      action: "downloadPathSelected",
      path: event.target.files[0].path,
    });
  });
