var dropdown;
var dropdown_button;

function onload_navbar() {
  dropdown = document.querySelector('.navbar-links')
  dropdown_button = document.querySelector('#navbar-dropdown-toggle')
}

function toggleNavbarDropdown() {
  console.log('test')
  if (dropdown.style.display === 'none' || dropdown.style.display === '') {
    dropdown.style.display = 'flex';
    dropdown_button.innerHTML = '&#10006;'
  }
  else {
    dropdown.style.display = 'none';
    dropdown_button.innerHTML = '&#9776;'
  }
}

window.addEventListener('resize', function() {
  const dropdown = document.querySelector('.navbar-links')
  if (window.innerWidth > 768) {
    dropdown.style.display = '';
    dropdown_button.innerHTML = '&#9776;'
  }
})