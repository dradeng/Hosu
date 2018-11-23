import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import Spinner from '../common/Spinner';
import { Link } from 'react-router-dom';
import openSocket from 'socket.io-client';
import update from 'immutability-helper';
import { addMessage, getChat  } from '../../actions/chatActions';
import { getPost } from '../../actions/postActions';
import { getProfileByID, getCurrentProfile } from '../../actions/profileActions';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import ChatProfile from './ChatProfile';

var newMessages = [];

class ChatItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      errors: {},
      socketMessages: [],
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.getChat(this.props.match.params.id);
    this.props.getCurrentProfile();
    if (this.props.location.user2) {
        this.props.getProfileByID(this.props.location.user2);
    }

  }
  setMessage = (message) => {

    var key = require('uuid/v4');

    
    const newMessage = {
      content: message.content,
      sender: message.sender,
      date: Date.now
    };

    newMessages.push(newMessage);
    this.setState({ socketMessages: newMessages});
    
  }
  onSubmit(e) {
    e.preventDefault();

    const { user } = this.props.auth;
    const { chatId } = this.props;
    const { chat } = this.props.chat;

    const newMessage = {
      content: this.state.content,
      sender: user.id,
      date: Date.now,
      chat: chat._id
    };
    const newMessage2 = {
      content: this.state.content,
      sender: user.id,
      date: Date.now,
    };
    const socket = openSocket('http://localhost:5000');//NEED TO NOT HARD CODE THIS

    socket.emit('addMessage', newMessage); // change 'red' to this.state.color


    this.props.addMessage(chat._id, newMessage2);
    
    //Might try later to getchat non-noticably later. Not super important but could save so many messages
    //be saved on client side
    //this.props.getChat(this.props.match.params.id);
    this.setState({ content: '' });
    newMessages = [];
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }
  render() {

    const { chat, loading } = this.props.chat;
    const { user } = this.props.auth;
      if (chat.user2 && !this.props.profile) {
          this.props.getProfileByID(chat.user2);

      }

    if (this.props.profile)
    {
      if (this.props.profile.posts) {
          this.props.getPost(this.props.profile.posts[this.props.profile.posts.length -1]);
      }
    }
    const socket = openSocket('http://localhost:5000');//NEED TO NOT HARD CODE THIS
    var call = 'addMessage'+chat._id;
    socket.on(call, (message) => {
      
      this.setMessage(message);

    });


    let messageContent;
    let socketMessagesContent;
    let lastMessage = "";

    if (chat === null || loading || Object.keys(chat).length === 0) {
      messageContent = <Spinner />;
    }
    else {
      messageContent = chat.messages.slice(0).reverse().map(
        message => 
        {
           let formattedDate =  this.formatAMPM(new Date(message.date));
          lastMessage = message.content;
          if (user.id == message.sender)
          {
            return <div className="row" style={{marginBottom: 15}} align="right">
                <div className="col-md-11">
                    <span style={{boxShadow: '0 1px 0.5px rgba(0, 0, 0, 0.13)', padding: 8, paddingLeft: 10, paddingRight: 10, background: '#E1FAF5', borderRadius: 5}} key={message._id}  > {message.content} </span>
                    <div style={{fontSize: 9, marginTop: 4, color: '#B4B4B4'}}> {formattedDate} </div>
                </div>
                <div className="col-md-1">
                    {this.props.myprofile &&
                    <img
                        className="rounded-circle d-none d-md-block postImage"
                        src={this.props.myprofile.user.avatar}
                        style={{width: 25, height: 25}}
                        alt=""
                    />
                    }
                </div>

            </div>
          }
          else{
              return
              <div className="row" align="left" style={{margin: 5}}>
                  <div className="col-md-1">
                      {this.props.profile &&

                      <img
                          className="rounded-circle d-none d-md-block postImage"
                          src={this.props.profile.user.avatar}
                          style={{width: 25, height: 25}}
                          alt=""
                      />
                      }
                  </div>
                  <div className="col-md-11">
                  <span style={{
                      boxShadow: '0 1px 0.5px rgba(0, 0, 0, 0.13)',
                      padding: 8,
                      paddingLeft: 10,
                      paddingRight: 10,
                      background: '#F5F5F5',
                      borderRadius: 5
                  }} key={message._id} key={message._id}>
                      {message.content} </span>
                      <div style={{fontSize: 8, marginTop: 4, color: '#B4B4B4'}}> {formattedDate} </div>
                  </div>
              </div>
          }
        }
      );
    }
  
    var oldMessage = '';
    //Socket.io does something weird where it will try to add alot of messages
    socketMessagesContent = newMessages.map(message => { 
      
        if(oldMessage != message.content && message.content != lastMessage) {
           
          oldMessage = message.content;

          if (user.id == message.sender)
          {
            return <p align="right"  key={message._id}>{message.content}</p>
          } else {
            return <p align="left"  key={message._id}>{message.content}</p>
          }
        }
      }
    );
    return (
        <div className="row">
            {this.props.profile ?
            <div style={{border: 'solid 0.1px rgba(112, 112, 112, 0.51)', padding: 10}} className="col">
                <ChatProfile post={this.props.post} profile={this.props.profile}/>
            </div>
                :
                <div>
                    <Spinner />
                </div>
            }
            <div  className="col" >


                <br/>
                <div style={{height: '65vh', overflow: 'scroll',paddingRight: 20, paddingBottom: 5, paddingTop: 5
                }}>
                {messageContent}
                </div>
                {socketMessagesContent}
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <TextAreaFieldGroup
                            placeholder="Send Message"
                            name="content"
                            value={this.state.content}
                            onChange={this.onChange}
                        />
                    </div>
                    <button type="submit" className="btn btn-dark">
                        Send
                    </button>
                </form>
            </div>
        </div>
      
    );
  }
}
ChatItem.defaultProps = {
  showActions: true
};

ChatItem.propTypes = {
  addMessage: PropTypes.func.isRequired,
  getChat: PropTypes.func.isRequired,
  getProfileByID: PropTypes.func.isRequired,
    getCurrentProfile: PropTypes.func.isRequired,
  getPost: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  chat: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  myprofile: PropTypes.object.isRequired,
  chatId: PropTypes.string.isRequired,

};

const mapStateToProps = state => ({
  auth: state.auth,
  chat: state.chat,
  profile: state.profile.chatprofile,
  myprofile: state.profile.profile,
  post: state.post.post,
});

export default connect(mapStateToProps, { addMessage, getProfileByID, getCurrentProfile,  getChat, getPost })(ChatItem);
