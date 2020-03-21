// Store our API endpoint as queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // console.log(data.features);
  // Using the features array sent back in the API data, create a GeoJSON layer and add it to the map
  // console.log(data.features[0].properties.mag)
  // features = data.features
  // console.log(features.length)
  // for(var i =0;i < features.length; i++){
  // }
  createFeatures(data.features)
  
});




function createFeatures(earthquakeData) {

  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
    "</h3><hr><p>" + new Date(feature.properties.time) + "</p>")
  }

  function markerChange(feature, latlng){
      let options = {
        radius:feature.properties.mag*4,
        fillColor: colorChange(feature.properties.mag), // NEED TO BUILD Function to change colors
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.6
    }
    return L.circleMarker( latlng, options );
}

  var earthquakes = L.geoJSON(earthquakeData,{
    onEachFeature: onEachFeature
  , pointToLayer: markerChange
});

  createMap(earthquakes)

}

function colorChange(num){
    var color="";
      if(num >= 5){
        color = "red";
      }
      else if (num >= 4){
        color = "brown";
      }
      else if (num >= 3){
        color = "orange";
      }
      else if (num >= 2){
        color = "yellow"
      }
      else if (num >= 1){
        color = "green";
      }
      else {
        color = "blue";
      }
      // console.log(color)
      return color;
  }

function createMap(earthquakes){

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Light Map": lightmap,
    "Dark Map": darkmap,
    "Street Map": streetmap
  };

  var overLayMaps = {
    Earthquakes: earthquakes
  };

  // Create a new map
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [lightmap, earthquakes]
  });

  // Create a layer control containing our baseMaps
  // Be sure to add an overlay Layer containing the earthquake GeoJSON
  L.control.layers(baseMaps, overLayMaps, {
    collapsed: false
  }).addTo(myMap);
  legend.addTo(myMap);
  
}

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        scales = [0, 1, 2, 3, 4, 5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < scales.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colorChange(scales[i]) + '"></i> ' +
            scales[i] + (scales[i + 1] ? '&ndash;' + scales[i + 1] + '<br>' : '+');
            console.log(colorChange(scales[i]));
    }

    return div;
};