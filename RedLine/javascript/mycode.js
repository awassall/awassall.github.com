//GLOBAL VARIABLES
var apiKey = "wX9NwuHnZU2ToO7GmGR9uw";
var loadInterval;
var refreshTimer;

function failWithError(error_text) {
    document.getElementById("loadStatus").innerHTML = error_text;
}

function drawStopTimesToPage(stop_array,stop_logical_name) {
    var i = 0;
    var dircount = 0;
    var dir = 0;
    var olddir = -1;
    var temparray = new Array();
    var mins = 0;
    var secs = 0;
    var time = "";
    var stops = "";
    var div = document.getElementById("stopDataDiv");
    //clear div contents
    div.innerHTML = "";
    var dirTab = "";
    var dirTabHead = "";
    var dirTabRow = "";
    var dirTabNameCell = "";
    var dirTabTimeCell = "";
    for (i = 0; i < (stop_array.length); i++) { //only show max of 3 in each direction
        temparray = stop_array[i];
        dir = stop_array[i][0];
        if (dir != olddir) {
            olddir = dir;
            dircount = 0; //reset counter
            if (i != 0) {
                //if this isn't the first datapoint, then we need to post the existing table to the page
                div.appendChild(dirTabHead);
                div.appendChild(dirTab);
            }
            dirTab = document.createElement("table");
            dirTab.setAttribute("class","dataTableRoot");
            dirTabHead = document.createElement("div");
            dirTabHead.setAttribute("class","dataTableHeader");
            if (dir == 0) {
                dirTabHead.innerHTML = "Southbound";
            } else if (dir == 1) {
                dirTabHead.innerHTML = "Northbound";
            } else {
                dirTabHead.innerHTML = "Direction " + dir;
            }
        }
        if (dircount < 3) {
            dircount = dircount + 1;
        } else {
            continue;
        }
        mins = Math.floor((stop_array[i][1])/60);
        secs = (stop_array[i][1])%60;
        if ((mins == 0) && (secs == 0)) { //arriving now
            time = "Arriving";
        } else { //there is some nonzero amount of time remaining until arrival
            if (mins == 0) { //time remaining is only seconds
                time = secs + ' sec';
            } else if (secs == 0) { //time remaining is only minutes
                time = mins + ' min';
            } else { //time remaining is in both minutes and seconds
                time = mins + ' min' + ' ' + secs + ' sec';
            }
        }
        dirTabRow = dirTab.insertRow(-1);
        dirTabRow.setAttribute("class","dataTableRow");
        dirTabNameCell = dirTabRow.insertCell(0);
        dirTabNameCell.setAttribute("class","dataTableNameCell");
        dirTabTimeCell = dirTabRow.insertCell(1);
        dirTabTimeCell.setAttribute("class","dataTableTimeCell");
        dirTabNameCell.innerHTML = stop_array[i][2];
        dirTabTimeCell.innerHTML = time;
    }
    //append the last direction
    div.appendChild(dirTabHead);
    div.appendChild(dirTab);
    //console.log(stop_array);
    //kick off the refresh timer
    console.log("here");
    refreshTimer = setTimeout(fetchStopData(stop_logical_name),15000);
}

