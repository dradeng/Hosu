import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import { Redirect } from 'react-router-dom';
import PostForm from './PostForm';
import PostFeed from './PostFeed';
import Spinner from '../common/Spinner';
import { getPosts } from '../../actions/postActions';
import { getCurrentProfile } from '../../actions/profileActions';
import MapContainer from "../map/MapContainer";
import Month from '../availability/Month';

class Posts extends Component {
  componentDidMount() {
    this.props.getPosts();
    this.props.getCurrentProfile();
  }

  render() {
    const {user} = this.props.auth;

    if (!user.profile) {
      return <Redirect to='/dashboard' />
    }
    const { posts, loading } = this.props.post;
    const { profile } = this.props.profile;

    let postContent;
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
    if (profile === null) {
      address = {
        latitude: 34.05,
        longitude: -118.644
      };
    } else {
      address = {
        latitude: profile.latitude,
        longitude: profile.longitude
      };
    }

    if (posts === null || loading || profile === null) {
      postContent = <Spinner />;
    } else {
      console.log("prpfoiel inside" + profile);
      postContent = <PostFeed profile={profile} addressBounds={address} posts={posts} />;
    }

    return (
      <div style={{margin: 5, marginTop: '-1.5em'}}  className="feed">
        <div>
          <div  style={{overflow: 'scroll',marginBottom: '10%',background: '#FFFFFF',position: 'absolute',zIndex: 100, maxWidth: 840, height: '100vh',borderRight: '1px solid rgba(0,0,0,0.25)'}} className="col-md-8 row">
            {postContent}

          </div>
          <div className="row">
            <div className="col-md-4">

            </div>
              <div style={{height: '100vh',width: '100vh', right: 5,top: 0}} className="col-md-8">
                <MapContainer id="map" address={address} geojson={geojson}/>
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
