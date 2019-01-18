import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Request from './Request';
import { Link } from 'react-router-dom';

class RequestFeed extends Component {
  render() {

    let requestContent;
    if(requests.length === 0) {
      requestContent = <div>You have no request. Be patient!</div>;
    } else {
      requestContent = requests.map(chat => 
          <Request />
      );
    }

    return (
      <div>
        {requestContent}
      </div>
    );
  }
}

RequestFeed.propTypes = {

};

export default RequestFeed;