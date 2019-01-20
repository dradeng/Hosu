import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Request from './Request';
import { Link } from 'react-router-dom';
import { getStays } from '../../actions/stayAction';

class StayFeed extends Component {
  componentDidMount() {
    this.prop.getCurrentProfile();
  }
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

Request.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  getStays: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(mapStateToProps, { getCurrentProfile, getStays })(
  StayFeed
);