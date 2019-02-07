
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
	        	transformative marketplace. Aveneu's mission is to make living in any 
	        	city for any period of time as simple as possible. Ideal for students looking for 
	        	places during the summer or rent out their own lease. The marketplace is designed for 
	        	flexible leases supporting two varities of leases:
	        	
	        	<br />
	        	<br />

	        	<div>
					1. Flexible Stay: "Digital Nomad" 
				</div>


				Perfect for newcomers who have moved on short notice. Rooms are leased for minimum stays. However, once you reserve a room, 
				it is reserved for the upcoming weeks. 
				You can therefore move in to a property staying week by week solving your temporary housing needs. 
				
				<br />

				<div>
				<br />
				2. Traditional Lease
				</div>

				Made for people who are in need of short-term housing for a given period. You can lease rooms for flexible periods set by property owners.

				Whether you're a student, new grad, or digital nomad, Aveneu hopes to serve you. 
				<br />
				<br />
				Aveneu is currently beta-testing at select few college campuses. Aveneu will always offer a fremium version. We plan to build on our features
				and integrate payment processing in the near future. We currently are in the process of developing our mobile app.
				<br />
				<br />
				If you have any questions or feedback, email support@aveneu.co
			</div>
	    </div>
	  );
    }
}

export default HowItWorks;