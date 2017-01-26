//GLOBAL VARIABLES
var apiKey = "wX9NwuHnZU2ToO7GmGR9uw";
var loadInterval;

function failWithError(error_text) {
    document.getElementById("loadStatus").innerHTML = error_text;
}

function fetchStopData(stop_logical_name) {
    //console.log("fetchStopData: " + stop_logical_name);
    var url = "http://realtime.mbta.com/developer/api/v2/predictionsbystop?api_key=" + apiKey + "&stop=" + stop_logical_name + "&format=json";
    var jqxhr = $.getJSON(url).done(function(data) {
        //alert(data);
        var i = 0;
        var breakLoop = 0;
        var foundSubway = 0;
        $.each(data, function(k1,v1) {
            if (k1 == "mode") {
                for (i = 0; i < (v1.length); i++) {
                    console.log(i);
                    $.each(v1[i], function(k2,v2) {
                        if ((k2 == "mode_name") && (v2 == "Subway")) {
                            foundSubway = 1;
                            breakLoop = 1;
                            return true; //continue
                        }
                        if ((k2 == "route") && (foundSubway == 1)) {
                            console.log(v2);
                            return false;
                        }
                        //console.log(k2);
                        //console.log(v2);
                    });
                    if (breakLoop == 1) {
                        break;
                    }
                }
            }
        });
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