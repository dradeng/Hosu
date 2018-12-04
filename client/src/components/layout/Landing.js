import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
//import Timelapse from '../../assets/Timelapse.mp4';
class Landing extends Component {
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }

  render() {
    return (
      <div  className="landing">
        <div>
          <video id="background-video"  autoPlay loop muted>
            <source src="https://s3.us-east-2.amazonaws.com/aveneu/Timelapse.mp4" type='video/mp4'/>
          </video>
        </div>
        <div className="dark-overlay landing-inner text-light">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h1 className="display-3 mb-4">HausFlex</h1>
                <p className="lead">
                  {' '}
                  Create an account to start exploring the world!
                </p>
                <hr />
                <Link to="/register" className="btncustom btn mt-4 mr-2">
                  Sign Up
                </Link>
                <Link to="/login" className="btncustom btn mt-4">
                  Login
                </Link>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Landing.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Landing);
