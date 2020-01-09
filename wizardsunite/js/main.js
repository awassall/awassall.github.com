function CFImages_init() {
  selectedItem = ""; /* this is a global variable */
  return;
}

function CFImagesButtonClick(element) {
  var id = (element.id).replace('button-','');
  document.getElementById('table-'+id).setAttribute("class","CFImagesTable");
  document.getElementById('button-'+id).setAttribute("class","CFImagesButton CFImagesButtonSelected");
  if ((selectedItem != "") && (selectedItem != id)) {
    document.getElementById('table-'+selectedItem).setAttribute("class","CFImagesTable hidden");
    document.getElementById('button-'+selectedItem).setAttribute("class","CFImagesButton");
  }
  selectedItem = id; /* update the global variable */
  return;
}
