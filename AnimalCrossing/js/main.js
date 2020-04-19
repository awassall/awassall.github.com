function doSearchBugs() {
  /* initialization */
  var EntireList = "";  // the <div> with all the bugs
  var ListLength = "";  // total number of bugs
  var critter = "";
  var name = "";
  var price = "";
  var location = "";
  var hours = "", hourStart = "", hourEnd = "", hourSuffix = "";
  var months = "", monthStart = "", monthEnd = "", monthLast = "", monthCurrent = "";
  var monthIRL = (new Date().getMonth()).toString();
  var header = "", row = "", cell = "", cellText = "", checkbox = "";
  var field = "", c = "";
  var searchCritter = "", searchAvailability = "", searchHemisphere = "";
  var caught = "";
  
  /* see what we're searching for */
  searchCritter = getRadioValue("CritterCategory");
  searchAvailability = getRadioValue("Availability");
  searchHemisphere = getRadioValue("Hemisphere"); // "NorthHemisphere" or "SouthHemisphere"
  
  /* prepare search output table */
  var SearchOutputTable = document.getElementById("SearchOutputTable");
  SearchOutputTable.innerHTML = ""; // empty the table of any previous search
  
  /* run the query */
  for (c of ["Bugs","Fish"]) {
    if (searchCritter.indexOf(c) == -1) { continue; } // skip if the search criteria exclude this critter
    if (c == "Bugs") { EntireList = document.getElementById("EntireBugList"); } // bugs
    else { EntireList = document.getElementById("EntireFishList"); }  // fish
    ListLength = EntireList.children.length;
    for (var i=0; i<ListLength; i++) {
      critter = (EntireList.children[i].innerHTML).split("*");
      name = critter[0];
      price = critter[1];
      location = critter[2];
      hours = critter[3];
      if (searchHemisphere == "NorthHemisphere") { months = critter[4]; } // northern hemisphere
      else { months = critter[5]; } // southern hemisphere
      // decide if we're going to skip it based on availability
      months = months.split(",");
      if (searchAvailability == "CurrentAvailable") { // only show those currently available based on month
        if (months.indexOf(monthIRL) == -1) { continue; } // not available this month
      }
      // okay, we aren't skipping it
      row = SearchOutputTable.insertRow();  // append new row at the bottom
      row.setAttribute("id",nameToID(name));
      caught = checkCaught(nameToID(name));
      if (caught == true) { row.setAttribute("class","RowDisplayCaught"); } // caught
      else { row.setAttribute("class","RowDisplayUncaught"); } // uncaught
      // ALREADY CAUGHT CHECKBOX
      cell = row.insertCell();
      cell.setAttribute("class","TableCheckboxCell");
      checkbox = document.createElement("input");
      checkbox.setAttribute("type","checkbox");
      checkbox.setAttribute("onclick","checkboxOnClickEvent(this);");
      if (caught == true) { checkbox.checked = true; }
      cell.appendChild(checkbox);
      // NAME
      cell = row.insertCell();
      cell.setAttribute("class","TableFieldCell");
      cell.innerHTML = name;
      // PRICE
      cell = row.insertCell();
      cell.setAttribute("class","TableFieldCell");
      cell.innerHTML = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      // LOCATION
      cell = row.insertCell();
      cell.setAttribute("class","TableFieldCell");
      cell.innerHTML = location;
      // HOURS
      cell = row.insertCell();
      cell.setAttribute("class","TableFieldCell");
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
      cell.setAttribute("class","TableFieldCell");
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
            if ((monthCurrent == (monthLast+1)) || ((monthLast-monthCurrent) == 11)) {  // this ends an ongoing range
              cellText += intToMonth(monthStart) + "-" + intToMonth(monthCurrent) + ", ";
            } else {  // it's a standalone month
              cellText += intToMonth(monthCurrent) + ", ";
            }
          } else {  // there are still more entries ahead of this one
            if ((monthCurrent == (monthLast+1)) || ((monthLast-monthCurrent) == 11)) {  // still part of the same range
              monthLast = monthCurrent; // reset monthLast
              continue;
            }
            else {
              // we hit the end of this range, time to log it
              if (monthStart == monthLast) {  // it was just 1 month
                cellText += intToMonth(monthStart) + ", ";
              } else {  // it was a range of months
                cellText += intToMonth(monthStart) + "-" + intToMonth(monthLast) + ", ";
              }
              // set the stage for the next range
              monthStart = monthLast = monthCurrent;
            }
          } // end ELSE
        } // end FOR
        if (cellText == "") { // there was only 1 month
          cellText = intToMonth(monthStart) + ", ";
        }
        cellText = cellText.substr(0,cellText.length-2);  // remove trailing ", "
        cell.innerHTML = cellText;
      } // end ELSE
    } // end of inner FOR loop
  } // end of outer FOR loop
  
  /* add table headers */
  header = SearchOutputTable.createTHead()
  row = header.insertRow();
  for (field of ["Caught","Name","Price","Location","Hours","Months"]) {
    cell = row.insertCell();
    cell.innerHTML = field;
  }
  
  /* finished */
  return;
}

function intToMonth(int) {
  var month = "";
  switch (int) {
    case 0:
      month = "January";
      break;
    case 1:
      month = "February";
      break;
    case 2:
      month = "March";
      break;
    case 3:
      month = "April";
      break;
    case 4:
      month = "May";
      break;
    case 5:
      month = "June";
      break;
    case 6:
      month = "July";
      break;
    case 7:
      month = "August";
      break;
    case 8:
      month = "September";
      break;
    case 9:
      month = "October";
      break;
    case 10:
      month = "November";
      break;
    case 11:
      month = "December";
      break;
    default:
      month = "Unknown";
      break;
  }
  return month;
}

function getRadioValue(name) {
  var options = document.getElementsByName(name);
  var result = "";
  for (var i=0; i<(options.length); i++) {
    if (options[i].checked == true) {
      result = options[i].value;
      break;
    }
  }
  return result;
}

function nameToID(name) {
  var id = "";
  id = name.replace(/ /g,"-").replace(/'/g,""); // convert space to "-" and remove "'"
  return id;
}

function checkboxOnClickEvent(checkbox) {
  var parentRow = checkbox.parentElement.parentElement;
  var parentID = parentRow.getAttribute("id");
  if (checkbox.checked) { // this is now marked as caught
    parentRow.setAttribute("class","RowDisplayCaught");
    localStorage.setItem("CaughtCritters-"+parentID,true);
  } else {  // this was marked as caught, but is being removed
    parentRow.setAttribute("class","RowDisplayUncaught");
    localStorage.removeItem("CaughtCritters-"+parentID);
  }
  return;
}

function checkCaught(id) {
  var caught = false;
  if (localStorage.getItem("CaughtCritters-"+id) == null) { // doesn't exist, meaning it's not caught
    caught = false;
  } else {  // it must be caught
    caught = true;
  }
  return caught;
}
