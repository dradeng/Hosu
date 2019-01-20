import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Spinner from '../common/Spinner';
import { getCurrentProfile } from '../../actions/profileActions';
import MapContainer from "../map/MapContainer";

class Stays extends Component {
  constructor(props) {
        super(props);
        this.state = {
        
      };
  }
  componentDidMount() {
    this.props.getCurrentProfile();
  }
 
  render() {
   
    return (
      <div>
      Stays
      </div>
    );
  }
}

Stays.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, { getCurrentProfile })(Stays);
