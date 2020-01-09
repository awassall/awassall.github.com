function CFImages_init() {
  selectedItem = ""; /* this is a global variable */
  return;
}

function CFImagesButtonClick(element) {
  var name = element.innerHTML;
  var id = 'table-' + name.replace(/ /g,'-');
  document.getElementById(id).setAttribute("class","CFImagesTable");
  if (selectedItem != "") {
    document.getElementById(selectedItem).setAttribute("class","CFImagesTable hidden");
  }
  selectedItem = id; /* update the global variable */
  return;
}
