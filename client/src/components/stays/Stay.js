import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import { Redirect } from 'react-router-dom';


class Stay extends Component {
  componentDidMount() {
    
  }
  render() {
    const { user } = this.props.auth;
  
    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              Made it to requests
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Stay.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {  })(
  Stay
);