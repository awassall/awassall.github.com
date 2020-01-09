function CFImages_init() {
  selectedItem = ""; /* this is a global variable */
  return;
}

function CFImagesButtonClick(element) {
  var name = element.innerHTML;
  var id = 'table-' + name.replace(/ /g,'-');
  var tableElement = document.getElementById(id);
  tableElement.setAttribute("class","test");
  return;
}
