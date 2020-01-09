function CFImages_init() {
  selectedItem = ""; /* this is a global variable */
  return;
}

function CFImagesButtonClick(element) {
  var buttonID = element.id;
  var id = buttonID.replace('button-','');
  var tableID = 'table-' + id;
  //var id = 'table-' + name.replace(/ /g,'-');
  document.getElementById(tableID).setAttribute("class","CFImagesTable");
  if ((selectedItem != "") && (selectedItem != id)) {
    document.getElementById('table-'+id).setAttribute("class","CFImagesTable hidden");
  }
  selectedItem = id; /* update the global variable */
  return;
}
