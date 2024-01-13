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
    console.log(modules);
    // const files = await getFilesFiles(url.origin);
    const items = await getItems(modules);
    console.log(items);
    const files = await getFiles(items);
    console.log(files);

    archive = [];
    modules.forEach((module, i) => {
      const moduleFiles = files[i];
      for (const file of moduleFiles) {
        archive.push({
          path: 'modules/' + module.name + '/' + file.filename,
          url: file.url,
        });
      }
    });

    console.log(archive);
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

async function getFilesFiles(urlOrigin) {
  const filesUrl = urlOrigin + '/api/v1/files';
  let files = await fetch(filesUrl);
  let fileObjectList = [];
  files.forEach((element) => {
    fileObjectList.push(fileObjectHandler(element));
  });
  return fileObjectList;
}

function fileObjectHandler(fileObject) {
  // return [{"fileName": /module/announcement/<filename>, "fileurl": <url>},...]
  let fileName = 'files/' + fileObject.filename;
  let fileUrl = fileObject.url;
  return { fileName, fileUrl };
}
async function getModuleFiles(courseId) {
  // return [{"title": /module/announcement/<filename>, "fileurl": <url>},...]
}

async function getModules(origin, courseId) {
  const response = await fetch(
    origin + '/api/v1/courses/' + courseId + '/modules'
  );

  return await response.json();
}

async function getItems(modules) {
  const responses = await Promise.all(
    modules.map((module) => fetch(module['items_url']))
  );

  return await Promise.all(responses.map((response) => response.json()));
}
async function getFiles(items) {
  const files = [];
  for (const item of items) {
    const fileItems = item.filter((item) => item.type === 'File');
    const responses = await Promise.all(
      fileItems.map((fileItem) => fetch(fileItem['url']))
    );

    const fileData = await Promise.all(
      responses.map(async (response) => await response.json())
    );

    files.push(fileData);
  }

  return files;
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
