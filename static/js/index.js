import { s3Url } from './consts.js';
import { get_latest_version_folder } from './aws.js';

var version;

window.addEventListener('load', () => {
    osSpecificDownloadButton()
});

function windows_downloads_template(version) {
    const container = document.createElement('div');
    container.className = 'download-links';

    const anchor = document.createElement('a');
    anchor.textContent = 'Download For Windows';
    anchor.href = `${s3Url}/${version}/PyRun-v${version}-windows-x64.exe`;
    container.appendChild(anchor);

    const selectWrapper = document.createElement('div');
    selectWrapper.className = 'select-wrapper';
    container.appendChild(selectWrapper);

    const select = document.createElement('select');
    select.addEventListener('change', function() {
        selected_os_windows(this);
    });
    selectWrapper.appendChild(select);

    const x64Option = document.createElement('option');
    x64Option.value = 'x64';
    x64Option.textContent = 'x64';
    x64Option.selected = true;
    x64Option.hidden = true;
    select.appendChild(x64Option);

    const x86Option = document.createElement('option');
    x86Option.value = 'x86';
    x86Option.textContent = 'x86';
    select.appendChild(x86Option);

    return container;
}

function mac_downloads_template(version) {
    const container = document.createElement('div');
    container.className = 'download-links';

    const anchor = document.createElement('a');
    anchor.textContent = 'Download For Mac';
    anchor.href = `${s3Url}/${version}/PyRun-v${version}-macos-x64`;
    container.appendChild(anchor);

    const selectWrapper = document.createElement('div');
    selectWrapper.className = 'select-wrapper';
    container.appendChild(selectWrapper);

    const select = document.createElement('select');
    select.addEventListener('change', function() {
        selected_os_mac(this);
    });
    selectWrapper.appendChild(select);

    const x64Option = document.createElement('option');
    x64Option.value = 'x64';
    x64Option.textContent = 'x64';
    select.appendChild(x64Option);

    const arm64Option = document.createElement('option');
    arm64Option.value = 'arm64';
    arm64Option.textContent = 'arm64';
    arm64Option.selected = true;
    arm64Option.hidden = true;
    select.appendChild(arm64Option);

    return container;
}

function linux_downloads_template(version) {
    const container = document.createElement('div');
    container.className = 'download-links';

    const anchor = document.createElement('a');
    anchor.textContent = 'Download For Linux';
    anchor.href = `${s3Url}/${version}/PyRun-v${version}-linux-x64`;
    container.appendChild(anchor);
    return container;
}
async function osSpecificDownloadButton() {
    let os = getOS();
    version = await get_latest_version_folder();
    if (version === undefined) {
        version = '0.0.0'
    }
    document.querySelector('.download-links-container').innerHTML = '';
    // create title
    const title = document.createElement('h2')
    title.textContent = `Downloads`;
    const description = document.createElement('p')
    description.textContent = `Download now and enjoy! Uninstalling is always an option, but we think you’ll love it.`
    document.querySelector('.download-links-container').appendChild(title);
    document.querySelector('.download-links-container').appendChild(description);
    if (os === 'windows') {
        document.querySelector('.download-links-container').appendChild(windows_downloads_template(version));
    }
    else if (os === 'mac os') {
        document.querySelector('.download-links-container').appendChild(mac_downloads_template(version));
    }
    else if (os === 'linux') {
        document.querySelector('.download-links-container').appendChild(linux_downloads_template(version));
    }
    else {
        document.querySelector('.download-links-container').append(windows_downloads_template(version), mac_downloads_template(version), linux_downloads_template(version))
    }
    const all_downloads_link = document.createElement('a');
    all_downloads_link.textContent = 'All Downloads';
    all_downloads_link.href = 'downloads.html';
    document.querySelector('.download-links-container').appendChild(all_downloads_link);
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
    let value = element.value;
    // loop through list of options and hide selected value
    Array.from(element.children).forEach(option => {
        if (option.value === value) {
            option.hidden = true;
            element.parentElement.parentElement.querySelector('a').href = `${s3Url}/${version}/PyRun-v${version}-windows-${value}.exe`;
        }
        else {
            option.hidden = false;
        }
    })
}

function selected_os_mac(element) {
    let value = element.value;
    // loop through list of options and hide selected value
    Array.from(element.children).forEach(option => {
        if (option.value === value) {
            option.hidden = true;
            element.parentElement.parentElement.querySelector('a').href = `${s3Url}/${version}/PyRun-v${version}-macos-${value}`;
        }
        else {
            option.hidden = false;
        }
    })
}


