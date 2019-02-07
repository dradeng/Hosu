import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEmpty from '../../validation/is-empty';
import { addChat } from '../../actions/chatActions';

class ProfileHeader extends Component {
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
  }
  createChat(e) {
    e.preventDefault();

    const { user } = this.props.auth;
    const { profile } = this.props;
    var {history} = this.props;
    const newChat = {
      
      user1: user.id,
      user2: profile.user,
      user1ProfilePic: user.profilePic,
      user2ProfilePic: profile.avatar,
      user1Name: user.name,
      user2Name: profile.name,
      messages: []
      
    };  
    console.log('this ' + history);
  
    this.props.addChat(newChat, history);
    this.setState({ user1: null });
    this.setState({ user2: null });
    this.setState({ user1ProfilePic: '' });
    this.setState({ user2ProfilePic: '' });
    this.setState({ user1Name: '' });
    this.setState({ user2Name: '' });
    this.setState({ messages: [] });
    
  }
  render() {
    const { profile } = this.props;
    const { user } = this.props.auth;
    var buttonContent;
    if(user.id === profile.user) {
      //do nothing
    } else {
      buttonContent = (
        <div>
          <div style={{position: 'absolute', top:5,right:25, opacity: .7}}>
            <Link to="/add-review" className="btn btn-light">
              Add Review
            </Link>
          </div>
          <div style={{position: 'absolute', top:5,right:150, opacity: .7}}>
            <Link to="/chats" onClick={this.createChat} className="btn btn-light">
              Send Message
            </Link>
          </div>
        </div>
      );
    }
    
    return (
      <div>
        <div className="col-md-12">
          <div style={{backgroundImage: `url(${profile.backgroundPic})`, backgroundSize: '100% 100%',height: 315, width: 851}}>
            <div className="row">
              <img
                className="rounded-circle"
                src={profile.avatar}
                style={{width:150, height:150,display: 'block', position: 'absolute', left: 67.5, bottom: -75, border:'4px solid white'}}
                alt="Profile picture"
              />
              {buttonContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ProfileHeader.propTypes = {
  addChat: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { addChat }) (ProfileHeader);
