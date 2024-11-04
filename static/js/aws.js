async function get_aws_data() {
   console.log(s3Url)
    const response = await fetch(s3Url);
    const text = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml');
    return xml;
}

async function get_all_download_version_folders() {
    const xml = await get_aws_data();
    const keys = Array.from(xml.getElementsByTagName('Key'))

    const version_folders= keys
        .map(key => key.textContent.replace('/', ''))
        .filter(key => /^[0-9]+\.[0-9]+\.[0-9]$/.test(key));
    return version_folders;
}

async function get_all_download_files() {
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

function is_directory(key) {
    if (key.split('/')[1] !== "") {
        return false;
    }
    return true;
}