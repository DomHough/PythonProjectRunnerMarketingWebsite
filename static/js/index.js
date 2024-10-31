const bucketName = 'pyrun-application-repository'
const region = 'eu-west-2'
const s3Url = `http://${bucketName}.s3.${region}.amazonaws.com`

var version;

window.onload = function() {
    osSpecificDownloadButton()
    onload_navbar()
}

const windows_downloads_template = (version) => `
<div class="download-links">
  <button onclick="window.location.href='${s3Url}/${version}/PyRun-v${version}-windows-x64.exe'">Download For Windows</button>
  <div class="select-wrapper">
      <select onchange="selected_os_windows(this)">
        <option value="x64" selected hidden>x64</option>
        <option value="x86">x86</option>
      </select>
  </div>
</div>
`

const mac_downloads_template = (version) => `
<div class="download-links">
  <button onclick="window.location.href='${s3Url}/${version}/PyRun-v${version}-macos-x64'">Download For Mac</button>
  <div class="select-wrapper">
      <select onchange="selected_os_mac(this)">
        <option value="x64">x64</option>
        <option value="arm64" selected hidden>arm64</option>
      </select>
  </div>
</div>
`

const linux_downloads_template= (version) => `
<div class="download-links">
  <button onclick="window.location.href='${s3Url}/${version}/PyRun-v${version}-linux-x64'">Download For Linux</button>
</div>
`
async function osSpecificDownloadButton() {
    os = getOS();
    version = await getLatestVersionFolder();
    if (version === undefined) {
        version = '0.0.0'
    }
    if (os === 'windows') {
        document.querySelector('.download-links-container').innerHTML += windows_downloads_template(version);
    }
    else if (os === 'mac os') {
        document.querySelector('.download-links-container').innerHTML += mac_downloads_template(version);
    }
    else if (os === 'linux') {
        document.querySelector('.download-links-container').innerHTML += linux_downloads_template(version);
    }
    else {
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

function selected_os_windows(element) {
    value = element.value;
    // loop through list of options and hide selected value
    Array.from(element.children).forEach(option => {
        if (option.value == value) {
            // set to hidden
            console.log('hiding')
            option.hidden = true;
            element.parentElement.parentElement.querySelector('button').setAttribute('onclick', `window.location.href='${s3Url}/${version}/PyRun-v${version}-windows-${value}.exe'`)
        }
        else {
            option.hidden = false;
        }
    })
}

function selected_os_mac(element) {
    value = element.value;
    // loop through list of options and hide selected value
    Array.from(element.children).forEach(option => {
        if (option.value == value) {
            // set to hidden
            console.log('hiding')
            option.hidden = true;
            element.parentElement.parentElement.querySelector('button').setAttribute('onclick', `window.location.href='${s3Url}/${version}/PyRun-v${version}-macos-${value}'`)
        }
        else {
            option.hidden = false;
        }
    })
}


async function getLatestVersionFolder() {
    const response = await fetch(s3Url);
    const text = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'application/xml');

    const keys = Array.from(xml.getElementsByTagName('Key'))
    console.log()

    const versionFolders = keys
      .map(key => key.textContent.replace('/', ''))
      .filter(key => /^[0-9]+\.[0-9]+\.[0-9]$/.test(key));

    // get highest version number
    versionFolders.sort((a, b) => {
        a = a.split('.').map(Number);
        b = b.split('.').map(Number);
        for (let i = 0; i < a.length; i++) {
            if (a[i] > b[i]) return -1;
            if (a[i] < b[i]) return 1;
        }
        return 0;
    })
    return versionFolders[0]
}