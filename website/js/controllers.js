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
	if( store.get( "whatever" ) && store.get( "whatever" ).length!=0 ){ //unless there are stored itineraries already
		$scope.currentItinerary = store.get( "whatever" )[0];
	}
	
/* Map Control */
	$scope.mapOptions = {
		center: initialCenter,
		zoom: 15,
		disableDefaultUI: true,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	//Markers should be added after map is loaded
	$scope.onMapIdle = function() {
		if($scope.itineraries == null){
			$scope.initializeItineraries();
			$scope.currentMarker = null;
		}
	};

	$scope.markerClicked = function(marker) {
		$scope.currentMarker = {lat:marker.getPosition().lat(),lng:marker.getPosition().lng(),
		                         markerType:marker.get('markerType'), venueIndex:marker.get('venueIndex')};
		$scope.currentMarker = marker;
		$scope.currentVenue = $scope.findVenueFromMarker(marker);
		console.log(marker);
		$scope.myInfoWindow.open($scope.myMap, marker);  
	};

/* Itinerary Management */
	$scope.showItinerary = function(itinerary){
		$scope.clearMarkers("itinerary");
		$scope.currentItinerary = itinerary;
		$scope.addMarkers(blueIcon,"itinerary");
		$scope.currentVenue = null;
	};

	$scope.addItinerary = function(){
		bootbox.prompt("Please enter a name for your new itinerary:",function(response){
			if(response){
				$scope.itineraries = store.get( "whatever" );
				$scope.itineraries.push( {name:response, venues:[]} );
				//save
				store.set( "whatever",$scope.itineraries );
				//update view
				$scope.showItinerary( $scope.itineraries[$scope.itineraries.length-1] );
			}
			$scope.$apply();
		});
/////////////////////////////////////////////////////////////disable "ok" when nothing is entered; disable "cancel" if there are no itineraries
	//
	};

	$scope.removeItinerary = function(index){
		bootbox.confirm("Are you sure you want to remove " + $scope.itineraries[index].name, function(response){
			if(response){
				$scope.itineraries.splice(index,1);
				//save
				store.set( "whatever",$scope.itineraries );
				//update view
				if( $scope.itineraries.length==0 ){

				}
				else if( index==0 ){
					$scope.showItinerary($scope.itineraries[0]);
				}
				else{
					$scope.showItinerary($scope.itineraries[index-1]);
				}
			}
			/////////////////////////////////////////////////////////////////if the selected one has index index 
			$scope.$apply();
		});
		//
		store.set( "whatever",$scope.itineraries );
	};

	//Testing purposes, three itineraries
	$scope.initializeItineraries = function(){
	$scope.itineraries = [];
	if( store.get( "whatever" ) ){
		//store.remove("whatever");
		$scope.itineraries = store.get( "whatever" );
	}
	};

	$scope.findVenueFromMarker = function(marker){
		for (var i = 0; i < $scope.myMarkers.length; i++){
			var temp = $scope.myMarkers[i];
			if(temp == marker){
			if(marker.get("markerType") == "search")
				return $scope.searchVenues[marker.get("venueIndex")];
			if(marker.get("markerType") == "itinerary")
				return $scope.currentItinerary.venues[marker.get("venueIndex")];
			}
		}
	};

	//Hacky shit due to ui-maps bug. Look at https://github.com/angular-ui/ui-map/issues/23
	$scope.addVenueToCurrentItinerary = function(index){
  	if ($scope.prevIndex != index){
  		$scope.currentItinerary.venues.push($scope.searchVenues[index]);
  		$scope.removeMarker("search",index);
  		$scope.searchVenues.splice(index, 1);
  		$scope.addSearchResultsToMap($scope.searchVenues);
  		$scope.showItinerary($scope.currentItinerary);
  		//
  		store.set( "whatever",$scope.itineraries );
  	}

	}

	$scope.removeVenueFromItinerary = function(index){
  	return bootbox.confirm( "Are you sure you want to remove the venue "+$scope.currentItinerary.venues[index].name+"from the itinerary "+$scope.currentItinerary.name+"?", function(response){
  		if(response){
    		$scope.removeMarker("itinerary", index);
    		$scope.currentItinerary.venues.splice(index, 1);
    		$scope.addSearchResultsToMap($scope.searchVenues)
    		$scope.showItinerary($scope.currentItinerary);
    		//save
    		store.set( "whatever",$scope.itineraries );
    		$scope.$apply();
    	} 
	});

	//////////////////////////////////////////////////
	
	}

	/* Foursquare Search */
	$scope.searchFoursquare = function (searchItem){
	//Setup search params
	var center = $scope.myMap.getCenter();
	var latlng = center.lat() + "," + center.lng();
	var ne = $scope.myMap.getBounds().getNorthEast();
	var sw = $scope.myMap.getBounds().getSouthWest();

	//earths radius in miles == 3956.6
	var distance = google.maps.geometry.spherical.computeDistanceBetween(
			ne, 
			sw, 
			6378.1
		) * 500;

	return FoursquareService.get({ll:latlng, query:searchItem, radius:distance},function(reply){
		//TODO: show error if something does not work in response
		$scope.searchVenues = reply.response.venues;
		$scope.addSearchResultsToMap($scope.searchVenues);
		$scope.showItinerary($scope.currentItinerary);
		//console.log(reply.response.venues);
		return $scope.searchVenues;
	});};

	$scope.addSearchResultsToMap = function(venues){
		$scope.clearMarkers("search");
		$scope.addMarkers(redIcon, "search");
	};

	$scope.showVenueInfo = function(venueType, index){
		var marker = $scope.findMarker(venueType, index);
		$scope.markerClicked(marker);
	};

	$scope.findMarker = function(mType,index){
		for (var i = 0; i < $scope.myMarkers.length; i++){
			var marker = $scope.myMarkers[i];
			if(marker.get("markerType") == mType && marker.get("venueIndex") == index){
			return marker;
		}
	}
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
		list = $scope.currentItinerary.venues;
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

});
