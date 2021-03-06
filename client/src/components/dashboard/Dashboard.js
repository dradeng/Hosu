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
    var dashboardHeader;

    let postHeader;
    let postContent;
    let deleteContent;
    if (profile === null || posts == null && loading) {
      dashboardContent = <Spinner />;
    } else {
        
      dashboardHeader = (
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
        </div>
      );

      // Check if logged in user has profile data
      if (profile.social) {
        
        dashboardContent = (
          <div>
            <div style={{backgroundColor: '#F5F5F5', textAlign: 'center', width:250 }}>
              <h3 style={{paddingTop: 70}}>{profile.name}</h3>
              <p style={{paddingBottom: 15}}>
                {
                  profile.age ? 
                    <div>
                      {profile.age}
                    </div>
                    :
                     <div>
                      <Link class='text-dark' to='edit-profile' style={{textDecoration: 'none'}}>Add your age</Link>
                     </div>
                }
                {
                  profile.location ?
                    <div style={{paddingTop: 15, verticalAlign: 'middle', display: 'inline-block'}}>
                      <div style={{display: 'inline-block', verticalAlign: 'middle'}}>
                        <i class="far fa-map" style={{paddingRight: 5, fontSize: 25}}></i>
                      </div>
                      {profile.location}
                    </div>
                  :
                    <div style={{paddingTop: 15, verticalAlign: 'middle', display: 'inline-block'}}>
                      <div style={{display: 'inline-block', verticalAlign: 'middle'}}>
                        <i class="far fa-map" style={{paddingRight: 5, fontSize: 25}}></i>
                      </div>
                      <Link class='text-dark' to='edit-profile' style={{textDecoration: 'none'}}>Add your location</Link>
                    </div>
                }
                <br />
                {
                  profile.university ? 
                    <div style={{paddingTop: 15, verticalAlign: 'middle', display: 'inline-block'}}>
                      <div style={{display: 'inline-block', verticalAlign: 'middle'}}>
                        <i class="fas fa-university" style={{paddingRight: 5, fontSize: 25}}></i>
                      </div>
                      {profile.university}
                    </div>
                  :
                    <div style={{paddingTop: 15, verticalAlign: 'middle', display: 'inline-block'}}>
                      <div style={{display: 'inline-block', verticalAlign: 'middle'}}>
                        <i class="fas fa-university" style={{paddingRight: 5, fontSize: 25}}></i>
                      </div>
                        <Link class='text-dark' to='edit-profile' style={{textDecoration: 'none'}}> Add your university</Link>
                    </div>

                }
                {
                  profile.study ?
                    <div>
                      {profile.study}
                    </div>
                  : 
                    <div>
                      <Link class='text-dark' to='edit-profile' style={{textDecoration: 'none'}}> Add your study</Link>
                    </div>
                }
                {
                  profile.job ? 
                    <div style={{paddingTop: 15, verticalAlign: 'middle', display: 'inline-block'}}>
                      <div style={{display: 'inline-block', verticalAlign: 'middle'}}>
                        <i class="fas fa-briefcase" style={{paddingRight: 5, fontSize: 25}}></i>
                      </div>
                      {profile.job}
                    </div>
                  :
                    <div style={{paddingTop: 15, verticalAlign: 'middle', display: 'inline-block'}}>
                      <div style={{display: 'inline-block', verticalAlign: 'middle'}}>
                        <i class="fas fa-briefcase" style={{paddingRight: 5, fontSize: 25}}></i>
                      </div>
                      <Link class='text-dark' to='edit-profile' style={{textDecoration: 'none'}}> Add your job</Link>
                    </div>
                }
                {
                  profile.bio ? 
                    <div style={{paddingTop: 15}}>
                      {profile.bio}
                    </div>
                  :
                    <div style={{paddingTop: 15}}>
                      <Link class='text-dark' to='edit-profile' style={{textDecoration: 'none'}}> Add your bio</Link>
                    </div>
                }

                <div className="text-dark" style={{textDecoration: 'none'}}>
                  {
                    !profile.social.facebook && 
                    !profile.social.linkedin && 
                    !profile.social.twitter && 
                    !profile.social.youtube && 
                    !profile.social.instagram ? 
                      <div style={{ marginLeft: 5, marginRight: 5, textAlign: 'center'}}> 
                        <Link class='text-dark' to='edit-profile' style={{textDecoration: 'none'}}> Connect your social media!</Link>
                      </div> : <div></div>
                  }
                  {
                    profile.social.facebook && 
                    <a href={profile.social.facebook} style={{color: 'inherit', textDecoration: 'none'}}>
                      <i class="fab fa-facebook-square" style={{fontSize: 25, marginLeft: 5, marginRight: 5}}></i>
                    </a>
                  }
                  {
                    profile.social.instagram && 
                    <a href={profile.social.instagram} style={{color: 'inherit', textDecoration: 'none'}}>
                      <i class="fab fa-instagram" style={{fontSize: 25, marginLeft: 5, marginRight: 5}}></i>
                    </a>
                  }
                  {
                    profile.social.twitter && 
                    <a href={profile.social.twitter} style={{color: 'inherit', textDecoration: 'none'}}>
                      <i class="fab fa-twitter" style={{fontSize: 25, marginLeft: 5, marginRight: 5}}></i>
                    </a>
                  }
                  {
                    profile.social.linkedin && 
                    <a href={profile.social.linkedin} style={{color: 'inherit', textDecoration: 'none'}}>
                      <i class="fab fa-linkedin" style={{fontSize: 25, marginLeft: 5, marginRight: 5}}></i>
                    </a>
                  }
                  {
                    profile.social.youtube && 
                    <a href={profile.social.youtube} style={{color: 'inherit', textDecoration: 'none'}}>
                      <i class="fab fa-youtube" style={{fontSize: 25, marginLeft: 5, marginRight: 5}}></i>
                    </a>
                  }
                </div>
              </p>

              <div style={{ marginBottom: '60px' }} />
            </div>
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
          postContent = <p>No post to show</p>;
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
                {dashboardHeader}
              </div>
              <div style={{marginLeft: 15, display: 'inline-block'}}>
                <div style={{display: 'inline-block'}}>
                  {dashboardContent}
                </div>
                <div style={{marginLeft: 15, paddingLeft: 15, paddingTop: 15, width: 800, display: 'inline-block', verticalAlign: 'top'}}>
                  {postHeader}
                  {postContent}
                  {deleteContent}
                </div>
              </div>
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
