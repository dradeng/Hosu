import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {Carousel} from 'react-responsive-carousel';
import ReactDom from 'react-dom';
import { Link } from 'react-router-dom';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { Textfit } from 'react-textfit';

import { deletePost, addLike, removeLike } from '../../actions/postActions';
import { addFavorite, getCurrentProfile } from '../../actions/profileActions';
import Month from '../availability/Month';

class PostItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      favorited: false,
    }
  }
  componentDidMount() {
 
    this.props.getCurrentProfile();
    const { post } = this.props;
    const { profile, loading } = this.props.profile;

    if(profile != null) {

            if (profile.favorites.includes(post._id)) {

                this.setState({favorited: true});
            }

    }
  }
  onDeleteClick(id) {
    this.props.deletePost(id);
  }

  onLikeClick(id) {
    this.props.addLike(id);
  }
  //this covers removing and adding favorite
  onFavorite(userID, postID) {
   
    const { profile, loading } = this.props.profile;

    const newFavorite = {
      favorites: postID,
    };

    if(loading || profile == null)
    {
      //do nothing
    } else {
   
      this.props.addFavorite(userID, newFavorite);
    }

  const fav = this.state.favorited;
  this.setState({ favorited: !fav });


  }
  onUnlikeClick(id) {
    this.props.removeLike(id);
  }
  findUserLike(likes) {
    const { auth } = this.props;
    if (likes.filter(like => like.user === auth.user.id).length > 0) {
      return true;
    } else {
      return false;
    }
  }


  render() {
    const { post, auth, showActions } = this.props;

    
    const { profile, loading } = this.props.profile;

    let starContent = null
    if(profile != null) {

      if(this.state.favorited) {
        starContent = <FaStar/>
      } else {
        starContent = <FaRegStar/>
      }
      
    }
    const allImage = post.images.map((item, index) => (
        <div>
            <div style={{height: '100%', paddingTop: '66%', backgroundSize: 'cover', backgroundPosition: 'center center', backgroundImage: 'url("' + item + '")'}} />
        </div>)
    );
    /*
    <div style={{paddingTop:'66%',backgroundSize: '100% 100%',overflow:'hidden', background: 'url('+item+')'}}>
        </div>
     */
    let endDateContent = null;
    if(post.endDate != null && post.endDate.length > 1){
      endDateContent = <Month period="end" month={post.endDate}/>
    }

      return (
          <div className="card card-body mb-3 col-md-6 feedTile">
            <div className="row">
                  <div className="col-md-2">
                      <a href="profile.html">
                          <img
                              className="rounded-circle d-none d-md-block postImage"
                              src={post.avatar}
                              alt=""
                          />
                      </a>
                  </div>
                  <div className="col-md-10">
                      <div style={{minHeight: 49}} className="row">
                          <div className="lead col-md-9">
                              <Textfit
                                  mode="single"
                                  forceSingleModeWidth={false}>
                                  {post.title}
                                  </Textfit></div>
                          <div className="col-md-1">
                              {showActions ? (
                                  <span>



                              {post.user === auth.user.id ? (
                                  <div
                                      onClick={this.onDeleteClick.bind(this, post._id)}
                                  >
                                      <i style={{fontSize: 22, color: 'red'}} className="fas fa-times"/>
                                  </div>
                              ) : null}
              </span>
                              ) : null}
                          </div>
                          {post.user !== auth.user.id ? (

                          <div style={{fontSize: 22, color: '#fac71e'}}  onClick={this.onFavorite.bind(this, auth.user.id, post._id)}>
                            
                            {starContent}

                          </div> ):
                              null }

                      </div>




                  </div>

              </div>
              <div>

                  <Carousel style={{height:'40%',borderRadius: 5}} showThumbs={false}  showIndicators={false} showStatus={false}>

                      {allImage}
                  </Carousel>

              </div>
              <div className="row" style={{position: 'absolute', top: '25%', right: '10%',}}>
                  <Month period="start" month={post.startDate}/>
                  {endDateContent}
              </div>
                  <div className="row" style={{position: 'absolute',textShadow: '0 .5px 0 rgba(0,0,0,0.6)', bottom: 60, left: 40, color: '#FFFFFF'}}>
                      <i style={{border: '0 1px 0 rgba(0,0,0,0.6)'}} className="fas fa-dollar-sign"/>

                      <p className="priceTag">{post.rent}</p>

                  </div>
              <Link to={`/post/${post._id}`} className="btn btncustom mr-1">
                  Comments
              </Link>
              </div>

      );
  }
}

PostItem.defaultProps = {
  showActions: true
};

PostItem.propTypes = {
  deletePost: PropTypes.func.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  addFavorite: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, { deletePost, addLike, removeLike, addFavorite, getCurrentProfile })(
  PostItem
);
