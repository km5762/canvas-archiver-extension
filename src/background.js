chrome.runtime.onInstalled.addListener(() => {
  chrome.action.disable();

  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    let exampleRule = {
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {
            hostEquals: 'canvas.wpi.edu',
          },
        }),
      ],
      actions: [new chrome.declarativeContent.ShowAction()],
    };

    let rules = [exampleRule];
    chrome.declarativeContent.onPageChanged.addRules(rules);
  });
});

chrome.runtime.onMessage.addListener(async (message) => {
  console.log(message);
  if (message.action === 'DOWNLOAD_BUTTON_CLICKED') {
    const url = new URL((await getCurrentTab()).url);
    const path = url.pathname.split('/');
    const courseId = path[path.indexOf('courses') + 1];

    let archive = [];
    const files = await getFilesFiles(url.origin, courseId);
    for (const file of files) {
      archive.push(file);
    }
    const modules = await getModules(url.origin, courseId);
    const moduleItems = await getModuleItems(modules);
    const moduleFiles = await getModuleFiles(moduleItems);
    console.log(moduleItems);
    console.log(modules);
    console.log(files);

    modules.forEach((module, i) => {
      const mFiles = moduleFiles[i];
      for (const file of mFiles) {
        archive.push({
          fileName: 'modules/' + module.name + '/' + file.filename,
          fileUrl: file.url,
        });
      }
    });


    fetchAndDownload(archive, courseId)
    console.log(archive);
  }
});

async function fetchAndDownload(objects, courseId) {
  objects.forEach(file => {
    chrome.downloads.download({
      url: file.fileUrl,
      filename: `${courseId}/` + file.fileName,
      saveAs: false
    });
  })
}

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

async function getFilesFiles(urlOrigin, courseId) {
  const filesUrl = urlOrigin + `/api/v1/courses/${courseId}/files`;
  let filesResponse = await fetch(filesUrl);
  let files = await filesResponse.json();
  let fileObjectList = [];
  files.forEach((element) => {
    fileObjectList.push(fileObjectHandler(element));
  });
  return fileObjectList;
}

function fileObjectHandler(fileObject) {
  let fileName = 'files/' + fileObject.filename;
  let fileUrl = fileObject.url;
  return { fileName, fileUrl };
}

async function getModules(origin, courseId) {
  const response = await fetch(
    origin + '/api/v1/courses/' + courseId + '/modules'
  );

  return await response.json();
}

async function getModuleItems(modules) {
  const responses = await Promise.all(
    modules.map((module) => fetch(module['items_url']))
  );

  return await Promise.all(responses.map((response) => response.json()));
}
async function getModuleFiles(items) {
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
