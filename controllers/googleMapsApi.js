//THIS CONTROLLER IS USED WITHIN A API REQ FUNCTION
//IT IS NOT CALLED AS IF IT IS MIDDLEWARE OR SOME FUNCTION
//USED RIGHT AFTER THE API PATH 
//IE router.post('/delete/uploads', awsDeleter.doDelete); NOT USED THIS WAY

const NodeGeocoder = require('node-geocoder');
const GoogleMapsApi = require('../config/keys').GoogleMapsApi;

module.exports = {
	locationSearch: function (address, callback) {
	
	    // set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
	    
	    const options = {
	    	provider: 'google',
	    	httpAdapter: 'https',
	    	apiKey: GoogleMapsApi,
	    	formatter: 'null'
	    };


	    var geocoder = NodeGeocoder(options);

	    var answer = {}
	    
	    geocoder.geocode(address).then( res => {
	    	
	    	if(res[0] === null || res[0].latitude === null || res[0].longitude === null) {

	    		answer.latitude = -78.498149;
		    	answer.longitude = 38.037275;
		    	callback(answer);
	    	} else {
	    		
		    	answer.latitude = res[0].latitude;
		    	answer.longitude = res[0].longitude;
		    	callback(answer);
		    }
	    }).catch(err => {
	    	//If there is an error default is charlottesville

	    	answer.latitude = -78.498149;
		    answer.longitude = 38.037275;
		    answer.latLongError = true;
		    callback(answer);
	    });
		
	}
} 
