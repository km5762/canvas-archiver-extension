chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: "canvas.wpi.edu", pathPrefix: "/courses/" },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowAction()],
      },
    ]);
  });
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "DOWNLOAD_BUTTON_CLICKED") {
    console.log(message);
    downloadFile("https://canvas.wpi.edu/api/v1/files/6230398");
  }
});

async function downloadFile(url) {
  const response = await fetch(url);
  const responseJson = await response.json();

  chrome.downloads.download({
    url: responseJson.url,
    filename: responseJson.filename, //Optional
  });
}

// Modules
// if url matches `hostname`/courses/<course_id>/*
//  let files = []
//  let course_id = course_id
//  let modules = GET `hostname`/api/v1/courses/<course_id>/modules :json
//  files.append(modules.for_each(get_files_from_module_entry))
