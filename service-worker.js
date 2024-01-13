chrome.runtime.onMessage.addListener((message) => {
  console.log(message);
  if (message.action === "downloadButtonClicked") {
    console.log("YEEEYEEEYEEE");
  }
});
