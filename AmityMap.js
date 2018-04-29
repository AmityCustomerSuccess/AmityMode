// Built with Google Maps Javascript API
  // https://developers.google.com/maps/documentation/javascript/
var version = "0.18";

var alamode = {

  reportError: function(msg) {
    $("<h1 class='mode-error'>").text(msg).prependTo(document.body);
  },

  getColumnsFromQuery: function(queryName) {
    var columns = datasets.filter(function(d) { if (d) { return d.queryName == queryName;}; })[0];
    if (!columns) {
      alamode.reportError("No such query: '" + queryName + "'");
      return [];
    }
    return columns.columns
  },

  getDataFromQuery: function(queryName) {
    var data = datasets.filter(function(d) { if (d) { return d.queryName == queryName;}; })[0];
    if (!data) {
      alamode.reportError("No such query: '" + queryName + "'");
      return [];
    }
    return data.content;
  },

  makeId: function(chars) {
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
        text = "";

    for (var i=0; i < chars; i++ ) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  },

  addContainerElement: function(el, clear) {

    clear = clear || false;

    id = alamode.makeId(10);

    if (el == "body") {
      $("<div id='" + id + "'></div>").addClass(id).addClass("mode-graphic-container").appendTo(".mode-content");
    } else if ($(el).length === 0) {
      alamode.reportError("No such element: '" + el + "'");
    } else {

      if (clear) {
        $(el).empty();
      }

      $(el).addClass("mode-graphic-container");
      $(el).addClass(id);
    }

    return "." + id;
  },
  googleMap: function(o) {
    var id = alamode.makeId(10);

    var iconBase = 'https://storage.googleapis.com/amity_images/map_icons/';

    var icons = {
          darkgreen: {
            icon: iconBase + 'darkgreen.svg'
          },
          green: {
            icon: iconBase + 'green.svg'
          },
          yellow: {
            icon: iconBase + 'yellow.svg'
          },
          red: {
            icon: iconBase + 'red.svg'
          },
          darkred: {
            icon: iconBase + 'darkred.svg'
          }
        };

    var defaultIcon = iconBase + 'neutral.svg';

    var latColumn = o["lat_column"],
        lngColumn = o["lng_column"],
        queryName = o["query_name"],
        apiKey = o["google_maps_api_key"],
        // Optional
        title = o["title"] || queryName,
        labelColumn = o["label_column"],
        iconColumn = o["icon_column"],
        htmlElement= o["html_element"] || "body",
        centerLat = o["center_lat"] || 39.5,
        centerLng = o["center_lng"] || -98.35,
        zoom = o["starting_zoom"] || 4,
        mapType = o["map_type"] || "terrain",
        mapHeight = o["height"] || 600;

    var data = alamode.getDataFromQuery(queryName);

    var uniqContainerClass = alamode.addContainerElement(htmlElement);

    d3.select(uniqContainerClass)
      .append("div")
      .attr("class","mode-graphic-title")
      .text(title)

    d3.select(uniqContainerClass)
      .append("div")
      .attr("class","mode-google-map")
      .attr("id",id)
      .style("height",mapHeight + "px")

    jQuery.getScript("https://maps.googleapis.com/maps/api/js?key=" + apiKey, function() {

      initMap()

      function initMap() {

        var myOptions = {
          zoom: zoom,
          center: new google.maps.LatLng(centerLat, centerLng),
          mapTypeId: mapType
        };

        var map = new google.maps.Map(document.getElementById(id), myOptions );

        data.forEach(function(d) {

          var lat = d[latColumn],
              lng = d[lngColumn];

          if (labelColumn) {
            label = d[labelColumn];
          } else {
            label = "";
          }

          var icon = defaultIcon;
          if (iconColumn) {
             icon = icons[d[iconColumn]];
          }

          var marker = new google.maps.Marker({
            position: {lat:lat, lng:lng},
            map: map,
            title: label,
            icon: icon
          })

          var infowindow = new google.maps.InfoWindow({
            content: label
          });

          marker.addListener('click', function() {
            infowindow.open(map, marker);
          });

        });

      }
    })
  }
}
