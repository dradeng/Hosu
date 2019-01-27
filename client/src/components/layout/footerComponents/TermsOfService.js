
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';


class TermsOfService extends Component {
  render() {
	 

	  return (
	    <div> 
		    <object 
		    	type="text/html" 
		    	data="https://app.termly.io/document/terms-of-use-for-online-marketplace/8056b8c8-8abe-4629-ac81-91b58816f80c" 
		    	height="600px" 
		    	width="1000px"
		    	style={{overflow:'auto', display: 'table', margin: '0 auto'}}>
		    </object>
		 </div>
	  );
    }
}

export default TermsOfService;