import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class Careers extends Component {
  render() {
	 
	  return (
	    <div>
        	<div>
        		<h1>Careers</h1>
        	</div>

        	<div style={{paddingLeft: 15}}>

	        	<Link className="text-dark" style={{ textDecoration: 'none', paddingLeft: 10 }} to="/react-native-developer">
	        		<h2>React Native Mobile Developer</h2>

	        		<div>
	        			We are looking for an experienced React Native developer to lead the 
	        			development of our mobile platform. You will be responsible for building an
	        			integral experience aligned with the web platform. You will also be a key 
	        			member of our small but growing engineering team working hand-in-hand with 
	        			the co-founders to shape the company's future.
	        		</div>
	      		</Link>

	      		<br />
	      		<Link className="text-dark" style={{ textDecoration: 'none', paddingLeft: 10 }} to="/front-end-developer">
	        		<h2>Front-End Web Developer</h2>
	        		<div>
	        			We are looking for an experienced web developer to work on the redesign of our web
	        			platform. You will be responsible for building new components and interfaces utilizing
	        			modern web technologies (ReactJS, HTML5, CSS). You will be working hands-on with the
	        			CTO to ensure a quality experience on the front end of the website. 
	        		</div>
	      		</Link>

      		</div>
	    </div>
	  );
    }
}

export default Careers;