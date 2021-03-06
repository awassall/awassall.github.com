function doSearch() {
  /* initialization */
  var EntireList = "";  // the <div> with all the bugs
  var ListLength = "";  // total number of bugs
  var critter = "";
  var name = "";
  var price = "";
  var location = "";
  var id = "";
  var hours = "", hourStart = "", hourLast = "", hourCurrent = "";
  var months = "", monthStart = "", monthEnd = "", monthLast = "", monthCurrent = "";
  var monthIRL = new Date().getMonth();
  var monthIRLstring = monthIRL.toString();
  var lastMonthIRLstring = ((monthIRL+12-1)%12).toString();
  var nextMonthIRLstring = ((monthIRL+12+1)%12).toString();
  var header = "", row = "", cell = "", cellText = "", checkbox = "";
  var field = "", c = "";
  var searchCritter = "", searchAvailability = "", searchHemisphere = "", searchCaught = "";
  var caught = "";
  var newThisMonth = false, leavingThisMonth = false;
  
  /* see what we're searching for */
  searchCritter = getRadioValue("CritterCategory"); // "BugsOnly", "FishOnly", or "BugsAndFish"
  searchAvailability = getRadioValue("Availability"); // "CurrentAvailable" or "AllAvailable"
  searchHemisphere = getRadioValue("Hemisphere"); // "NorthHemisphere" or "SouthHemisphere"
  searchCaught = getRadioValue("Caught"); // "CaughtYes", "CaughtNo", or "CaughtBoth"
  
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
      id = nameToID(name);
      price = critter[1];
      location = critter[2];
      hours = critter[3];
      if (searchHemisphere == "NorthHemisphere") { months = critter[4]; } // northern hemisphere
      else { months = critter[5]; } // southern hemisphere
      // decide if we're going to skip it based on availability
      months = months.split(",");
      if (searchAvailability == "CurrentAvailable") { // only show those currently available based on month
        if (months.indexOf(monthIRLstring) == -1) { continue; } // not available this month
      }
      // decide if we're going to skip it based on caught/uncaught
      caught = checkCaught(id);
      if ((caught == true)&&(searchCaught == "CaughtNo")) { continue; } // skip because it's caught, and user chose uncaught only
      if ((caught == false)&&(searchCaught == "CaughtYes")) { continue; } // skip because it's uncaught, and user chose caught only
      // okay, we aren't skipping it
      row = SearchOutputTable.insertRow();  // append new row at the bottom
      row.setAttribute("id",id);
      if (caught == true) { addClass(row,"RowDisplayCaught"); } // caught (displays normal)
      else { addClass(row,"RowDisplayUncaught"); } // uncaught (displays grey)
      if (months.indexOf(lastMonthIRLstring) == -1) { addClass(row,"RowDisplayNew"); }  // new arrival this month
      if (months.indexOf(nextMonthIRLstring) == -1) { addClass(row,"RowDisplayLeaving"); }  // won't be around next month
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
      cell.setAttribute("class","TableFieldCellPrice");
      cell.innerHTML = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      // LOCATION
      cell = row.insertCell();
      cell.setAttribute("class","TableFieldCell");
      cell.innerHTML = location;
      // HOURS
      cell = row.insertCell();
      cell.setAttribute("class","TableFieldCellHours");
      hours = hours.split(",");
      if (hours.length == 24) { // whole day
        cell.innerHTML = "All day";
      } else {
        // similar to months, there can be multiple (disconnected) hour ranges
        // but we know they're always in order, so that helps
        cellText = "";
        hourStart = hourLast = parseInt(hours[0]);
        for (var h=1; h<hours.length; h++) {
          hourCurrent = parseInt(hours[h]);
          if (h == (hours.length-1)) { //this is the last hour in the whole set
            if ((hourCurrent == (hourLast+1)) || ((hourLast-hourCurrent) == 23)) {  // this ends an ongoing range
              cellText += intToHour(hourStart) + "-" + intToHour(hourCurrent) + ", ";
            } else {  // it's a standalone hour, which also means the previous range ended too
              cellText += intToHour(hourStart) + "-" + intToHour(hourLast) + ", ";  // previous range
              cellText += intToHour(hourCurrent) + ", ";  // standalone
            }
          } else {  // there are still more entries ahead of this one
            if ((hourCurrent == (hourLast+1)) || ((hourLast-hourCurrent) == 23)) {  // still part of the same range
              hourLast = hourCurrent; // reset hourLast
              continue;
            }
            else {
              // we hit the end of this range, time to log it
              if (hourStart == hourLast) {  // it was just 1 hour
                cellText += intToHour(hourStart) + ", ";
              } else {  // it was a range of hours
                cellText += intToHour(hourStart) + "-" + intToHour(hourLast) + ", ";
              }
              // set the stage for the next range
              hourStart = hourLast = hourCurrent;
            }
          } // end ELSE
        } // end FOR
        if (cellText == "") { // there was only 1 hour
          cellText = intToHour(hourStart) + ", ";
        }
        cellText = cellText.substr(0,cellText.length-2);  // remove trailing ", "
        cell.innerHTML = cellText;
      } // end ELSE for hours
      // MONTHS
      cell = row.insertCell();
      cell.setAttribute("class","TableFieldCell");
      if (months.length == 12) {  // all year
        cell.innerHTML = "All year";
      } else {
        // similar to hours, there can be multiple (disconnected) date ranges
        // but we know they're always in order, so that helps
        cellText = "";
        monthStart = monthLast = parseInt(months[0]);
        for (var m=1; m<months.length; m++) {
          monthCurrent = parseInt(months[m]);
          if (m == (months.length-1)) { //this is the last month in the whole set
            if ((monthCurrent == (monthLast+1)) || ((monthLast-monthCurrent) == 11)) {  // this ends an ongoing range
              cellText += intToMonth(monthStart) + "-" + intToMonth(monthCurrent) + ", ";
            } else {  // it's a standalone month, which also means the previous range ended too
              cellText += intToMonth(monthStart) + "-" + intToMonth(monthLast) + ", ";  // previous range
              cellText += intToMonth(monthCurrent) + ", ";  // standalone
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

function intToHour(int) {
  var hour = "";
  var hourSuffix = "";
  if (int<12) { hourSuffix = "am"; }
  else { hourSuffix = "pm"; }
  int = (((int + 11) % 12) + 1);
  hour = int + hourSuffix;
  return hour;
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

function addClass(element,className) {
  var currentClasses = element.getAttribute("class");
  var newClasses = "";
  if ((currentClasses == null)||(currentClasses == "")) {
    newClasses = className;
  } else {
    newClasses = currentClasses + ' ' + className;
  }
  element.setAttribute("class",newClasses);
  return;
}
