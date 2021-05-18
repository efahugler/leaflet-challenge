// API endpoints for earthquake and tectonic data
var earthquakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";


d3.json(earthquakeData, function(data) {
    // Collects data.features and runs in createFeatures function
    createFeatures(data.features);
  });
  
  
  function createFeatures(earthquakeData) {
    var earthquakes = L.geoJSON(earthquakeData, { 
      onEachFeature: function(feature, layer) {
        layer.bindPopup("<h3>Location: " + feature.properties.place + "</h3><h3>Magnitude: " + feature.properties.mag + "</h3><h3>Date: " + new Date(feature.properties.time) + "</h3>");
      },
      
      // magnitute 
      pointToLayer: function (feature, latlng) {
        return new L.circle(latlng,
          {radius: getRadius(feature.properties.mag),
          fillColor: getColor(feature.properties.mag),
          fillOpacity: 1.5,
          color: '#666',
          stroke: true,
          weight: 1.0
      })}}
      );
    

    createMap(earthquakes);
  }
  
  
  function createMap(earthquakes) {
     
      var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        accessToken: API_KEY
      });
    
    // or access_token: config.access_token
      var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        accessToken: API_KEY
      });

      //or or access_token: config.access_token
    
      // baseMaps
      var baseMaps = {
        "Light": light,
        "Satellite": satellite,
      };
    
      // Overlay layer
    var overMaps = {
        "Earthquakes": earthquakes
      };
  
      // Creates map and default view + layers
      var myMap = L.map("map", {
        center: [30, 2],
        zoom: 1.5 ,
        layers: [light, earthquakes]
      }); 

    
    L.control.layers(baseMaps, overMaps, {
        collapsed: false
      }).addTo(myMap);

    legend.onAdd = function(_myMap){
        var div = L.Util.create('div', 'info legend'),
          values = [0, 1, 2, 3, 4, 5]
    var legend = L.control({position: 'bottomright'});

  //Loop through the values in the innerHTML resources complicated
    for (var i = 0; i < values.length; i++) {
      div.innerHTML +=
          '<i style="background:' + getColor(values[i] + 1) + '"></i> ' +
          values[i] + (values[i + 1] ? '&ndash;' + values[i + 1] + '<br>' : '+');
  }
      return div;
    };
    legend.addTo(myMap);
  }

  // Defines our magnitude colors 
  function getColor(d){
    return d > 5 ? '#0000ff':
    d  > 4 ? "#ffa500":
    d > 3 ? "#ffff00":
    d > 2 ? "#00ff00":
    d > 1 ?  '#ff0000' :
             "#ee82ee";
  }
//documentation colors


