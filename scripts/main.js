/* Main javascript code */

function toggleMenu()
{
 var box = document.getElementById("topbar-menu-box");
 // Change menu icon coloring
 if (box.className == "menu-hide") {
  // Show menu
  box.className = "menu-show";
 } else {
  // Hide menu
  box.className = "menu-hide";
 }
}
