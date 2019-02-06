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
      this.setState({redirect: true}) //After 12 seconds, set render to true
    }.bind(this), 12000);

  }
  render() {

    if(this.state.redirect) {
      return <Redirect to='/login' />
    }

    return (
      <div className="container">
        <div style={{width: '100%', textAlign: 'center', paddingTop: '200', display: 'inline-block'}}>
          Your account has been registered, go to your email to verify your account! Will be redirected to login page soon.
        </div>
      </div>
    );
  }
}

export default RegisteredUser;