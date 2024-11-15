// Document Elements
import {sort_data, process_data} from "./downloads_utils.js";
import {get_all_download_files} from "./aws.js";
import {onload_navbar} from "./navbar.js";

var downloads_table;
var os_input_container;
var os_input_slider;
var arch_input_slider;
var arch_input_container;

var search_input = "";
var os_filter = "all";
var arch_filter = "all";

var sort_by_header = "name";
var sort_by_direction = "asc";

var data;

window.onload = function() {
  onload_navbar()
}

function date_format(td, date) {
  td.textContent = date.toLocaleDateString('en-GB')
}
function size_format(td, size) {
  td.textContent = `${(size / 1024 / 1024).toFixed(2)} MB`
}

function link_format(td, link) {
  const a = document.createElement('a')
  td.appendChild(a)
  a.href = link
  a.textContent = 'download'
  a.classList.add('material-symbols-outlined')
}

const headers = [
  {header: "Name", key: "name", format_func: null},
  {header: "Operating System", key: "os"},
  {header: "Architecture", key: "arch"},
  {header: "Version", key: "version"},
  {header: "Release Date", key: "date", format: date_format},
  {header: "Size (mb)", key: "size", format: size_format},
  {header: "Link", key: "link", format: link_format}
]

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

var original_data;
window.onload = async function () {
  // original_data = process_data(test_data)
  original_data = process_data(await get_all_download_files());
  console.log(original_data)
  onload_navbar()

  // get elements
  downloads_table = document.getElementById("downloads-table")


  os_input_slider = document.getElementById("os-input-slider")
  os_input_container = document.getElementById("os-input-container")

  arch_input_slider = document.getElementById("arch-input-slider")
  arch_input_container = document.getElementById("arch-input-container")

  change_os(os_input_container.children[1])

  data = sort_data(original_data, search_input, os_filter, arch_filter, sort_by_header, sort_by_direction);
  render_table(data)

  document.getElementById('all-os-selector-label').addEventListener('click', function () {
    change_os(this)
  });
  document.getElementById('windows-selector-label').addEventListener('click', function () {
    change_os(this)
  });
  document.getElementById('macos-selector-label').addEventListener('click', function () {
    change_os(this)
  });
  document.getElementById('linux-selector-label').addEventListener('click', function () {
    change_os(this)
  });

  document.getElementById('search-bar').addEventListener('input', function () {
    change_search_query(this.value)
  });
}




function render_table() {
  downloads_table.innerHTML = '';

  if (data.length === 0) {
    const tr = document.createElement('tr')
    downloads_table.appendChild(tr)
    const td = document.createElement('td')
    tr.appendChild(td)
    td.textContent = 'No files found'
    td.id = 'no-files-found'
    return
  }
  const thead = document.createElement('thead')
  downloads_table.appendChild(thead)

  const tr = document.createElement('tr')
  thead.appendChild(tr);

  headers.forEach(h => {
    const th = document.createElement('th')
    tr.appendChild(th)
    const sort_by_arrow = sort_by_header === h.key ? sort_by_direction === 'asc' ? '▲' : '▼' : ''
    th.textContent = `${h.header} ${sort_by_arrow}`
    th.dataset.key = h.key
    if (h.key !== 'link') {
      console.log(h.key)
      th.addEventListener('click', function () {
        change_sort_by(h)
      });
    }

  })

  const tbody = document.createElement('tbody')
  downloads_table.appendChild(tbody)
  data.forEach(d => {
    const tr = document.createElement('tr')
    tbody.appendChild(tr)
    headers.forEach(header => {
      const td = document.createElement('td')
      tr.appendChild(td)
      td.dataset.key = header.key
        if (header.format) {
            header.format(td, d[header.key])
        }
        else {
            td.textContent = d[header.key]
        }
    })
  })
}

function change_os(ele) {
  os_input_slider.style.left = ele.offsetLeft + 'px';
  os_input_slider.style.width = ele.offsetWidth + 'px';

  if (ele.children[0].value === "all") {
    arch_input_container.innerHTML = ""
    arch_input_container.style.display = "none"
  }
  else if (ele.children[0].value === "windows") {
    arch_input_container.style.display = "flex"
    create_arch_selector(arch_input_container, ["all", "x86", "x64"]);
    arch_input_slider = document.getElementById("arch-input-slider")

    change_arch(arch_input_container.children[1])
  }
  else if (ele.children[0].value === "linux") {
    arch_input_container.innerHTML = ""
    arch_input_container.style.display = "none"
  }
  else if (ele.children[0].value === "macos") {
    arch_input_container.style.display = "flex"
    create_arch_selector(arch_input_container, ["all", "x64", "arm64"])
    arch_input_slider = document.getElementById("arch-input-slider")

    change_arch(arch_input_container.children[1])
  }
  os_filter = ele.children[0].value
  arch_filter = "all"
  data = sort_data(original_data, search_input, os_filter, arch_filter, sort_by_header, sort_by_direction);
  render_table(data)
}

function change_arch(ele) {
  arch_input_slider.style.left = ele.offsetLeft + 'px';
  arch_input_slider.style.width = ele.offsetWidth + 'px';
  arch_filter = ele.children[0].value
  data = sort_data(original_data, search_input, os_filter, arch_filter, sort_by_header, sort_by_direction);
  render_table(data)
}

function create_arch_selector(arch_input_container, archs) {
  arch_input_container.innerHTML = ''

  arch_input_slider = document.createElement('div')
  arch_input_slider.id = 'arch-input-slider'
  arch_input_slider.classList.add('arch-input-slider')
  arch_input_slider.addEventListener('click', function () {
    change_arch(this)
  });
  arch_input_container.appendChild(arch_input_slider)

  archs.forEach((arch, index) => {
    const label = document.createElement('label')
    arch_input_container.appendChild(label)
    label.htmlFor = arch
    label.addEventListener('click', function () {
        change_arch(this)
    });
    label.appendChild(document.createTextNode(arch))
    const input = document.createElement('input')
    label.appendChild(input)
    input.type = 'radio'
    input.name = 'arch'
    input.value = arch
    input.id = arch
    if (index === 0) {
      input.checked = true
    }
  })
}

function change_search_query(value) {
  search_input = value
  data = sort_data(original_data, search_input, os_filter, arch_filter, sort_by_header, sort_by_direction);
  render_table(data)
}

function change_sort_by(header) {
  if (sort_by_header === header.key) {
    sort_by_direction = sort_by_direction === 'asc' ? 'desc' : 'asc';
  }
  else {
    sort_by_header = header.key;
    sort_by_direction = 'asc';
  }
  data = sort_data(original_data, search_input, os_filter, arch_filter, sort_by_header, sort_by_direction);
  render_table(data)
}