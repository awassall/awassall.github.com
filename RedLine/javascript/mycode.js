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
    //var dir = "";
    var results = new Object();
    var parent_station_name = "";
    var parent_station = "";
    //var station = [];
    var jqxhr = $.getJSON(url).done(function(data) {
        //console.log(data);
        $.each(data, function(k1,v1) {
            if (k1 == "direction") {
                for (i = 0; i < (v1.length); i++) {
                    $.each(v1[i], function(k2,v2) {
                        /*
                        if (k2 == "direction_name") {
                            dir = v2;
                            results[dir] = new Object();
                            //resSize = results.push([v2,[]]);
                        }
                        */
                        if (k2 == "stop") {
                            for (j = 0; j < (v2.length); j++) {
                                //station = [];
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
                                //station.push([parent_station_name,parent_station]);
                                results[parent_station_name] = parent_station;
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
    console.log(results);
    console.log(Object.keys(results));
    var obj = {key1: "value1", key2: "value2"};
    console.log(obj);
    console.log(Object.keys(obj));
    return obj;
}

function populateStopData(element_id) {
    //var i = 0;
    //var displayName = 0;
    //var logicalName = 1;
    var route_id = element_id.split("_")[1];
    var stopList = fetchStopListByRouteId(route_id);
    console.log(stopList);
    console.log(Object.keys(stopList));
    //var page = document.getElementById("output");
    /*
    for (i = 0; i < (stopList.length); i++) {
        console.log("Display: " + stopList[i][displayName] + ", Logical: " + stopList[i][logicalName]);
    } 
    */
}