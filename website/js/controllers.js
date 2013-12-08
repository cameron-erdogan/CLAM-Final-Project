app.controller('MyCtrl', function($scope, FoursquareService) {
  /* Map Control */
  var initialCenter = new google.maps.LatLng(40.78,-73.97);
  $scope.myMarkers = [];
  $scope.mapOptions = {
      center: initialCenter,
      zoom: 15,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  //Markers should be added after map is loaded
  $scope.onMapIdle = function() {
      if($scope.itineraries == null)
        $scope.initializeItineraries();
  };

  //TODO:Differentiate case when current marker is already added or not
  $scope.markerClicked = function(marker) {
      $scope.currentMarker = {lat:marker.getPosition().lat(),lng:marker.getPosition().lng()};
      $scope.myInfoWindow.open($scope.myMap, marker);  
  };

  /* Itinerary Management */
  $scope.currentItinerary = {name:"", venues: []}; //Blank itinerary initially loaded
  $scope.showItinerary = function(itinerary){
    //Clear previous markers
    //TODO: check if they are itinerary markers or search markers
    for (var i = 0; i < $scope.myMarkers.length; i++){
      var marker = $scope.myMarkers[i];
      marker.setMap(null);
    }
    $scope.myMarkers = [];

    //Add markers from the new itinerary
    for (var i = 0; i < itinerary.venues.length; i++){
      var venue = itinerary.venues[i];
      var marker = new google.maps.Marker({
          map: $scope.myMap,
          position: new google.maps.LatLng(venue.lat,venue.lng)
      });
      $scope.myMarkers.push(marker);
    }

    //Update variables for display
    $scope.currentItinerary = itinerary;
    $scope.itineraryVenues = itinerary.venues;
  };

  $scope.addItinerary = function(){
    var newName = bootbox.prompt("Please enter itinerary name", function(newName){
      if(newName){
        var itin = {name:newName, venues:[]};
        $scope.itineraries.push(itin);
      }
    });
  };

  $scope.removeItinerary = function(index){
    bootbox.confirm("Are you sure you want to remove " + $scope.itineraries[index].name, function(response){
      if(response)
        $scope.itineraries.splice(index,1);
    });
  };

  //Testing purposes, three itineraries
  //$scope.itineraries = [];
  $scope.initializeItineraries = function(){
    $scope.itineraries = [
      { name:"Itinerary 1",
        venues:[
          {name:"Venue 1 - 1", lat:"40.78", lng:"-73.98"},
          {name:"Venue 1 - 2", lat:"40.782", lng:"-73.982"}
      ]},
      { name:"Itinerary 2",
        venues:[
          {name:"Venue 2 - 1", lat:"40.777", lng:"-73.977"},
          {name:"Venue 2 - 2", lat:"40.779", lng:"-73.979"}
      ]},
      { name:"Empty 1", venues:[]}
      // { name:"Empty 2", venues:[]},
      // { name:"Empty 3", venues:[]},
      // { name:"Empty 4", venues:[]},
      // { name:"Empty 5", venues:[]},
      // { name:"Empty 6", venues:[]},
      // { name:"Empty 7", venues:[]},
      // { name:"Empty 8", venues:[]},
    ];
  };

  /* Foursquare Search */
  $scope.searchFoursquare = function (searchItem){
      var center = $scope.myMap.getCenter();
      var latlng = center.pb + "," + center.qb;
      return FoursquareService.get({ll:latlng, query:searchItem},function(reply){
        $scope.venues = reply.response.venues;
        //console.log(reply);
        for(var i=0; i<reply.response.venues.length; i++){
            venues_list += reply.response.venues[i].name+"\n";
        }
        //console.log(reply.response.venues);
        return $scope.venues;
  });};

  /* Persistance */
  var txtFileName = "data.txt";
  venues_list = "";

  $scope.writeVal =   function() {
    $scope.itineraries[0].venues = $scope.venues;
    store.set( "whatever",venues_list );
  };

  $scope.readVal =    function() {
    console.log( store.get( "whatever" ) );
  };
});
