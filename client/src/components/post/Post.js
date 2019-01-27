import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import NonFeedPostItem from '../posts/NonFeedPostItem';
import CommentForm from './CommentForm';
import CommentFeed from './CommentFeed';
import MapContainer from "../map/MapContainer";
import Spinner from '../common/Spinner';
import { getPost } from '../../actions/postActions';
import { addStay } from '../../actions/stayActions';
import { getCurrentProfile } from '../../actions/profileActions';
import { addChat } from '../../actions/chatActions';
import PostCalendar from "./PostCalendar.js";

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user1: null,
      user2: null,
      user1ProfilePic: '',
      user2ProfilePic: '',
      user1Name: '',
      user2Name: '',
      messages: [],
      startDate: null,
      endDate: null
    };
    this.createChat = this.createChat.bind(this);
    this.requestSublet = this.requestSublet.bind(this);
    this.onChangeDates = this.onChangeDates.bind(this);
  }

  componentDidMount() {
    this.props.getPost(this.props.match.params.id);
    this.props.getCurrentProfile();
  }
  onChangeDates(date) {
    this.setState({ startDate: date[0]});
    this.setState({ endDate: date[1]});
  }
  requestSublet() {
    const { post } = this.props.post;
    const { user } = this.props.auth;
    const { profile } = this.props.profile;

    console.log('prof is'+profile._id);
    const request = {
      post: post._id,
      landlord: post.user,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      subtenantProfile: profile._id,
      landlordImage: post.avatar,
      landlordName: post.name,
      landlordProfile: post.profile,
    };
    this.props.addStay(request, this.props.history);
  }
  createChat(e) {
    e.preventDefault();

    const { user } = this.props.auth;
    const { post } = this.props.post;
    const { profile } = this.props.profile;
    const newChat = {
      
      user1: user.id,
      user2: post.user,
      user1ProfilePic: user.profilePic,
      user2ProfilePic: post.avatar,
      user1Name: user.name,
      user2Name: post.name,
      messages: []
      
    };
  
    this.props.addChat(newChat, this.props.history);
    this.setState({ user1: null });
    this.setState({ user2: null });
    this.setState({ user1ProfilePic: '' });
    this.setState({ user2ProfilePic: '' });
    this.setState({ user1Name: '' });
    this.setState({ user2Name: '' });
    this.setState({ messages: [] });
    
  }

  render() {
    const { post, loading } = this.props.post;
    const { profile } = this.props.profile;

    let postContent;
    let calendarContent;


    if (post === null || loading || Object.keys(post).length === 0) {
      postContent = <Spinner />;
    } else {


      var startDate = post.startDate;
      var endDate = post.endDate;
      var now = new Date();

      if(now > startDate) {
        startDate = now;
      }
      postContent = (
        <div>
          <div class="row">
            <NonFeedPostItem class="col-md-4" post={post} showActions={false} style={{float: 'left'}} />
            <div class="col-md-4" style={{float:'right', display: 'flex', alignItems: 'center'}}>
              <div>
                <PostCalendar style={{position:'relative'}} onChangeDates={this.onChangeDates} post={post} startDate={startDate} endDate={endDate}/>
              
                <button onClick={this.requestSublet} style={{position:'relative', maxWidth: 275, display:'block', marginLeft: 'auto', marginRight: 'auto'}} className="btncustom btn btn-block mt-2">
                  Request to Sublet
                </button>
              </div>
            </div>
          </div>

          <span style={{ display: 'block', margin: '15px'}}><b>Minimum Stay: </b>{post.minimumStay} days</span>
          <span style={{ display: 'block', margin: '15px'}}>{post.text}</span>

          <div style={{borderStyle: 'solid',borderWidth:1, borderColor: '#B4B4B4'}}>
            <CommentForm postId={post._id} />
            <CommentFeed postId={post._id} comments={post.comments} />
          </div>
        </div>
      );
    }
    var messageOrEditButtonContent;
    if (profile === null) {
      //do nothing
    } else if (profile.posts.indexOf(post._id) >= 0) {
      messageOrEditButtonContent = <Link to={`/edit-post/${post._id}`} style={{position:'absolute', right:0}} className="btn btn-light">Edit Post</Link>;
    } else {
      messageOrEditButtonContent = <Link to="/chats" onClick={this.createChat} style={{position:'absolute', right:0}} className="btn btn-light mb-3">Message</Link>;
    }

    var address = {
      latitude: post.latitude,
      longitude: post.longitude,
      circle: true
    };



    //THIS WAS ORIGINALLY IN THE RETURN STATEMENT
    //NOT SURE IF I WANT TO INCLUDE THE MAP
    //<div style={{height: '49%',width: '50%', float:'right', marginTop: 122}}>
    // <MapContainer id="map" address={address} geojson={geojson}/>
    //</div>



    //LINK TO CHATS DOES NOT WORK WEIRD
    //HAD TO ADD IT AS HISTORY.PUSH IN CHAT ACTIONS
    //PROBABLY WORKS BEST SINCE THE NEW CHAT NEEDS TO 
    //BE ADDED TO THE DB BEFORE USER IS REDIRECTED
    return (
      <div className="post">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <Link to="/feed" className="btn btn-light mb-3">
                Back To Feed
              </Link>
              
              {messageOrEditButtonContent}
              {postContent}
            </div>   
          </div>
        </div>
      </div>
    );
  }
}

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  addChat: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  chat: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  post: state.post,
  auth: state.auth,
  chat: state.chat,
  profile: state.profile
});


export default connect(mapStateToProps, { getPost, addChat, getCurrentProfile, addStay })(Post);
