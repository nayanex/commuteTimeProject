angular.module('poc').controller('pocController', ['$scope', 'googleMaps', 'polisService', function ($scope, googleMaps, polisService) {
  
  $scope.center = { lat : -23.5572597, lng : -46.6566373 };


  var select = document.getElementById("dep_time-select");
  for (var i = 0; i < 24; i++) {
    var el = document.createElement("option");
    el.textContent = i+":00";
    el.value = i;
    select.appendChild(el);
  }

  googleMaps.initMap($scope.center, function(){
  });

  $scope.reset = function(){
    document.getElementById('origin-input').setAttribute('type','text');
    document.getElementById('origin-input').value= '';
    document.getElementById('origin').innerHTML = '';
    document.getElementById('origin_lat').value = '';
    document.getElementById('origin_lng').value = '';
    document.getElementById('destination-input').setAttribute('type','text');
    document.getElementById('destination-input').value = '';
    document.getElementById('destination').innerHTML = '';
    document.getElementById('destination_lat').value = '';
    document.getElementById('destination_lng').value = '';
    select.selectedIndex = 0;
    document.getElementById('commuteTime_label').innerHTML = '';
    googleMaps.initMap($scope.center, function(){
    });
  };

  $scope.commuteTime = function(){

    document.getElementById("commuteTime_label").innerHTML = "";
    var longitudeP1 = parseFloat(document.getElementById('origin_lng').value);
    var latitudeP1 = parseFloat(document.getElementById('origin_lat').value);
    var longitudeP2 = parseFloat(document.getElementById('destination_lng').value);
    var latitudeP2 = parseFloat(document.getElementById('destination_lat').value);
    var dep_time = select.value;

    if(longitudeP1=="" || longitudeP2=="" || dep_time=="")
      alert("Por favor, preencha todos os campos!");
    else{
      var commuteTimeInfo = {
          "longitudeP1": longitudeP1,
          "latitudeP1": latitudeP1,
          "longitudeP2": longitudeP2, 
          "latitudeP2": latitudeP2,
          "departure_time": dep_time
      };

      polisService.getCommuteTime(commuteTimeInfo).then(function(result){
        //convert polygons info to the right format (array)
        var shape1_array = polisService.getShapeArray(result.data.shape_point1);
        var shape2_array = polisService.getShapeArray(result.data.shape_point2);
        //show polygons
        googleMaps.removePolygon();
        googleMaps.drawPolygon(shape1_array);
        googleMaps.drawPolygon(shape2_array);
        //get commute time info, convert it to the right format and show it
        var commuteTime = result.data.commuteTime;
        if(commuteTime){
          //convert time to right format
          formatted = polisService.formatTime(commuteTime);
          //show formatted time info
          document.getElementById("commuteTime_label").innerHTML = formatted;
        }
      });
    }
  };

  $scope.mobilityMap = function(){

    var longitude = -46.658702;
    var latitude = -23.555639;
    var dep_time = 7;

    var mpInfo = {
      "longitude": longitude,
      "latitude": latitude,
      "departure_time": dep_time
    };

    polisService.getMobilityMap(mpInfo).then(function(result){
      var shape = polisService.getShapeArray(result.data.shape);
      googleMaps.drawPolygon(shape);
    });
  };

}]);