function doSearchBugs() {
  /* initialization */
  var EntireList = document.getElementById("EntireBugList");  // the <div> with all the bugs
  var ListLength = EntireList.children.length;  // total number of bugs
  var bug = "";
  var name = "";
  var price = "";
  var location = "";
  var hours = "", hourStart = "", hourEnd = "", hourSuffix = "";
  var months = "";
  var header = "", row = "", cell = "";
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
    hours = hours.split(",");
    if (hours.length == 24) { // whole day
      cell.innerHTML = "All day";
    } else {
      hourStart = hours[0];
      if (hourStart<12) { // am
        hourSuffix = "am";
        if (hourStart == 0) { hourStart = "12"; } // 0 => 12am
      } else {  // pm
        hourSuffix = "pm";
        hourStart = hourStart-12;
        if (hourStart == 0) { hourStart = "12"; } // 0 => 12pm
      }
      cell.innerHTML = hourStart + hourSuffix;
      hourEnd = hours[hours.length-1];
      if (hourEnd<12) { // am
        hourSuffix = "am";
        if (hourEnd == 0) { hourEnd = "12"; } // 0 => 12am
      } else {  // pm
        hourSuffix = "pm";
        hourEnd = hourEnd-12;
        if (hourEnd == 0) { hourEnd = "12"; } // 0 => 12pm
      }
      cell.innerHTML = " - " + hourEnd + hourSuffix;
    }
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
