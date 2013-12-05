function foursquareAPICall(query)
{
    var config = {
            apiKey: 'XXXXXXXXXXXXXX',
            authUrl: 'https://foursquare.com/',
            apiUrl: 'https://api.foursquare.com/',
            clientID: 'CAJRMJ2G1UAEMWW15D53EVTS4Q4WLP4M4KBTREFGZ2NNOORS',
            clientSecret: 'Y24WTDBMC03NQLNMC2W2ESGF1C5IDNVWDZVMTO0PZW2REFP3'
        };


        // https://api.foursquare.com/v2/
        // venues/search?ll=40.7,-74

        //https://api.foursquare.com/v2/venues/search?ll=40.7,-74&client_id=CLIENT_ID&client_secret=CLIENT_SECRET&v=YYYYMMDD

        //&client_id=CLIENT_ID&client_secret=CLIENT_SECRET&v=YYYYMMDD
        $.getJSON('https://api.foursquare.com/v2/venues/search?ll=40.7,-74&client_id='
            +config['clientID']
            +'&client_secret='
            +config['clientSecret']
            +'&v=20131204'
            +'&query='
            +query, {}, 
            function(data){
                venues = data['response']['venues'];
                $('#output').html("");
                venues.forEach(function(venue){
                    $('#output').append(venue['name'] 
                        + " " 
                        +venue['location']['city'] + "<br>");
                });


                


            })
}


//$("#submit").click(foursquareAPICall());

$(function(){
    $("#submit").click(function(){
        var query = $("#search-input").val();
        // alert(query);
        foursquareAPICall(query);
    });
});