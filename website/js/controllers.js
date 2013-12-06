app.controller('MapCtrl', function ($scope) {
    var ll = new google.maps.LatLng(40.78,-73.97);
    $scope.mapOptions = {
        center: ll,
        disableDefaultUI: true,
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

app.controller('MyCtrl', function($scope, FoursquareService, FileSystemService) {

    var txtFileName = "data.txt";
    $scope.messages = ['Click a button'];
    venues_list = "";
    // 40.78,-73.97 -> New York
    // 42.3581,71.0636 -> Boston

    $scope.searchFoursquare = function (searchItem){ 
        FoursquareService.get({ll:searchItem},function(reply){
        $scope.venues = reply.response.venues;
        console.log(reply);
        for(var i=0; i<reply.response.venues.length; i++){
            venues_list += reply.response.venues[i].name+"\n";
        }
    });};

    $scope.writeVal =   function() {
                            store.set( "whatever",venues_list );
                        };

    $scope.readVal =    function() {
                            console.log( store.get( "whatever" ) );
                        };
});
