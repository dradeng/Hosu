import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profileActions';
import Spinner from '../common/Spinner';
import PostItem from "../posts/PostItem";
import UserIcon from '../../assets/UserIcon.png';
import { getPosts } from '../../actions/postActions';

class DashboardHeader extends Component {
  componentDidMount() {
    this.props.getCurrentProfile();
  }
  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;

    let dashboardContent;
    if (profile === null || loading) {
      //do nothing
    } else {
        
      
      // Check if logged in user has profile data
      if (Object.keys(profile).length > 0) {
        
        dashboardContent = (
          <div style={{backgroundImage: `url(${profile.backgroundPic})`, backgroundSize: '100% 100%', height: 315, width: 851}}>
            <div className="row">
              <img
                className="rounded-circle"
                src={user.profilePic }
                alt={user.name}
                style={{width:150, height:150,display: 'block', position: 'absolute', left: 85, top: 360, border:'4px solid white', backgroundColor: 'white'}}
                title="You must have a Gravatar connected to your email to display an image"
              />
            </div>
          </div>
        );
      }
    }

    return (
      <div>
        {dashboardContent}
      </div>
    );
  }
}

DashboardHeader.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  post: state.post,
  auth: state.auth
});

export default connect(mapStateToProps, { getCurrentProfile })(
  DashboardHeader
);