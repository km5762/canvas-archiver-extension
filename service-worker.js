chrome.runtime.onMessage.addListener((message) => {
  console.log(message);
  if (message.action === "downloadButtonClicked") {
    console.log(message);
  }
});

// if on https://<canvas>/courses/<course_id>/* (course specific download)
// Download Modules, Files, (Assignments, Announcements, Discussions)
// Modules:
// List all modules: https://<canvas>/api/v1/courses/<course_id>/modules (call modules url, returns json)
// For each module:
//   let title = module["title"]
//   let items_url = module["items_url"]
//   List all module items (call items_url, returns json)
//     for each item:
//       let type = module_item["type"]
//         if type == "File"
//           content_id = module_item["content_id"]
//           let file_object = call https://<canvas>/api/v1/files/<content_id> (returns json)
//           let file_contents_blob = call file_object["url"] (returns binary data)

// if on https://<canvas> or https://<canvas>/?login_success=1 (download from all courses)