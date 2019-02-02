import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

class RegisteredUser extends Component {
  constructor() {
    super();
    this.state = {
     redirect: false
    };
  }
  componentDidMount() {

    setTimeout(function() { //Start the timer
      this.setState({redirect: true}) //After 30 seconds, set render to true
    }.bind(this), 30000);

  }
  render() {

    if(this.state.redirect) {
      return <Redirect to='/login' />
    }

    return (
      <div className="container">
        <div style={{textAlign: 'text-center', paddingTop: '100', display: 'inline-block'}}>
          Your account has been registered, go to your email to verify your account! Will be redirect to login page in 30 seconds.
        </div>
      </div>
    );
  }
}

export default RegisteredUser;