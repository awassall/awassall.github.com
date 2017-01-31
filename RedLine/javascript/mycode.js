//GLOBAL VARIABLES
var apiKey = "wX9NwuHnZU2ToO7GmGR9uw";
var loadInterval;

function failWithError(error_text) {
    document.getElementById("loadStatus").innerHTML = error_text;
}

function drawStopTimesToPage(element_id, stop_array) {
    var i = 0;
    var dircount = 0;
    var dir = 0;
    var olddir = 0;
    var temparray = new Array();
    var ele = document.getElementById(element_id);
    var span = '<span>' + ele.innerHTML + '</span>';
    var stops = "";
    for (i = 0; i < (stop_array.length); i++) { //only show max of 3 in each direction
        temparray = stop_array[i];
        dir = stop_array[i][0];
        if (i == 0) {
            olddir = dir; //initialize olddir to the first direction we come across
        } else {
            if (dir != olddir) {
                dircount = 0; //reset counter
            }
        }
        if (dircount < 3) {
            dircount = dircount + 1;
        } else {
            continue;
        }
        stops = stops + '<br/>' + stop_array[i][1] + ' ' + stop_array[i][2];
    }
    ele.innerHTML = span + stops;
    console.log(stop_array);
}

function fetchStopData(stop_logical_name) {
    //console.log("fetchStopData: " + stop_logical_name);
    var url = "http://realtime.mbta.com/developer/api/v2/predictionsbystop?api_key=" + apiKey + "&stop=" + stop_logical_name + "&format=json";
    var jqxhr = $.getJSON(url).done(function(data) {
        //alert(data);
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
                    //console.log("Mode loop: " + i);
                    $.each(v1[i], function(k2,v2) {
                        //console.log(k2);
                        //console.log(v2);
                        if (k2 == "mode_name") {
                            if (v2 == "Subway") {
                                foundSubway = 1;
                                //console.log("Found Subway");
                                return true;
                            } else {
                                // not a subway, skip to the next one
                                //console.log("Not a subway");
                                return false;
                            }
                        }
                        /*
                        if ((k2 == "mode_name") && (v2 == "Subway")) {
                            // this might be the red line, but it could be any subway line
                            // we still have to check if it is the red line
                            foundSubway = 1;
                            //breakModeLoop = 1;
                            return true; //continue
                        }
                        */
                        if ((k2 == "route") && (foundSubway == 1)) {
                            foundSubway = 0; //reset to 0
                            // we found a subway, but is it the red line?
                            // if it is not, then we will have to keep searching
                            //console.log(v2);
                            for (j = 0; j < (v2.length); j++) {
                                //console.log("Route #" + j);
                                //console.log(v2[j]);
                                $.each(v2[j], function(k3,v3) {
                                    if (k3 == "route_id") {
                                        if (v3 == "Red") {
                                            //console.log("found the red line");
                                            breakRouteLoop = 1;
                                            breakModeLoop = 1;
                                            foundRedLine = 1;
                                        } else {
                                            return false;
                                        }
                                    }
                                    if ((k3 == "direction") && (foundRedLine == 1)) {
                                        for (k = 0; k < 2; k++) {
                                            //console.log(k);
                                            $.each(v3[k], function(k4,v4) {
                                                if (k4 == "trip") {
                                                    for (l = 0; l < (v4.length); l++) {
                                                        //console.log(v4[l]);
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
                                    /*
                                    if ((k3 == "route_id") && (v3 == "Red")) {
                                        foundRoute = 1;
                                        breakRouteLoop = 1;
                                        return true; //continue
                                    }
                                    */
                                    /*
                                    if ((k3 == "direction") && (foundRoute == 1)) {
                                        console.log(v3);
                                        return false;
                                    }
                                    */
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
        //console.log(results);
        var sortedResults = new Array();
        //loop over existing results
        for (i = 0; i < (results.length); i++) {
            //console.log("i="+i);
            //console.log(results[i]);
            //console.log(sortedResults);
            /*
            k = i[0];
            preAway = i[1];
            tripHeadsign = i[2];
            */
            if (sortedResults.length == 0) {
                sortedResults.push(results[i]);
                continue;
            }
            //loop over new results array to see where to put it
            //sortedResults.length is greater than 0
            //console.log(sortedResults);
            for (j = 0; j < (sortedResults.length); j++) {
                //console.log("j="+j);
                //console.log(results[i][0]);
                //console.log(results[i][1]);
                //console.log(sortedResults[j][0]);
                //console.log(sortedResults[j][1]);
                if ((results[i][0] <= sortedResults[j][0]) && (results[i][1] <= sortedResults[j][1])) {
                    //insert here
                    //console.log("here1");
                    sortedResults.splice(j,0,results[i]);
                    break;
                }
                if ((j+1) == (sortedResults.length)) {
                    //console.log("here2");
                    sortedResults.push(results[i]);
                    break;
                }
            }
        }
        drawStopTimesToPage(stop_logical_name,sortedResults);
    }).fail(function() {
        alert("ERROR: $.getJSON() failed for fetchStopData().");
    });
}

/*
function drawDataToPage(res) {
    var i = 0;
    var dt = document.getElementById("datatable");
    var dth = dt.createTHead();
    var dthr = dth.insertRow(0);
    var dthrc_s = dthr.insertCell(0);
    dthrc_s.innerHTML = "S";
    var dthrc_n = dthr.insertCell(0);
    dthrc_n.innerHTML = "N";
    var dthrc_name = dthr.insertCell(0);
    dthrc_name.innerHTML = "NAME";
    var temp_stop_array = new Array();
    var lastindex = 1;
    for (i = 0; i < (res.length); i++) {
        var stop_name = (res[i]).split("*")[0];
        if ($.inArray(stop_name,temp_stop_array) >= 0) { //skip duplicates
            continue;
        } else { //add to temp array for checking against on subsequent iterations
            temp_stop_array.push(stop_name);
            lastindex += 1;
        }
        var row = dt.insertRow(-1);
        row.setAttribute("class","row" + (lastindex%2));
        var cell_stop_data_s = row.insertCell(0);
        cell_stop_data_s.setAttribute("class","cell2");
        cell_stop_data_s.setAttribute("id",stop_name + "_S");
        cell_stop_data_s.innerHTML = "Loading...";
        var cell_stop_data_n = row.insertCell(0);
        cell_stop_data_n.setAttribute("class","cell1");
        cell_stop_data_n.setAttribute("id",stop_name + "_N");
        cell_stop_data_n.innerHTML = "Loading...";
        var cell_stop_name = row.insertCell(0);
        cell_stop_name.setAttribute("class","cell0");
        cell_stop_name.innerHTML = stop_name;
        //fetchStopData((res[i]).split("*")[1]);
    }
    document.getElementById("loadStatus").innerHTML = "1";
}
*/

function drawDataToPage(res) {
    var i = 0;
    var dt = document.getElementById("datatable");
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
        var row = dt.insertRow(-1);
        row.setAttribute("class","row" + (lastindex%2));
        var cell_stop_name = row.insertCell(0);
        cell_stop_name.setAttribute("class","cell0");
        var parent_station = (res[i]).split("*")[1]; //this is the logical name of the stop
        if (parent_station.length <= 0) { //parent station should not be NULL
            cell_stop_name.setAttribute("id","noParentStation");
            cell_stop_name.onclick = function() { alert("ERROR: Null parent station."); };
        } else {
            cell_stop_name.setAttribute("id",parent_station);
            cell_stop_name.onclick = function() { fetchStopData(this.id); };
        }
        cell_stop_name.innerHTML = stop_name;
    }
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