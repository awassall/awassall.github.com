//GLOBAL VARIABLES
var apiKey = "wX9NwuHnZU2ToO7GmGR9uw";
var myGlobalVariable;

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
        document.getElementById("hiddenOutput").innerHTML = results;
    }).fail(function() {
        alert("ERROR: $.getJSON() failed for fetchStopListByRouteId().");
    });
}

function populateStopData(element_id) {
    var i = 0;
    var displayName;
    var logicalName;
    var route_id = element_id.split("_")[1];
    var output = document.getElementById("output");
    fetchStopListByRouteId(route_id); //results in document.getElementById("hiddenOutput").innerHTML
    var stopList = document.getElementById("hiddenOutput").innerHTML.split(",");
    for (i = 0; i < (stopList.length); i++) {
        displayName = stopList[i].split("*")[0];
        logicalName = stopList[i].split("*")[1];
        output.innerHTML += displayName + " " + logicalName + "<br/>";
    }
}