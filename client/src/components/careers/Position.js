import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

class ReactNativeDeveloper extends Component {
  render() {
	 	
    //this code is irrelevant and never used
    //could change down the road, just uses 
    //props or something when passing for source to make any form work

	  var source = this.props.source;
	  return (
	    <div style={{textAlign:'center'}}>
        	<iframe 
        		class="airtable-embed" 
        		src={source} 
        		frameborder="0" onmousewheel="" width="100%" height="533" 
        		style={{background: 'transparent', height: 1600}}>
        	</iframe>
	    </div>
	  );
    }
}

export default ReactNativeDeveloper;