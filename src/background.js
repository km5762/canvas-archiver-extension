chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'canvas.wpi.edu', pathPrefix: '/courses/' },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowAction()],
      },
    ]);
  });
});

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.action === 'DOWNLOAD_BUTTON_CLICKED') {
    const url = new URL((await getCurrentTab()).url);
    const path = url.pathname.split('/');
    const courseId = path[path.indexOf('courses') + 1];

    const modules = await getModules(url.origin, courseId);
    const items = await getItems(modules);

    console.log(modules);
    console.log(items);
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

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

async function getModules(origin, courseId) {
  const response = await fetch(
    origin + '/api/v1/courses/' + courseId + '/modules'
  );

  return await response.json();
}

function getItems(module) {
  return fetch(module['items_url']);
}

function getFile(item) {
  return fetch(item['url']);
}

function getDownloadUrl(file) {
  return fetch(file['url']);
}
// if on https://<canvas>/courses/<course_id>/* (course specific download)
// Download Modules, Files, (Assignments, Announcements, Discussions)
// Modules:
// List all modules: https://<canvas>/api/v1/courses/<course_id>/modules (call modules url, returns json)
// For each module:
//   let title = module["title"]
//   let items_url = module["items_url"]
//   List all module_items (call items_url, returns json)
//     For each module_item:
//       if module_item["type"] == "File"
//         content_id = module_item["content_id"]
//         let file_object = call https://<canvas>/api/v1/files/<content_id> (returns json)
//         let file_name = file_object["filename"]
//         let file_contents_blob = call file_object["url"] (returns binary data)

// Files:
// List all files: https://canvas.wpi.edu/api/v1/courses/<course_id>/files (call files url, returns json)
// For each file object:
//   let name = file["filename"]
//   let file_contents_blob = call file["url"] (returns binary data)
//
// if on https://<canvas> or https://<canvas>/?login_success=1 (download from all courses)
