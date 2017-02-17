angular.module('poc').factory('polisService', ['$http', function ($http) {

  var service = {

    getShapeArray: function(shape_string){
      var shape = shape_string.replace("POLYGON((","");
      shape = shape.replace("))","");
      var shape_points = shape.split(",");
      var shape_array = new Array();
      for(i = 0; i < shape_points.length; i++){
        long_lat = shape_points[i].split(" ");
        shape_array.push({lat : parseFloat(long_lat[1]), lng: parseFloat(long_lat[0])});
      }
      return shape_array;
    },

    //Receives a time value in seconds and returns a string like 6hs. 40min.
    formatTime: function(commuteTime){
      var a = commuteTime;
      var e = false;
      var c = true;
      var d = 60;
      var s = ["sec","min","hrs"];
      return [a,(0|a/d)*d,(0|a/d/d)*d*d].map(function(a,b,f){
            p=(a-(0|f[b+1]))/Math.pow(d,b);
            return e&&1>b?"":c&&!p?"":p+s[b]+". "
          }).reverse().join("");
    },

    getCommuteTime : function(param){ 
      return $http.post("http://54.94.161.18/api/commuteTime", param); 
    },

    getMobilityMap : function(param){ 
      return $http.post("http://54.94.161.18/api/mobilityMap", param); 
    }

  };
 
  return service;

}]);


//========================================================================
angular.module('poc').factory('googleMaps', [function () {
  var service = {};

  var map;

  var markerArr = [];

  service.initMap = function (latLng, cb) {

    window.initialize = function () {
      
      // https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-directions     

      var mapCanvas = document.getElementById('map');
      var origin_place_id = null;
      var destination_place_id = null;
      
      var travel_mode = google.maps.TravelMode.WALKING;

      var mapOptions = {
        center: new google.maps.LatLng(latLng.lat, latLng.lng),
        zoom: 12,
        scrollwheel: true,
        mapTypeControl: true,
        mapTypeControlOptions: {
          position: google.maps.ControlPosition.TOP_LEFT,
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
          mapTypeIds: [
            google.maps.MapTypeId.ROADMAP,
            google.maps.MapTypeId.TERRAIN,
            google.maps.MapTypeId.SATELLITE,
            google.maps.MapTypeId.HYBRID
          ]
        },
        disableDefaultUI: true,
        disableDoubleClickZoom: true,
        streetViewControl: false,
        zoomControl: false,
        scaleControl: true,
        rotateControl: true,
        styles: [
          {
            featureType: "poi",
            stylers: [
              { visibility: "off" }
            ]
          }
        ]
      };

      map = new google.maps.Map(mapCanvas, mapOptions);

      var directionsService = new google.maps.DirectionsService;
      var directionsDisplay = new google.maps.DirectionsRenderer;
      directionsDisplay.setMap(map);

      var origin_input = document.getElementById('origin-input');
      var origin_lat = document.getElementById('origin_lat');
      var origin_lng = document.getElementById('origin_lng');
      var destination_input = document.getElementById('destination-input');
      var destination_lat = document.getElementById('destination_lat');
      var destination_lng = document.getElementById('destination_lng');

      var origin = document.getElementById('origin');
      var destination = document.getElementById('destination');

      var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
      origin_autocomplete.bindTo('bounds', map);
      var destination_autocomplete = new google.maps.places.Autocomplete(destination_input);
      destination_autocomplete.bindTo('bounds', map);

      function expandViewportToFitPlace(map, place) {
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(17);
        }
      }

      origin_autocomplete.addListener('place_changed', function() {
        var place = origin_autocomplete.getPlace();
        origin_input.setAttribute('type','hidden');
        origin.innerHTML = place.name;
        origin_lng.value = place.geometry.location.lng();
        origin_lat.value = place.geometry.location.lat();
        //complete address: place.formatted_address
        //alert(place.geometry.location.lat());
        //alert(place.geometry.location.lng());
        if (!place.geometry) {
          window.alert("Autocomplete's returned place contains no geometry");
          return;
        }
        expandViewportToFitPlace(map, place);

        // If the place has a geometry, store its place ID and route if we have
        // the other place ID
        origin_place_id = place.place_id;
        route(origin_place_id, destination_place_id, travel_mode,
              directionsService, directionsDisplay);
      });

      destination_autocomplete.addListener('place_changed', function() {
        var place = destination_autocomplete.getPlace();
        destination_input.setAttribute('type','hidden');
        destination.innerHTML = place.name;
        destination_lng.value = place.geometry.location.lng();
        destination_lat.value = place.geometry.location.lat();
        if (!place.geometry) {
          window.alert("Autocomplete's returned place contains no geometry");
          return;
        }
        expandViewportToFitPlace(map, place);

        // If the place has a geometry, store its place ID and route if we have
        // the other place ID
        destination_place_id = place.place_id;
        route(origin_place_id, destination_place_id, travel_mode,
              directionsService, directionsDisplay);
      });

      function route(origin_place_id, destination_place_id, travel_mode,
                 directionsService, directionsDisplay) {
        if (!origin_place_id || !destination_place_id) {
          return;
        }
        //document.getElementById('calc_button').disable = true;
        directionsService.route({
          origin: {'placeId': origin_place_id},
          destination: {'placeId': destination_place_id},
          travelMode: travel_mode
        }, function(response, status) {
          if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      }


      if (cb)
        cb();

    };

    var sc = document.createElement('script');
    sc.setAttribute('src', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDdip6kfFkEn1NaceErUjSGb2vZ_SOzNpw&callback=initialize&libraries=visualization,places&language=pt');
    document.head.appendChild(sc);

  };


  service.buildMarkers = function (markers, onclick) {

    markerArr.forEach(function (m) {
      m.setMap(null);
    });

    markerArr = [];

    markers.forEach(function (m) {

      var marker = new google.maps.Marker({
        position: { lat: m.lat, lng: m.lng },
        map: map
      });

      markerArr.push(marker);

      marker.addListener('click', function () {
        onclick(m);
      });

    });

  };


  service.setCenter = function (latLng) {
    if (map)
      map.setCenter(latLng);
  };


  service.zoomTo = function (num) {
    map.setZoom(num);
    return map.getZoom();
  };


  var polygon = [];

  service.removePolygon = function () {
    polygon.forEach(function (r) {
      r.setMap(null);
    });

    polygon = [];
  };

  service.drawPolygon = function (paths) {
    var color = "rgba(204, 113, 46, 1.0)";
    polygon.push(new google.maps.Polygon({
      strokeColor: color,
      strokeOpacity: 0.6,
      strokeWeight: 1,
      fillColor: color,
      fillOpacity: 0.35,
      map: map,
      paths: paths
    }));
  };  

  return service;

}]);


//========================================================================
