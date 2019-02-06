import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {Carousel} from 'react-responsive-carousel';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Textfit } from 'react-textfit';
import { addLike, removeLike } from '../../actions/postActions';
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

    if(profile !== null && profile.favorites !== undefined) {

      if (profile.favorites.includes(post._id)) {
        this.setState({favorited: true});
      }
    }
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

    var approveContent;
    var stay = this.props.stay;
    const { profile, loading } = this.props.profile;

    let starContent = null
    if(profile != null) {

      if(this.state.favorited) {
        starContent = <FaStar/>
      } else {
        starContent = <FaRegStar/>
      }
      
    }

    if(!stay.decided) {
      approveContent = (
        <div style={{backgroundColor: 'rgb(255, 142, 127)', borderRadius: 5, position:'absolute', right: 35, top: 85, color: 'white'}}>
          <div style={{margin: 5}}>
            Awaiting Approval
          </div>
        </div>
      );
    }

    const allImage = post.images.map((item, index) => (
        <div>
            <div style={{height: '100%', paddingTop: '66%', borderRadius: 20, backgroundSize: 'cover', backgroundPosition: 'center center', backgroundImage: 'url("' + item + '")'}}>
              {approveContent}
            </div>
        </div>)
    );

    var options = { weekday: 'long', month: 'short', day: 'numeric' };
    var start = new Date(stay.startDate).toLocaleDateString("en-US", options);
    var end = new Date(stay.endDate).toLocaleDateString("en-US", options);


    var dateContent = (
      <div>
        {start} to {end}
      </div>
    );

    return (
      <div className="card card-body feedTile">
        <div className="row">
          <div className="col-md-10">
            <div style={{minHeight: 49}} className="row">
              <div className="lead col-md-9">
                <Textfit
                  mode="single"
                  forceSingleModeWidth={false}>
                  {post.title}
                </Textfit></div>
              
                {post.user !== auth.user.id ? (

                  <div style={{fontSize: 22, color: '#fac71e'}}  onClick={this.onFavorite.bind(this, auth.user.id, post._id)}>
                    
                    {starContent}

                  </div>
                  ): null 
                }
              </div>
            </div>
          </div>
          <div>

          <div style={{height:'50%',borderRadius: 20}}>
              {allImage}
          </div>
          <div style={{height: 100}}>
            <div style={{display: 'inline-block'}}>
              <Link style={{display: 'inline-block', margin: 5}} to={`/profile/${post.profile}`}>
                <img
                  className="rounded-circle d-none d-md-block"
                  style={{width: 50, height: 50}}
                  src={post.avatar}
                  alt=""
                />
              </Link>
              <div style={{display: 'inline-block', verticalAlign: 'top', paddingTop: 20}}>
                  
                  <div style={{verticalAlign: 'top'}}>
                    <div className="lead">
                      <Textfit
                        mode="single"
                        forceSingleModeWidth={false}>
                        {dateContent}
                      </Textfit>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
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