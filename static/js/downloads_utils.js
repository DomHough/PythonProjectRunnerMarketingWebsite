import { s3Url } from "./consts.js";

export function sort_data(data, query, os_filter, arch_filter, sort_by_header, sort_by_direction) {
    if (data.length === 0) {
        return data;
    }

    if (query !== "") {
        data = data.filter(file => is_search_query_in_file(file, query, false));
    }
    if (os_filter !== "" && os_filter !== "all") {
        data = data.filter(file => file.os.toLowerCase() === os_filter.toLowerCase());
    }
    if (arch_filter !== "" && arch_filter !== "all") {
        data = data.filter(file => file.arch.toLowerCase() === arch_filter.toLowerCase());
    }

    if (sort_by_header !== "") {
        data = data.sort((a, b) => {
            return sort_data_items(a, b, sort_by_header, sort_by_direction);
        });
    }
    return data;
}

export function is_search_query_in_file(file, query, match_case=false) {
    if (query === "") {
        return true;
    }

    if (match_case === false) {
        query = query.toLowerCase()
    }

    let keys = Object.keys(file);

    var query_in_key_value;
    if (match_case === true) {
        query_in_key_value = keys.map(key => {
            return file[key].includes(query);
        });
    }
    else {
        query_in_key_value = keys.map(key => {
            if (typeof file[key] === 'number') {
                return file[key].toString().includes(query);
            }
            else if (key === 'date') {
                return file[key].toLocaleDateString().includes(query);
            }
            return file[key].toLowerCase().includes(query);
        });
    }

    return query_in_key_value.includes(true);
}

export function process_data(data) {
    // loop through data
    data.forEach(file => {
        // get file name
        file['directory'] = file['path'].split('/').slice(0, -1).join('/');
        file.name = file['path'].split('/').slice(-1).join('/').replace('.exe', '');

        // calculate version
        file['version'] = file.name.match(/v\d+\.\d+\.\d+/)[0].replace('v', '');

        file.date = new Date(file.date);
        console.log(file.date)

        // calculate operating system
        file['os'] = file.name.match(/linux|windows|macos/)[0];
        // capitalise os
        file['os'] = file['os'].charAt(0).toUpperCase() + file['os'].slice(1);
        if (file['os'] === 'Macos') {
            file['os'] = 'macOS';
        }

        // calculate architecture
        file['arch'] = file.name.match(/x86|x64|arm64/)[0];

        file.size = Number(file.size);
        file.link = `${s3Url}/${file.path}`
    })
    return data
}

export function compare_version_number(a, b, sort_by_direction) {
    a = a.split('.').map(Number);
    b = b.split('.').map(Number);
    for (let i = 0; i < a.length; i++) {
        if (sort_by_direction === "asc") {
            if (a[i] > b[i]) return 1;
            if (a[i] < b[i]) return -1;
        }
        else {
            if (a[i] > b[i]) return -1;
            if (a[i] < b[i]) return 1
        }
    }
    return 0;
}

export function sort_data_items(a, b, sort_by_header, sort_by_direction) {
    if (a[sort_by_header] === b[sort_by_header]) {
        if (sort_by_direction === "desc") {
            return a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1;
        }
        else {
            return a.name > b.name ? 1 : -1;
        }
    }
    else {
        if (sort_by_header === "version") {
            return compare_version_number(a[sort_by_header], b[sort_by_header], sort_by_direction);
        }
        else if (sort_by_header === "size") {
            if (sort_by_direction === "desc") {
                return a[sort_by_header] < b[sort_by_header] ? 1 : -1;
            }
            else {
                return a[sort_by_header] > b[sort_by_header] ? 1 : -1;
            }
        }
        else if (sort_by_header === "date") {
            if (sort_by_direction === "desc") {
                return a[sort_by_header] < b[sort_by_header] ? 1 : -1;
            }
            else {
                return a[sort_by_header] > b[sort_by_header] ? 1 : -1;
            }
        }
        else {
            if (sort_by_direction === "desc") {
                return a[sort_by_header].toLowerCase() < b[sort_by_header].toLowerCase() ? 1 : -1;
            }
            else {
                return a[sort_by_header].toLowerCase() > b[sort_by_header].toLowerCase() ? 1 : -1;
            }
        }

    }

}