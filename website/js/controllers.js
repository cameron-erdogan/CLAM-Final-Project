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

    //40.78,-73.97 -> New York

    $scope.searchFoursquare = function (searchItem){ 
        FoursquareService.get({ll:searchItem},function(reply){
        $scope.venues = reply.response.venues;
        console.log(reply);
    });};


    $scope.writeVal = function() {
        FileSystemService.writeText(txtFileName, "Persistence TEST!!").then(function(fs) {
            $scope.messages.push("data written");
        }, function(err) {
            console.log(err);
            $window.alert(err.text);
        });
    };
    
    $scope.readVal = function() {
        FileSystemService.readFile(txtFileName).then(function(contents) {
            $scope.messages.push(contents);
        }, function(err) {
            console.log(err);
            $window.alert(err.text);
        });
    };
});
