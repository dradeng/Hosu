import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PostFeed from './PostFeed';
import Spinner from '../common/Spinner';
import { getPosts } from '../../actions/postActions';
import { getCurrentProfile } from '../../actions/profileActions';
import MapContainer from "../map/MapContainer";

class Posts extends Component {
  constructor(props) {
        super(props);
        this.state = {
          latitude: 0,
          longitude: 0,
          highlight: null
      };
  }
  componentDidMount() {
    this.props.getPosts();
    this.props.getCurrentProfile();
  }
  updateParentPosts(post) {
    this.setState({highlight: post});
  }
  render() {
    const { user } = this.props.auth;
    const { posts, loading } = this.props.post;
    const { profile } = this.props.profile;

    let postContent;
    let mapContent;

    var geojson = [];
    geojson['type'] = 'FeatureCollection';
    geojson['features'] = [];

    for (var k in posts) {
        if (!posts[k].latitude)
        {
          continue;
        }
        geojson.push(posts[k]);
    }

    var address;

    if (posts === null || loading || profile === null || user === null) {
      postContent = <Spinner />;
    } else {
      if(!user.profile) {
        return <Redirect to='/dashboard' />;
      }
      address = {
        latitude: profile.latitude,
        longitude: profile.longitude,
        circle: false
      };

      postContent = <PostFeed 
        updateParentPosts={this.updateParentPosts.bind(this)}
        profile={profile} 
        addressBounds={address} 
        posts={posts} 
      />;
     
      mapContent = <MapContainer highlight={this.state.highlight} id="map"address={address} geojson={geojson}/>;
    }

    var circle = {
      latitude: 0,
      longitude: 0,
      exist: false,
    };

    return (
      <div style={{margin: 5, marginTop: '-1.5em'}}  className="feed">
        <div>
          <div  style={{overflow: 'scroll',marginBottom: '10%',background: '#FFFFFF',position: 'absolute',zIndex: 100, maxWidth: 840, height: '100vh',borderRight: '1px solid rgba(0,0,0,0.25)'}} className="col-md-8 row">
            {postContent}

          </div>
          <div className="row">
            <div className="col-md-4">

            </div>
              <div style={{height: '100vh', width: '100vh', right: 5,top: 0}} className="col-md-8">
                {mapContent}
              </div>
          </div>
        </div>
      </div>
    );
  }
}

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  post: state.post,
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, { getPosts, getCurrentProfile })(Posts);
