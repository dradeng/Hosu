import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import StayFeed from './StayFeed';
import Spinner from '../common/Spinner';
import { getStays } from '../../actions/stayActions';
import MapContainer from "../map/MapContainer";

class Stays extends Component {
  constructor(props) {
        super(props);
        this.state = {
        
      };
  }
  componentDidMount() {
    this.props.getStays();
  }
  render() {
   
    var stayFeedContent;

    const { user } = this.props.auth;
    const { stays, loading } = this.props.stay;

    if (stays === null || loading || user === null) {
      stayFeedContent = <Spinner />;
    } else {

      stayFeedContent = <StayFeed 
        stays={stays} 
      />;

    }

    return (
      <div>
      Stays
        {stayFeedContent}
      </div>
    );
  }
}

Stays.propTypes = {
  getStays: PropTypes.func.isRequired,
  stay: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  stay: state.stay,
  auth: state.auth,
});

export default connect(mapStateToProps, { getStays })(Stays);
