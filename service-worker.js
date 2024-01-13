// chrome.runtime.onMessage.addListener((message) => {
//   console.log(message);
//   if (message.action === "downloadButtonClicked") {
//     console.log(get_tab_name());
//   }
// });
// currentUrl = 
// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//   if (message.action === 'downloadButtonClicked') {
//     tab_name = 
//     get_tab_name(function (tabUrl) {
//       if(tabUrl){
//         if(tabUrl.includes("/courses")){
//           courses()
//         } else if (tabUrl.incl)
//       }
//     });
//   }
// });

// function get_tab_name(callback) {
//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     const currentUrl = tabs[0];
//     callback(currentUrl);
//   });
// }

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