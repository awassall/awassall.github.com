/* Main javascript code */

function toggleMenu()
{
 var cover = document.getElementById("topbar-menu-cover");
 // Change menu icon coloring
 if (cover.className == "menu-hide") {
  // Show menu
  cover.className = "menu-show";
 } else {
  // Hide menu
  cover.className = "menu-hide";
 }
}
