import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {Carousel} from 'react-responsive-carousel';
import { Link } from 'react-router-dom';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { Textfit } from 'react-textfit';
import { addLike, removeLike } from '../../actions/postActions';
import { addFavorite, getCurrentProfile } from '../../actions/profileActions';
import Month from '../availability/Month';

class PostItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      favorited: false,
      hover: false
    }
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
  }
  componentDidMount() {
 
    this.props.getCurrentProfile();
    const { post } = this.props;
    const { profile, loading } = this.props.profile;

    if(profile !== null && profile.favorites !== undefined) {

      if (profile.favorites.includes(post._id)) {

        this.setState({favorited: true});
      }

    }
  }
  onMouseEnter(e) {
    const { post } = this.props;
    console.log('entering');
    this.setState({ hover: !this.state.hover});
    this.props.updateParentPostFeed(post._id);
  }
  onMouseLeave(e) {
    console.log('exiting');
    this.setState({ hover: !this.state.hover});
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
    const { post, auth } = this.props;

    
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
      </div>) );

    let endDateContent = null;
    var startString = '';
    var endString = '';
    var format = { month : 'short', day : 'numeric' };

    startString = new Date(post.startDate).toLocaleDateString('en-US', format);
    

    var title = post.title;

    if(title.length > 26) {
      title = title.substring(0,29) + '...'
    }


    if(post.endDate != null && post.endDate.length > 1){
      endString = new Date(post.endDate).toLocaleDateString('en-US', format);
      endDateContent = <Month period="end" month={endString}/>
    }

      return (
          <div className="card card-body mb-3 col-md-6 feedTile" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
            <div className="row">
                  <div className="col-md-2">
                      <Link to={`/profile/${post.profile}`}>
                          <img
                              className="rounded-circle d-none d-md-block postImage"
                              src={post.avatar}
                              alt=""
                          />
                      </Link>
                  </div>
                  <div className="col-md-10">
                      <div style={{minHeight: 49}} className="row">
                          <div className="lead col-md-9">
                              <Textfit
                                  mode="single"
                                  forceSingleModeWidth={false}>
                                  {title}
                                  </Textfit></div>
                          <div className="col-md-1">
                              
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
                <div style={{height:'40%',borderRadius: 5}}>
                  <Carousel showThumbs={false}  showIndicators={false} showStatus={false}>

                      {allImage}
                  </Carousel>
                  <div>
                    <div class="row" style={{position: 'absolute',textShadow: '0 .5px 0 rgba(0,0,0,0.6)', bottom: 50, left: 40, color: '#FFFFFF'}}>
                      <p className="priceTag">${post.rent}</p>

                    </div>
                  </div>
                </div>
              </div>
              <div className="row" style={{position: 'absolute', top: '20%', right: '10%',}}>
                  <Month period="start" month={startString}/>
                  {endDateContent}
              </div>
  
              <Link to={`/post/${post._id}`} className="btn btncustom">
                  Comments
              </Link>
              </div>

      );
  }
}

PostItem.propTypes = {
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

export default connect(mapStateToProps, { addLike, removeLike, addFavorite, getCurrentProfile })(
  PostItem
);
