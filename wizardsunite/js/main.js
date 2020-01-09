function CFImages_init() {
  selectedItem = ""; /* this is a global variable */
  return;
}

function CFImagesButtonClick(element) {
  //var buttonID = element.id;
  var id = (element.id).replace('button-','');
  //var tableID = 'table-' + id;
  //var id = 'table-' + name.replace(/ /g,'-');
  document.getElementById('table-'+id).setAttribute("class","CFImagesTable");
  if ((selectedItem != "") && (selectedItem != id)) {
    document.getElementById('table-'+selectedItem).setAttribute("class","CFImagesTable hidden");
  }
  selectedItem = id; /* update the global variable */
  return;
}
