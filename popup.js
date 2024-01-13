<<<<<<< HEAD
document
  .getElementById("download-button")
  .addEventListener("click", function () {
    chrome.runtime.sendMessage({ action: "DOWNLOAD_BUTTON_CLICKED" });
  });

//  if on course page
//    download files from
//    Files, Modules, Discussions, Announcements

// if on dashboard
//  enumerate all courses
//    for each course, do whats on course page
=======
const hostName = window.location.hostname;
document.getElementById('download-button').addEventListener('click', function () {
  chrome.runtime.sendMessage({ action: 'downloadButtonClicked' });
});
>>>>>>> 0c62b3133a5132eb1a96ed81152b8bcb9f947273
