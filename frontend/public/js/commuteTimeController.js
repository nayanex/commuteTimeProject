angular.module('poc').controller('commuteTimeController', ['$scope', 'googleMaps', 'commuteTimeService',
    function ($scope, googleMaps, commuteTimeService) {

    $scope.center = { lat : -23.5572597, lng : -46.6566373 };
    $scope.departureTime = "";
    $scope.lngP1 = -46.6566373;
    $scope.latP1 = -23.5572597;
    $scope.lngP2 = -46.6566373;
    $scope.latP2 = -23.5572597;

    $(function () {
        $('#datetimepicker1').datetimepicker({
            format: 'HH:00',
            keyBinds: {
                up: function (widget) {
                    if (widget.find('.datepicker').is(':visible')) {
                        this.date(this.date().clone().subtract(1, 'h'));
                    }
                    else {
                        this.date(this.date().clone().add(1, 'h'));
                    }
                },
                down: function (widget) {
                    if (!widget) {
                        this.show();
                    }
                    else if (widget.find('.datepicker').is(':visible')) {
                        this.date(this.date().clone().add(1, 'h'));
                    } 
                    else {
                        this.date(this.date().clone().subtract(1, 'h'));
                    }
                }
            }
        });
    });

    googleMaps.initMap($scope.center, function(){
        googleMaps.bindPlaceAutoComplete($scope);
    });

    $scope.cleanSearch = function() {

    };

    $scope.drawPolygon = function(){
        googleMaps.removePolygon();
        googleMaps.drawPolygon([
            {lat : -23.4713566, lng : -46.7369678},
            {lat : -23.5268901, lng : -46.4849318},
            {lat : -23.6587396, lng : -46.4900128},
            {lat : -23.6534791, lng : -46.6460996}
        ]);
    };

    $scope.compCommuteTime = function() {
        //var xhttp = new XMLHttpRequest();
        //xhttp.open("POST", "http://54.94.173.255:3000/api/commuteTime", false);
        //xhttp.setRequestHeader("Content-type", "application/json");
        //xhttp.send();
        //var response = JSON.parse(xhttp.responseText);
        commuteTimeService.compCommuteTime().success(function (response) {  
            $scope.value = response;  
            safeDigest($scope);
        })  
        .error(function (error) {  
              alert(error);  
        })
    };
    
    
}]);
