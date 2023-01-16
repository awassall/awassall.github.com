/* Main javascript code */

function toggleMenu()
{
 var anchor = document.getElementById("topbar-menu-anchor");
 // Change menu icon coloring
 if (anchor.className == "menu-hide") {
  // Show menu
  anchor.className = "menu-show";
 } else {
  // Hide menu
  anchor.className = "menu-hide";
 }
}
