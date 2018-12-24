
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profileActions';


class FormSubmitted extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
    };
  }
  componentDidMount() {
  	this.props.getCurrentProfile();

	setTimeout(function() { //Start the timer
	  this.setState({redirect: true}) //After 1 second, set render to true
	}.bind(this), 5000)
  }
  render() {
  	  const { user } = this.props.auth;

  	  if(this.state.redirect) {
  	  	return <Redirect to='/feed' />
  	  }


	  return (
	    <div style={{textAlign:'center'}}>
	      <h3>Thankyou {user.name}! Your form has been submitted successfully. This page will redirect to the feed in a few seconds</h3>
	    </div>
	  );
    }
}

FormSubmitted.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	profile: state.profile,
	auth: state.auth
});

export default connect(mapStateToProps, { getCurrentProfile })(FormSubmitted);