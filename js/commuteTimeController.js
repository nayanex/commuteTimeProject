var app = angular.module('poc', []);

app.controller('commuteTimeController', ['$scope', 'googleMaps', 'commuteTimeService', function ($scope, googleMaps, commuteTimeService) {

  $scope.center = { lat : -23.5572597, lng : -46.6566373 };
  
  googleMaps.initMap($scope.center, function(){
  });

  $scope.drawPolygon = function(){
    googleMaps.removePolygon();
    googleMaps.drawPolygon([
      {lat : -23.4713566, lng : -46.7369678},
      {lat : -23.5268901, lng : -46.4849318},
      {lat : -23.6587396, lng : -46.4900128},
      {lat : -23.6534791, lng : -46.6460996}
    ]);
  };
  
  $scope.teste = function(){
    commuteTimeService.teste("Antônio Carlos, São Paulo, SP").then(function(result){
      alert(JSON.stringify(result));
    });
  };
}]);