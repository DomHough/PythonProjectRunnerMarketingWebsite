var downloads_table;
const headers = ["name", "version", "date", "size"]

const test_data = [
  {
    "path": "1.0.0/PyRun-v1.0.0-windows-x86.exe",
    "size": "24685256",
    "date": "2024-10-27T23:30:14.000Z",
  },
  {
    "path": "1.0.0/PyRun-v1.0.0-windows-x64.exe",
    "size": "24685256",
    "date": "2024-10-27T23:30:14.000Z",
  },
  {
    "path": "1.0.0/PyRun-v1.0.0-linux-x64",
    "size": "24685256",
    "date": "2024-10-27T23:30:14.000Z",
  },
  {
    "path": "1.0.0/PyRun-v1.0.0-macos-x64",
    "size": "24685256",
    "date": "2024-10-27T23:30:14.000Z",
  },
  {
    "path": "1.0.0/PyRun-v1.0.0-macos-arm64",
    "size": "24685256",
    "date": "2024-10-27T23:30:14.000Z",
  },

  {
    "path": "1.1.0/PyRun-v1.1.0-windows-x86.exe",
    "size": "28685256",
    "date": "2024-11-27T23:30:14.000Z",
  },
  {
    "path": "1.1.0/PyRun-v1.1.0-windows-x64.exe",
    "size": "28685256",
    "date": "2024-11-27T23:30:14.000Z",
  },
  {
    "path": "1.1.0/PyRun-v1.1.0-linux-x64",
    "size": "28685256",
    "date": "2024-11-27T23:30:14.000Z",
  },
  {
    "path": "1.1.0/PyRun-v1.1.0-macos-x64",
    "size": "28685256",
    "date": "2024-11-27T23:30:14.000Z",
  },
  {
    "path": "1.1.0/PyRun-v1.1.0-macos-arm64",
    "size": "28685256",
    "date": "2024-11-27T23:30:14.000Z",
  },


]

window.onload = async function () {
  var data;
  onload_navbar()
  downloads_table = document.getElementById("downloads-table")
  // var data = await get_all_download_files()
  // console.log(data);
  data = process_data(test_data);
  console.log(data)
  render_table(data, "", "name", "asc", "name")
}

function sort_data(data, search_query, sort_by_header, sort_by_direction, secondary_sort_by_header) {
  let queried_data = data.filter(file => is_search_query_in_file(file, search_query));

  let sorted_data = queried_data.sort((a, b) => {
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

  return sorted_data;
}
function is_search_query_in_file(file, search_query) {
  if (search_query === "") {
    return true;
  }
  let keys = Object.keys(file);
  let search_query_in_key_value = keys.map(key => {
    return file[key].includes(search_query);
  });
  return search_query_in_key_value.includes(true);
}

function render_table(data, search_query, sort_by_header, sort_by_direction, secondary_sort_by_header) {
  data = sort_data(data, search_query, sort_by_header, sort_by_direction, secondary_sort_by_header)


  var html = '<thead><tr>';

  headers.forEach(h => {
    html += `<th>${capitalizeFirstLetter(h)}</th>`
  })
    html += '</tr></thead><tbody>';
  data.forEach(d => {
    html += `<tr>`
    headers.forEach(header => {
      html += `<td>${d[header]}</td>`
    })
    html += `</tr>`
  })
    html += '</tbody>'
  downloads_table.innerHTML = html;
}

function process_data(data) {
  // loop through data
  data.forEach(file => {
    // get file name
    file['directory'] = file['path'].split('/').slice(0, -1).join('/');
    file['name'] = file['path'].split('/').slice(-1).join('/');

    // calculate version
    file['version'] = file['name'].match(/v\d+\.\d+\.\d+/)[0].replace('v', '');

    // calculate operating system
    file['os'] = file['name'].match(/linux|windows|macos/)[0];
  })
  return data
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}