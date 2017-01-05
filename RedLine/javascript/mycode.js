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
 
function getStopListByRouteId(route_id_from_id) {
    var route_id = route_id_from_id.split("_")[1];
    $.ajax({
        url: "http://realtime.mbta.com/developer/api/v2/routes?api_key=" + apiKey + "&format=json",
        dataType: "jsonp",
    }).done(function(data) {
        document.getElementById("output").innerHTML = data;
    }).fail(function() {
        alert("ERROR: Failed to look up the list of stops for the route with id " + route_id + ".");
    });
}

function populateStopData(stop_display_name) {
    document.getElementById("output").innerHTML = "test";
    //implement later
    //document.getElementById("output").innerHTML = fetchSubwayByStop(stop_display_name);
}