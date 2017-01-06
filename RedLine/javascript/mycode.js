//GLOBAL VARIABLES
var apiKey = "wX9NwuHnZU2ToO7GmGR9uw";

function stopDisplayToLogical(stop_display_name) {
    var stop_logical_name = "";
    if (stop_display_name == "Davis") {

    }
    return stop_logical_name;
}

function fetchSubwayByStop(stop_display_name) {
    var stop_logical_name = stopDisplayToLogical(stop_display_name);
    if (stop_logical_name == "") {
        return "ERROR: Could not identify a stop with name " + stop_display_name + ".";
    }
    $.ajax({
        url: "http://realtime.mbta.com/developer/api/v2/predictionsbystop?api_key=" + apiKey + "&stop=place-" + stop_logical_name + "&format=json",
        dataType: "jsonp",
        success: function (data) {
            alert(data);
        }
    });
    return "Success";
}
 
function fetchStopListByRouteId(route_id) {
    var url = "http://realtime.mbta.com/developer/api/v2/stopsbyroute?api_key=" + apiKey + "&route=" + route_id + "&format=json";
    var i = 0;
    var j = 0;
    var results = new Object();
    results.displayNames = new Array();
    results.logicalNames = new Array();
    var parent_station_name = "";
    var parent_station = "";
    var jqxhr = $.getJSON(url).done(function(data) {
        $.each(data, function(k1,v1) {
            if (k1 == "direction") {
                for (i = 0; i < (v1.length); i++) {
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
                                console.log(parent_station_name + " " + parent_station);
                                results.displayNames.push(parent_station_name);
                                results.logicalNames.push(parent_station);
                            }
                        }
                    });
                }
                return false; //break the loop, only need to get stops in one direction
            }
        });
    }).fail(function() {
        alert("ERROR: $.getJSON() failed for fetchStopListByRouteId().");
    });
    results.displayNames.push("testname");
    results.logicalNames.push("teststation");
    console.log(results);
    return results;
}

function populateStopData(element_id) {
    var route_id = element_id.split("_")[1];
    var stopList = fetchStopListByRouteId(route_id);
    var i = 0;
    console.log(stopList);
    for (i = 0; i < 100; i++) {
        console.log(stopList.displayNames[i]);
    }
}