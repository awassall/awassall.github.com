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
    var results = [];
    var dir = "";
    var jqxhr = $.getJSON(url).done(function(data) {
        console.log(data);
        $.each(data, function(k1,v1) {
            if (k1 == "direction") {
                for (i = 0; i < (v1.length); i++) {
                    console.log(v1[i]);
                    $.each(v1[i], function(k2,v2) {
                        if (k2 == "direction_name") {
                            dir = v2;
                            console.log(dir);
                        }
                    });
                }
                /*
                $.each(v1, function(k2,v2) {
                    console.log(k2);
                    console.log(v2);
                    if (k2 == "direction_name") {
                        if (v2 == "Northbound") {
                        } else if (v2 == "Southbound") {
                        }
                        //console.log(v2);
                    }
                });
                */
            }
        });
    }).fail(function() {
        alert("ERROR: $.getJSON() failed for fetchStopListByRouteId().");
    }).always(function() {
        console.log("always");
    });
    console.log("here");
}

function populateStopData(element_id) {
    var route_id = element_id.split("_")[1];
    fetchStopListByRouteId(route_id);
}