function fetchStopData(stop_logical_name) {
    var url = "http://realtime.mbta.com/developer/api/v2/predictionsbystop?api_key=" + apiKey + "&stop=" + stop_logical_name + "&format=json";
    var jqxhr = $.getJSON(url).done(function(data) {
        var i = 0;
        var j = 0;
        var k = 0;
        var l = 0;
        var breakModeLoop = 0;
        var breakRouteLoop = 0;
        var foundSubway = 0;
        var foundRedLine = 0;
        var tripHeadsign = "";
        var preAway = 0;
        var results = new Array();
        var tripArray = new Array();
        $.each(data, function(k1,v1) {
            if (k1 == "mode") {
                for (i = 0; i < (v1.length); i++) {
                    $.each(v1[i], function(k2,v2) {
                        if (k2 == "mode_name") {
                            if (v2 == "Subway") {
                                foundSubway = 1;
                                return true;
                            } else {
                                return false;
                            }
                        }
                        if ((k2 == "route") && (foundSubway == 1)) {
                            foundSubway = 0; //reset to 0
                            // we found a subway, but is it the red line?
                            // if it is not, then we will have to keep searching
                            for (j = 0; j < (v2.length); j++) {
                                $.each(v2[j], function(k3,v3) {
                                    if (k3 == "route_id") {
                                        if (v3 == "Red") {
                                            breakRouteLoop = 1;
                                            breakModeLoop = 1;
                                            foundRedLine = 1;
                                        } else {
                                            return false;
                                        }
                                    }
                                    if ((k3 == "direction") && (foundRedLine == 1)) {
                                        for (k = 0; k < 2; k++) {
                                            $.each(v3[k], function(k4,v4) {
                                                if (k4 == "trip") {
                                                    for (l = 0; l < (v4.length); l++) {
                                                        tripHeadsign = "";
                                                        preAway = 0;
                                                        tripArray = new Array();
                                                        $.each(v4[l], function(k5,v5) {
                                                            if (k5 == "trip_headsign") {
                                                                tripHeadsign = v5;
                                                            }
                                                            if (k5 == "pre_away") {
                                                                preAway = parseInt(v5);
                                                            }
                                                        });
                                                        tripArray.push(k);
                                                        tripArray.push(preAway);
                                                        tripArray.push(tripHeadsign);
                                                        results.push(tripArray);
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                                if (breakRouteLoop == 1) {
                                    break;
                                }
                            }
                            return false; // no need to do further searching, already have the data
                        }
                    });
                    if (breakModeLoop == 1) {
                        break;
                    }
                }
            }
        });
        //sort the results
        var sortedResults = new Array();
        //loop over existing results
        for (i = 0; i < (results.length); i++) {
            if (sortedResults.length == 0) {
                sortedResults.push(results[i]);
                continue;
            }
            //loop over new results array to see where to put it
            //sortedResults.length is greater than 0
            for (j = 0; j < (sortedResults.length); j++) {
                if ((results[i][0] <= sortedResults[j][0]) && (results[i][1] <= sortedResults[j][1])) {
                    //insert here
                    sortedResults.splice(j,0,results[i]);
                    break;
                }
                if ((j+1) == (sortedResults.length)) {
                    sortedResults.push(results[i]);
                    break;
                }
            }
        }
        drawStopTimesToPage(sortedResults,stop_logical_name);
    }).fail(function() {
        alert("ERROR: $.getJSON() failed for fetchStopData().");
    });
}

// THIS IS THE SELECT LIST IMPLEMENTATION
function drawDataToPage(res) {
    var i = 0;
    var select = document.getElementById("stopSelect");
    var option = "";
    var temp_stop_array = new Array();
    var lastindex = 1;
    for (i = 0; i < (res.length); i++) {
        var stop_name = (res[i]).split("*")[0]; //this is the display name of the stop
        if (stop_name.length <= 0) { //name should not be NULL
            continue; //should never get here in practice...
        }
        if ($.inArray(stop_name,temp_stop_array) >= 0) { //skip duplicates
            continue;
        } else { //add to temp array for checking against on subsequent iterations
            temp_stop_array.push(stop_name);
            lastindex += 1;
        }
        option = document.createElement("option");
        var parent_station = (res[i]).split("*")[1]; //this is the logical name of the stop
        if (parent_station.length <= 0) { //parent station should not be NULL
            option.setAttribute("id","NULL");
            option.disabled = 1;
        } else {
            option.setAttribute("id",parent_station);
        }
        option.text = stop_name;
        select.add(option);
    }
    select.onchange = function() {
        if (this.selectedOptions[0].id == "NULL") {
            alert("Cannot obtain information for the selected station at this time.");
        } else {
            //clear div contents immediately to avoid momentary confusion
            document.getElementById("stopDataDiv").innerHTML = "";
            //fetch new data
            fetchStopData(this.selectedOptions[0].id);
        }
    };
    document.getElementById("loadStatus").innerHTML = "1";
}

function fetchStopListByRouteId(route_id) {
    var url = "http://realtime.mbta.com/developer/api/v2/stopsbyroute?api_key=" + apiKey + "&route=" + route_id + "&format=json";
    var jqxhr = $.getJSON(url).done(function(data) {
        var i = 0;
        var j = 0;
        var results = new Array();
        var parent_station_name = "";
        var parent_station = "";
        $.each(data, function(k1,v1) {
            if (k1 == "direction") {
                for (i = 0; i < 1; i++) { //i<1 because we only need one direction
                    $.each(v1[i], function(k2,v2) {
                        if (k2 == "stop") {
                            for (j = 0; j < (v2.length); j++) {
                                parent_station_name = "";
                                parent_station = "";
                                $.each(v2[j], function(k3,v3) {
                                    if (k3 == "parent_station_name") {
                                        parent_station_name = v3;
                                    }
                                    if (k3 == "parent_station") {
                                        parent_station = v3;
                                    }
                                });
                                results.push(parent_station_name + "*" + parent_station);
                            }
                        }
                    });
                }
            }
        });
        drawDataToPage(results);
    }).fail(function() {
        failWithError("$.getJSON() failed for fetchStopListByRouteId().");
    });
}

function drawPage() {
    var loaded = document.getElementById("loadStatus").innerHTML;
    if (loaded == "") { //not loaded yet
        var loadp = document.getElementById("loadp");
        if ((loadp.innerHTML).indexOf("...") > -1) {
            loadp.innerHTML = "Loading";
        } else {
            loadp.innerHTML += ".";
        }
    } else { //either loaded or errored
        clearInterval(loadInterval);
        if (loaded.length > 1 ) { //error
            var loadp = document.getElementById("loadp");
            loadp.innerHTML = "Failed to load data.";
            alert("ERROR: " + loaded);
        } else { //loaded
            var dc = document.getElementById("datacontainer");
            var lw = document.getElementById("loadwrapper");
            lw.setAttribute("class","hideMe");
            dc.setAttribute("class","showMe");
        } 
    }
}

function loadData() {
    loadInterval = setInterval(drawPage, 500);
    fetchStopListByRouteId("Red");
}