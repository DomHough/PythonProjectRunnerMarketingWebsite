// Document Elements
import {sort_data, process_data, capitalizeFirstLetter} from "./downloads_utils.js";

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
var secondary_sort_by_header = "name";

var data;
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

var original_data;
window.onload = async function () {
  original_data = process_data(test_data);
  onload_navbar()

  // get elements
  downloads_table = document.getElementById("downloads-table")


  os_input_slider = document.getElementById("os-input-slider")
  os_input_container = document.getElementById("os-input-container")

  arch_input_slider = document.getElementById("arch-input-slider")
  arch_input_container = document.getElementById("arch-input-container")

  change_os(os_input_container.children[1])
  // var data = await get_all_download_files()

  data = sort_data(original_data, search_input, os_filter, arch_filter, sort_by_header, sort_by_direction, secondary_sort_by_header);
  render_table(data)
}




function render_table() {

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







function change_os(ele) {
  os_input_slider.style.left = ele.offsetLeft + 'px';
  os_input_slider.style.width = ele.offsetWidth + 'px';

  if (ele.children[0].value === "all") {
    arch_input_container.innerHTML = ""
    arch_input_container.style.display = "none"
  }
  else if (ele.children[0].value === "windows") {
    arch_input_container.style.display = "flex"
    arch_input_container.innerHTML = create_arch_selector(["all", "x86", "x64"])
    arch_input_slider = document.getElementById("arch-input-slider")

    change_arch(arch_input_container.children[1])
  }
  else if (ele.children[0].value === "linux") {
    arch_input_container.innerHTML = ""
    arch_input_container.style.display = "none"
  }
  else if (ele.children[0].value === "macos") {
    arch_input_container.style.display = "flex"
    arch_input_container.innerHTML = create_arch_selector(["all", "x64", "arm64"])
    arch_input_slider = document.getElementById("arch-input-slider")

    change_arch(arch_input_container.children[1])
  }
  os_filter = ele.children[0].value
  arch_filter = "all"
  data = sort_data(original_data, search_input, os_filter, arch_filter, sort_by_header, sort_by_direction, secondary_sort_by_header);
  render_table(data)
}

function change_arch(ele) {
  arch_input_slider.style.left = ele.offsetLeft + 'px';
  arch_input_slider.style.width = ele.offsetWidth + 'px';
  arch_filter = ele.children[0].value
  data = sort_data(original_data)
  render_table(data)
}

function create_arch_selector(archs) {
  var html = "";
  html += "<div id='arch-input-slider' class='arch-input-slider' onclick='change_arch(this)'></div>"
  archs.forEach((arch, index) => {
    html += `
      <label for="${arch}" onclick="change_arch(this)">
        ${arch}
        <input type="radio" name="arch" value="${arch}" id="${arch}" ${index === 0 ? 'checked' : ''}>
      </label>
      `
  })
  return html;
}

function change_search_query(value) {
  search_input = value
  data = sort_data(original_data)
  render_table(data)
}