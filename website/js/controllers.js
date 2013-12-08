app.controller('MyCtrl', function($scope, FoursquareService) {
  
  var initialCenter = new google.maps.LatLng(40.78,-73.97);
  var redIcon = "http://www.google.com/intl/en_us/mapfiles/ms/micons/red-dot.png";
  var blueIcon = "http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png";
  //Stores all google map icons
  $scope.myMarkers = [];
  //Stores search results
  $scope.searchVenues = [];
  //Selected itinerary
  $scope.currentItinerary = {name:"", venues: []}; //Blank itinerary initially loaded
  
  /* Map Control */
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
  $scope.showItinerary = function(itinerary){
    $scope.clearMarkers("itinerary");
    $scope.itineraryVenues = itinerary.venues;
    $scope.currentItinerary = itinerary;
    $scope.addMarkers(redIcon, "itinerary");
  };

  $scope.addItinerary = function(){
    var newName = window.prompt("Please enter itinerary name");
    if (newName){
      var itin = {name:newName, venues:[]};
      $scope.itineraries.push(itin);
    }
  };

  $scope.removeItinerary = function(index){
    bootbox.confirm("Are you sure you want to remove " + $scope.itineraries[index].name, function(response){
      if(response)
        $scope.itineraries.splice(index,1);
    });
  };

  //Testing purposes, three itineraries
  $scope.initializeItineraries = function(){
    $scope.itineraries = [
      { name:"Itinerary 1",
        venues:[
          {name:"Venue 1 - 1", location: {lat:"40.78", lng:"-73.98"}},
          {name:"Venue 1 - 2", location: {lat:"40.782", lng:"-73.982"}}
      ]},
      { name:"Itinerary 2",
        venues:[
          {name:"Venue 2 - 1", location: {lat:"40.777", lng:"-73.977"}},
          {name:"Venue 2 - 2", location: {lat:"40.779", lng:"-73.979"}}
      ]},
      { name:"Empty 1", venues:[]}
    ];
  };

  $scope.addVenueToCurrentItinerary = function(index){
    $scope.removeMarker("search",index);
    $scope.currentItinerary.venues.push($scope.searchVenues[index]);
    $scope.searchVenues.splice(index, 1);
    $scope.showItinerary($scope.currentItinerary);
  }

  $scope.removeVenueFromItinerary = function(index){
    $scope.removeMarker("itinerary", index);
    $scope.currentItinerary.venues.splice(index, 1);
    $scope.showItinerary($scope.currentItinerary);
  }

  /* Foursquare Search */
  $scope.searchFoursquare = function (searchItem){
      var center = $scope.myMap.getCenter();
      var latlng = center.pb + "," + center.qb;
      return FoursquareService.get({ll:latlng, query:searchItem},function(reply){
        //TODO: show error if something does not work in response
        $scope.searchVenues = reply.response.venues;
        $scope.addSearchResultsToMap($scope.venues);
        //console.log(reply.response.venues);
        return $scope.searchVenues;
  });};

  $scope.addSearchResultsToMap = function(venues){
    $scope.clearMarkers("search");
    $scope.addMarkers(blueIcon, "search");
    $scope.showItinerary($scope.currentItinerary);
  };


  $scope.removeMarker = function(mType, index){
    for (var i = 0; i < $scope.myMarkers.length; i++){
      var marker = $scope.myMarkers[i];
      if(marker.get("markerType") == mType && marker.get("venueIndex") == index){
        marker.setMap(null);
        $scope.myMarkers.splice(i,1);
        i--;
        return;
      }
    }
  };

  $scope.clearMarkers = function(markerType){
    for (var i = 0; i < $scope.myMarkers.length; i++){
      var marker = $scope.myMarkers[i];
      if(marker.get("markerType") == markerType){
        marker.setMap(null);
        $scope.myMarkers.splice(i,1);
        i--;
      }
    }
  };

  $scope.addMarkers = function(iconType, markType){
    //Define what kind of markers we are adding
    var list = [];
    if(markType == "itinerary")
      list = $scope.itineraryVenues;
    else if (markType == "search")
      list = $scope.searchVenues;
    else //TODO: handle error
      return;

    //Add the markers
    for (var i = 0; i < list.length; i++){
      var venue = list[i];
      var marker = new google.maps.Marker({
          map: $scope.myMap,
          icon:iconType,
          position: new google.maps.LatLng(venue.location.lat,venue.location.lng)
      });
      marker.setValues({markerType:markType, venueIndex:i});
      $scope.myMarkers.push(marker);
    }
  };

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
