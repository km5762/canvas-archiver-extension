document
  .getElementById('download-button')
  .addEventListener('click', function () {
    const modules = document
      .querySelector('.toggle-button.modules')
      .classList.contains('toggled');
    const files = document
      .querySelector('.toggle-button.files')
      .classList.contains('toggled');
    const assignments = document
      .querySelector('.toggle-button.assignments')
      .classList.contains('toggled');
    const pages = document
      .querySelector('.toggle-button.pages')
      .classList.contains('toggled');

    chrome.runtime.sendMessage({
      action: 'DOWNLOAD_BUTTON_CLICKED',
      options: { modules, files, assignments, pages },
    });
  });

const toggleButtons = document.querySelectorAll('.toggle-button');

for (const toggleButton of toggleButtons) {
  toggleButton.addEventListener('click', () => {
    toggleButton.classList.toggle('toggled');
  });
}

//  if on course page
//    download files from
//    Files, Modules, Discussions, Announcements

// if on dashboard
//  enumerate all courses
//    for each course, do whats on course page
