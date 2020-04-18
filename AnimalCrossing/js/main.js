function doSearchBugs() {
  /* initialization */
  var EntireList = document.getElementById("EntireBugList");  // the <div> with all the bugs
  var ListLength = EntireList.children.length;  // total number of bugs
  var bug = "";
  var name = "";
  var price = "";
  var location = "";
  var hours = "", hourStart = "", hourEnd = "", hourSuffix = "";
  var months = "", monthStart = "", monthEnd = "", monthLast = "", monthCurrent = "";
  var header = "", row = "", cell = "", cellText = "";
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
      hourStart = parseInt(hours[0]);
      if (hourStart<12) { hourSuffix = "am"; }
      else { hourSuffix = "pm"; }
      hourStart = (((hourStart + 11) % 12) + 1);
      cellText = hourStart + hourSuffix;
      hourEnd = parseInt(hours[hours.length-1]);
      if (hourEnd<12) { hourSuffix = "am"; }
      else { hourSuffix = "pm"; }
      hourEnd = (((hourEnd + 11) % 12) + 1);
      cellText += " - " + hourEnd + hourSuffix;
      cell.innerHTML = cellText;  // store it
    }
    // MONTHS
    cell = row.insertCell();
    months = months.split(",");
    if (months.length == 12) {  // all year
      cell.innerHTML = "All year";
    } else {
      // this is more complicated than hours, because there can be multiple (disconnected) date ranges
      // but we know they're always in order, so that helps
      cellText = "";
      monthStart = monthLast = parseInt(months[0]);
      for (var m=1; m<months.length; m++) {
        monthCurrent = parseInt(months[m]);
        if (m == (months.length-1)) { //this is the last month in the whole set
          if (monthCurrent == (monthLast+1))||((monthLast-monthCurrent) == 11) {  // this ends an ongoing range
            cellText += monthStart + "-" + monthCurrent + ", ";
          } else {  // it's a standalone month
            cellText += monthCurrent + ", ";
          }
        } else {  // there are still more entries ahead of this one
          if (monthCurrent == (monthLast+1))||((monthLast-monthCurrent) == 11) {  // still part of the same range
            monthLast = monthCurrent; // reset monthLast
            continue;
          }
          else {
            // we hit the end of this range, time to log it
            if (monthStart == monthLast) {  // it was just 1 month
              cellText += monthStart + ", ";
            } else {  // it was a range of months
              cellText += monthStart + "-" + monthLast + ", ";
            }
            // set the stage for the next range
            monthStart = monthLast = monthCurrent;
          }
        } // end ELSE
      } // end FOR
      if (cellText == "") { // there was only 1 month
        cellText = monthStart + ", ";
      }
      cellText = cellText.substr(0,cellText.length-2);  // remove trailing ", "
      cell.innerHTML = cellText;
    } // end ELSE
  } // end of FOR loop
  
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
