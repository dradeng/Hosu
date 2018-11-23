import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import PostForm from './PostForm';
import PostFeed from './PostFeed';
import Spinner from '../common/Spinner';
import { getPosts } from '../../actions/postActions';
import MapContainer from "../map/MapContainer";

import Month from '../availability/Month';


class Posts extends Component {
  componentDidMount() {
    this.props.getPosts();
  }

  render() {
      const { posts, loading } = this.props.post;
    let postContent;
      var geojson = [];
      geojson['type'] = 'FeatureCollection';
      geojson['features'] = [];

      for (var k in posts) {
          if (!posts[k].latitude)
          {
            continue;
          }
          /*
          var newFeature = {
              "type": "Feature",
              "geometry": {
                  "type": "Point",
                  "coordinates": [parseFloat(posts[k].latitude), parseFloat(posts[k].longitude)]
               },
          "properties": {
              "title": posts[k].title,
                  "description": posts[k].text
          }
      }

          geojson['features'].push(newFeature);
*/
          geojson.push(posts[k]);
      }


    if (posts === null || loading) {
      postContent = <Spinner />;
    } else {
      postContent = <PostFeed  posts={posts} />;
    }

    return (
      <div style={{margin: 5, marginTop: '-1.5em'}}  className="feed">
        <div >
            <div  style={{overflow: 'scroll',marginBottom: '10%',background: '#FFFFFF',position: 'absolute',zIndex: 100, maxWidth: 840, height: '100vh',borderRight: '1px solid rgba(0,0,0,0.25)'}} className="col-md-8 row">
                {postContent}

            </div>
          <div className="row">
            <div className="col-md-4">

            </div>
              <div style={{height: '100vh',width: '100vh', right: 5,top: 0}} className="col-md-8">
                  <MapContainer id="map" geojson={geojson}/>
              </div>
          </div>
        </div>
      </div>
    );
  }
}

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.post,

});

export default connect(mapStateToProps, { getPosts })(Posts);
