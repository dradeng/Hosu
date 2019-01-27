
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';


class HowItWorks extends Component {
  render() {
	 

	  return (
	    <div>
	    	<h1>How it works</h1>
	    	<div style={{paddingLeft: 5}}>
	        	Aveneu is disrupting the short-term lease market by offering a 
	        	transformative marketplace. The marketplace is designed for 
	        	flexible leases supporting two varities of leases:
	        	
	        	<br />
	        	<br />

	        	<div>
					1. Flexible Stay: "Digital Nomad" 
				</div>

				

				Perfect for newcomers who have moved on short notice. Rooms are leased for minimum stays. However, once you reserve a room, it is reserved for the upcoming weeks. You can therefore move in to a property staying week by week solving your temporary housing needs. 
				<br />

				<div>
				<br />
				2. Traditional Lease
				</div>

				Made for people who are in need of short-term housing for a given period. You can lease rooms for flexible periods set by property owners.

				Whether you're a student, new grad, or digital nomad, Aveneu hopes to serve you. 
				<br />
				<br />
				If you have any questions, email support@aveneu.co
			</div>
	    </div>
	  );
    }
}

export default HowItWorks;