import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile, deleteAccount } from '../../actions/profileActions';
import Spinner from '../common/Spinner';
import PostItem from "../posts/PostItem";
import { getPosts } from '../../actions/postActions';
import DashboardHeader from './DashboardHeader';

class Dashboard extends Component {
  componentDidMount() {
    this.props.getCurrentProfile();
    this.props.getPosts();
  }

  onDeleteClick(e) {
    this.props.deleteAccount();
  }
  doNothing() {
    //does literally nothing
  }
  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;
    const { posts } = this.props.post;

    let dashboardContent;
    let postHeader;
    let postContent;
    let deleteContent;
    if (profile === null || posts == null && loading) {
      dashboardContent = <Spinner />;
    } else {
        
      
      // Check if logged in user has profile data
      if (Object.keys(profile).length > 0) {
        
        dashboardContent = (
          <div>

            <p className="lead text-muted">
              Welcome <Link to={`/profile/${profile._id}`}>{user.name}</Link>

              
            </p>
            <div style={{position:'absolute', top: 0, right:0}} className="btn-group mb-4" role="group">
              <Link to="/edit-profile" className="btn btn-light">
                Edit Profile
              </Link>
            </div>
          
            <DashboardHeader/>

            <p style={{paddingTop: 70}}>
              {
                profile.location && 
                  <div>
                    Location: {profile.location}
                  </div>
              }
            </p>
            <p style={{display: 'inline-block'}}>
              {
                profile.university && 
                <div>
                  University: {profile.university}, 
                </div>
              }
              {
                profile.study &&
                <div>
                  {profile.study}
                </div>
              }
            </p>
            <p>
              {
                profile.age && 
                <div>
                  Age: {profile.age}
                </div>
              }
            </p>
            <p>
              {
                profile.job && 
                <div>
                  Job: {profile.job}
                </div>
              }
            </p>
            <p>
              {
                profile.bio && 
                <div>
                  {profile.bio}
                </div>
              }
            </p>
            <p>
              {
                profile.interests && 
                <div>
                  Interests: {profile.interests}
                </div>
              }
            </p>

            <div style={{ marginBottom: '60px' }} />
          </div>
        );
        deleteContent = (
          <div style={{paddingTop: 15}}>
            <button
              onClick={this.onDeleteClick.bind(this)}
              className="btn btn-danger"

            >
              Delete My Account
            </button>
          </div>
        );
        if (profile === null) {
          //do nothing
        } else if(posts === null || profile.posts === undefined || profile.posts.length === 0) {
          postHeader = <h1>Posts</h1>;
          postContent = <p style={{paddingLeft: 5}}>No post to show</p>;
        } else {
            postHeader = <h1>Posts</h1>;
            postContent = posts.map(post => { 
                if(profile.posts.indexOf(post._id) >= 0) {
                    //do nothing for updateParentPostFeed, only needed for feed with the map
                    return <PostItem updateParentPostFeed={this.doNothing} className="col-md-6" key={post._id} post={post} />
                } else {
                    return; // nothing
                }
            });
        }
      } else {
        // User is logged in but has no profile
        dashboardContent = (
          <div>
            <p className="lead text-muted">Welcome {user.name}</p>
            <p>You have not yet setup a profile, please create a profile. User's can not access other pages before creating a profile</p>
            <Link to="/create-profile" className="btn btncustom">
              Create Profile
            </Link>
          </div>
        );
      }
    }

    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4">Dashboard</h1>
              <div style={{marginLeft: 15}}>
                {dashboardContent}
              </div>
              {postHeader}
              {postContent}

              {deleteContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  getPosts: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  post: state.post,
  auth: state.auth
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount, getPosts })(
  Dashboard
);
