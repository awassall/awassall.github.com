function CFImagesButtonClick(element) {
  var name = element.innerHTML;
  var id = 'table-' + name.replace(/ /g,'-');
  var tableElement = document.getElementById(id);
  tableElement.setAttribute("class","test");
  return;
}
