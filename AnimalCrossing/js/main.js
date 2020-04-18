function doSearchBugs() {
  /* initialization */
  var EntireList = document.getElementById("EntireBugList");  // the <div> with all the bugs
  var ListLength = EntireList.children.length;  // total number of bugs
  var bug = "";
  var name = "";
  var price = "";
  var location = "";
  var hours = "";
  var months = "";
  var header = "";
  var row = "";
  var cell = "";
  var field = "";
  
  /* prepare search output table */
  var SearchOutputTable = document.getElementById("SearchOutputTable");
  SearchOutputTable.innerHTML = ""; // empty the table of any previous search
  
  /* run the query */
  for (var i=0; i<ListLength; i++) {
    bug = (EntireList.children[i].innerHTML).split("*");
    name = bug[0];
    price = bug[1];
    location = bug[2];
    hours = bug[3];
    months = bug[4];
    row = SearchOutputTable.insertRow();  // append new row at the bottom
    // NAME
    cell = row.insertCell();
    cell.innerHTML = name;
    // PRICE
    cell = row.insertCell();
    cell.innerHTML = price;
    // LOCATION
    cell = row.insertCell();
    cell.innerHTML = location;
    // HOURS
    cell = row.insertCell();
    cell.innerHTML = hours;
    // MONTHS
    cell = row.insertCell();
    cell.innerHTML = months;
  }
  
  /* add table headers */
  header = SearchOutputTable.createTHead()
  row = header.insertRow();
  for (field of ["Name","Price","Location","Hours","Months"]) {
    cell = row.insertCell();
    cell.innerHTML = field;
  }
  
  /* finished */
  return;
}
