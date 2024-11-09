export function sort_data(data, query, os_filter, arch_filter, sort_by_header, sort_by_direction, secondary_sort_by_header) {
    data = data.filter(file => is_search_query_in_file(file, query));
    data = data.filter(file => file.os === os_filter || os_filter === "all");
    data = data.filter(file => file.arch === arch_filter || arch_filter === "all");

    data = data.sort((a, b) => {
        if (a[sort_by_header] === b[sort_by_header]) {
            if (sort_by_direction === "asc") {
                return a[secondary_sort_by_header] > b[secondary_sort_by_header] ? 1 : -1;
            }
            else {
                return a[secondary_sort_by_header] < b[secondary_sort_by_header] ? 1 : -1;
            }
        }
        else {
            if (sort_by_direction === "asc") {
                return a[sort_by_header] > b[sort_by_header] ? 1 : -1;
            }
            else {
                return a[sort_by_header] < b[sort_by_header] ? 1 : -1;
            }
        }
    });
    return data;
}

export function is_search_query_in_file(file, query) {
    if (query === "") {
        return true;
    }
    let keys = Object.keys(file);
    let query_in_key_value = keys.map(key => {
        return file[key].includes(query);
    });
    return query_in_key_value.includes(true);
}

export function process_data(data) {
    // loop through data
    data.forEach(file => {
        // get file name
        file['directory'] = file['path'].split('/').slice(0, -1).join('/');
        file['name'] = file['path'].split('/').slice(-1).join('/');

        // calculate version
        file['version'] = file['name'].match(/v\d+\.\d+\.\d+/)[0].replace('v', '');

        // calculate operating system
        file['os'] = file['name'].match(/linux|windows|macos/)[0];

        // calculate architecture
        file['arch'] = file['name'].match(/x86|x64|arm64/)[0];
    })
    return data
}

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}