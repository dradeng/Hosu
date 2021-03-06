import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import PostItem from "../posts/PostItem";
import { getCurrentProfile } from '../../actions/profileActions';
import { getPosts } from '../../actions/postActions';


class Favorites extends Component {

  componentDidMount() {
    this.props.getPosts();
    this.props.getCurrentProfile();
  }

  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;
    const { posts } = this.props.post; //const { posts, loading } = this.props.post; might need to add loading
    let favoritesContent;
    
    if (profile === null || user=== null ) {
      favoritesContent = <Spinner />;
    } else {
      //Looks over all posts to find which one user likes
      //this is inefficient will come back and fix later
      if(profile.favorites.length === 0) {
        favoritesContent = <div>No favorites yet. Start favoriting posts by clicking on the gold star and they will appear here!</div>
      } else {
        favoritesContent = posts.map(post => { 
            if(profile.favorites.indexOf(post._id) >= 0) {
                return <PostItem className="col-md-6" key={post._id} post={post} />
            } else {
              // nothing
            }
        });
      }
    }
    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4">Favorites</h1>
              {favoritesContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Favorites.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  getPosts: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.post,
  profile: state.profile,
  auth: state.auth
});

export default connect(mapStateToProps, { getCurrentProfile, getPosts })(
  Favorites
);