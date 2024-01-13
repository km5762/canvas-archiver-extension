chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "logToConsole") {
    console.log("Button pressed!");
  }
});
