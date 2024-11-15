import {s3Url} from './consts.js';

export async function get_aws_data() {
    const response = await fetch(s3Url);
    const text = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml');
    return xml;
}

async function get_all_download_version_folders() {
    const xml = await get_aws_data();
    const keys = Array.from(xml.getElementsByTagName('Key'))

    return keys
        .map(key => key.textContent.replace('/', ''))
        .filter(key => /^[0-9]+\.[0-9]+\.[0-9]$/.test(key));
}

export async function get_all_download_files() {
    const xml = await get_aws_data();
    let contents = Array.from(xml.getElementsByTagName('Contents'));
    contents = contents.filter(c => {
        return !is_directory(c.getElementsByTagName("Key")[0].textContent);
    })
    let files = contents.map(c => ({
        path: c.getElementsByTagName("Key")[0].textContent,
        size: c.getElementsByTagName("Size")[0].textContent,
        date: c.getElementsByTagName("LastModified")[0].textContent,
    }));
    return files;
}

export async function get_latest_version_folder() {
    const xml = await get_aws_data();

    const keys = Array.from(xml.getElementsByTagName('Key'))

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

function is_directory(key) {
    if (key.split('/')[1] !== "") {
        return false;
    }
    return true;
}