function CFImages_init() {
  selectedItem = ""; /* this is a global variable */
  return;
}

function CFImagesButtonClick(element) {
  var name = element.innerHTML;
  var id = 'table-' + name.replace(/ /g,'-');
  document.getElementById(id).setAttribute("class","CFImagesTable showMe");
  if (selectedItem != "") {
    document.getElementById(selectedItem).setAttribute("class","CFImagesTable");
  }
  selectedItem = id; /* update the global variable */
  return;
}
