// create onload function
window.onload = function() {
    osSpecificDownloadButton()
}

function toggleNavbarDropdown() {
    console.log('test')
    const dropdown = document.querySelector('.navbar-links')
    if (dropdown.style.display === 'none' || dropdown.style.display === '') {
        dropdown.style.display = 'flex';
    }
    else {
        dropdown.style.display = 'none';
    }
}

window.addEventListener('resize', function() {
    const dropdown = document.querySelector('.navbar-links')
    if (window.innerWidth > 768) {
        dropdown.style.display = '';
    }
})




windows_downloads_template = `
<div class="download-links">
  <button>Download For Windows</button>
  <select onchange="selected_os(this)">
    <option value="1" selected hidden>x64</option>
    <option value="2">x86</option>
    
  </select>
</div>
`

mac_downloads_template = `
<div class="download-links">
  <button>Download For Mac</button>
  <select onchange="selected_os(this)">
    <option value="1">Intel</option>
    <option value="2" selected hidden>Arm</option>
  </select>
</div>
`

linux_downloads_template = `
<div class="download-links">
  <button>Download For Linux</button>
</div>
`
function osSpecificDownloadButton() {
    os = getOS();
    console.log(os)
    if (os === 'windows') {
        document.querySelector('.download-links-container').innerHTML += windows_downloads_template;
    } else if (os === 'mac os') {
        document.querySelector('.download-links-container').innerHTML += mac_downloads_template;
    } else if (os === 'linux') {
        document.querySelector('.download-links-container').innerHTML += linux_downloads_template;
    } else {
        html = windows_downloads_template + mac_downloads_template + linux_downloads_template;
        document.querySelector('.download-links-container').innerHTML += html;
    }

}

function getOS() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('android')) {
        return "android";
    }
    else if (userAgent.includes("iphone") || userAgent.includes("ipad")) {
        return "ios";
    }
    else if (userAgent.includes('windows')) {
        return 'windows';
    }
    else if (userAgent.includes('mac os')) {
        return 'mac os'
    }
    else if (userAgent.includes('linux')) {
        return 'linux'
    }
    else {
        return 'unknown'
    }
}

function selected_os(element) {
    value = element.value;
    // loop through list of options and hide selected value
    Array.from(element.children).forEach(option => {
        if (option.value == value) {
            // set to hidden
            console.log('hiding')
            option.hidden = true;
        }
        else {
            option.hidden = false;
        }
    })
}