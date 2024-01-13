document
  .getElementById('download-button')
  .addEventListener('click', function () {
    chrome.runtime.sendMessage({ action: 'DOWNLOAD_BUTTON_CLICKED' });
  });

//  if on course page
//    download files from
//    Files, Modules, Discussions, Announcements

// if on dashboard
//  enumerate all courses
//    for each course, do whats on course page
