/* Main javascript code */

function toggleMenu()
{
 var anchor = document.getElementById("topbar-menu-anchor");
 var menu = document.getElementById("topbar-menu-img");
 // Change menu icon coloring
 if (anchor.className == "menu-hide") {
  // Show menu
  menu.style.filter = "invert(0)";
  anchor.className = "menu-show";
  alert("menu now shown");
 } else {
  // Hide menu
  menu.style.filter = "invert(1)";
  anchor.className = "menu-hide";
 }
}