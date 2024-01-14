document
  .getElementById('download-button')
  .addEventListener('click', function () {
    const modules = document.getElementById('modules-checkbox').checked;
    const files = document.getElementById('files-checkbox').checked;
    const assignments = document.getElementById('assignments-checkbox').checked;

    chrome.runtime.sendMessage({
      action: 'DOWNLOAD_BUTTON_CLICKED',
      options: { modules, files, assignments },
    });
  });

//  if on course page
//    download files from
//    Files, Modules, Discussions, Announcements

// if on dashboard
//  enumerate all courses
//    for each course, do whats on course page
