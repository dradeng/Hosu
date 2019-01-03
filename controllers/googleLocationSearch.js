//THIS CONTROLLER IS USED WITHIN A API REQ FUNCTION
//IT IS NOT CALLED AS IF IT IS MIDDLEWARE OR SOME FUNCTION
//USED RIGHT AFTER THE API PATH 
//IE router.post('/delete/uploads', awsDeleter.doDelete); NOT USED THIS WAY

const GoogleMapsApi = require('../config/keys').GoogleMapsApi;

module.exports = {
	googleLocationSearch: function (address) {
	
	    // set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
	    
	    Geocode.setApiKey(GoogleMapsApi);
	     
	    // Enable or disable logs. Its optional.
	    Geocode.enableDebug();
	     
	    // Get latidude & longitude from address.
	    Geocode.fromAddress(address).then(
	      response => {
	        const { lat, lng } = response.results[0].geometry.location;
	        
	        var result = ({latidude: lat, longitude: lng});
	        return result;
	      },
	      error => {
	        //console.error(error);
	        //Commented out because it says an error when ur not done typing out address
	      }
	    );
	}
} 
