app.controller('MapCtrl', function ($scope) {
    var ll = new google.maps.LatLng(40.78,-73.97);
    $scope.mapOptions = {
        center: ll,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    //Markers should be added after map is loaded
    $scope.onMapIdle = function() {
        if ($scope.myMarkers === undefined){    
            var marker = new google.maps.Marker({
                map: $scope.myMap,
                position: ll
            });
            $scope.myMarkers = [marker, ];
        }
    };

    $scope.markerClicked = function(m) {
        window.alert("clicked");
    };
});

app.controller('MyCtrl', function($scope, FoursquareService) {
    FoursquareService.get({ll:"40.78,-73.97"},function(reply){
        $scope.venues = reply.response.venues;
        //console.log(reply);
    });
});
