var myMap = L.map("map", {
    center: [40.81362, -96.7073],
    zoom: 5,
 });

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

//Link to get GeoJSON data
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//Getting GeoJSON data
d3.json(link).then(function (data) {
    console.log(data);
    //Create 
    createFeatures(data.features);
});

function markerSize(magnitude) {
    return magnitude *5;
};

function markerColor(magnitude) {
    if (magnitude <= 1) {
        return "#daec92"
    } else if (magnitude <= 2) {
        return "#ecea92"
    } else if (magnitude <= 3) {
        return "#ecd592"
    } else if (magnitude <= 4) {
        return "#dfb778"
    } else if (magnitude <= 5) {
        return "#e5a05b"
    } else {
        return "#f58668"
    }
 };

 function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "</h3><hr><p>" + "Magnitude: " + (feature.properties.mag) + "</p>");
}
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: markerColor(feature.properties.mag),
                color: "#000",
                weight: 0.3,
                opacity: 0.5,
                fillOpacity: 1
            });
    },
    onEachFeature: onEachFeature
  });


     createMap(earthquakes)
};

    function createMap(earthquakes) {

        var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        })

        var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        });

        //Create baseMaps object

        var baseMaps = {
            "Street Map": street,
            "Topographic Map": topo
        };

        var overlayMaps = {
            Earthquakes: earthquakes
        };

        //Create layer control
        L.control.layers(baseMaps, overlayMaps, {
            collapsed: false
        }).addTo(myMap)

        var legend = L.control({ position: "bottomright" });
        legend.onAdd = function(map) {
            var div = L.DomUtil.create("div", "info legend");
            magnitudes = [0, 1, 2, 3, 4, 5];
            labels = [];
            legendInfo = "<strong>Magnitude</strong>";
            div.innerHTML = legendInfo;
            // push to labels array as list item
            for (var i = 0; i < magnitudes.length; i++) {
                labels.push('<li style="background-color:' + markerColor(magnitudes[i] + 1) + '"> <span>' + magnitudes[i] + (magnitudes[i + 1]
                     ? '&ndash;' + magnitudes[i + 1] + '' : '+') + '</span></li>');
            }
            // add label items to the div under the <ul> tag
            div.innerHTML += "<ul>" + labels.join("") + "</ul>";
            return div;
        };
        // Add legend to the map
        legend.addTo(myMap);
    };
