import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

class ReactNativeDeveloper extends Component {
  render() {
	 
	  return (
	    <div style={{textAlign:'center'}}>
        	<iframe 
        		class="airtable-embed" 
        		src="https://airtable.com/embed/shrP0g4dtsmBGAQrM?backgroundColor=cyan" 
        		frameborder="0" onmousewheel="" width="100%" height="533" 
        		style={{background: 'transparent', height: 1600}}>
        	</iframe>
	    </div>
	  );
    }
}

export default ReactNativeDeveloper;