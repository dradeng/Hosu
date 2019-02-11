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

	      		<Link className="text-dark" style={{ textDecoration: 'none', paddingLeft: 10 }} to="/director-of-growth-marketing">
	        		<h2>Director of Growth Marketing</h2>
	        		<div>
	        			We are looking for a motivated, energetic, and talented Director of Growth Marketing to help find 
	        			innovative ways to build our two-sided marketplace. As director, you will work with clients and 
	        			students to increase engagement. In addition, you will be responsible for website and landing page
	        			conversion. Lead strategy for paid marketing at Aveneu for users. Expand current channels through
	        			ongoing optimization, and build out new channels to drive future Aveneu growth. Partner with Analytics,
	        			Eng and PM to drive strategy around attribution, tracking, and landing experiences for all paid marketing.
	        		</div>
	      		</Link>
	      		<Link className="text-dark" style={{ textDecoration: 'none', paddingLeft: 10 }} to="/growth-marketing-intern">
	        		<h2>Growth Marketing Intern</h2>
	        		<div>
	        			We are looking for a motivated, energetic, and talented Director of Growth Marketing to help find 
	        			innovative ways to build our two-sided marketplace. As director, you will work with clients and 
	        			students to increase engagement. In addition, you will be responsible for website and landing page
	        			conversion. Lead strategy for paid marketing at Aveneu for users. Expand current channels through
	        			ongoing optimization, and build out new channels to drive future Aveneu growth. Partner with Analytics,
	        			Eng and PM to drive strategy around attribution, tracking, and landing experiences for all paid marketing.
	        		</div>
	      		</Link>

      		</div>
	    </div>
	  );
    }
}

export default Careers;