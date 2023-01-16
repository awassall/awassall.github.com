/* Main javascript code */

function toggleMenu()
{
 var anchor = document.getElementById("topbar-menu-anchor");
 var img = document.getElementById("topbar-menu-img");
 // Change menu icon coloring
 if (anchor.className == "menu-hide") {
  // Show menu
  img.style.filter = "none";
  anchor.className = "menu-show";
  alert("menu now shown");
 } else {
  // Hide menu
  img.style.filter = "invert(1)";
  anchor.className = "menu-hide";
  alert("menu now hidden");
 }
}
