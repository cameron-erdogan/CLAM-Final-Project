/* Services */
app.factory('FoursquareService', function($resource){
    return $resource('https://api.foursquare.com/v2/venues/:action?client_id='+'CAJRMJ2G1UAEMWW15D53EVTS4Q4WLP4M4KBTREFGZ2NNOORS'+
    				'&client_secret='+'Y24WTDBMC03NQLNMC2W2ESGF1C5IDNVWDZVMTO0PZW2REFP3'+'&v=20131205'+ "&callback=:callback" +
    				"&ll=:ll" + "&query=:query",
        {action: "search", callback:"JSON_CALLBACK"},
        {get:  {method: 'JSONP'}
    });
});