import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import Spinner from '../common/Spinner';
import { Link } from 'react-router-dom';
import openSocket from 'socket.io-client';
import update from 'immutability-helper';
import { addMessage, getChat } from '../../actions/chatActions';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';

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
  render() {

    const { chat, loading } = this.props.chat;
    const { user } = this.props.auth;
    

    const socket = openSocket('http://localhost:5000');//NEED TO NOT HARD CODE THIS
    var call = 'addMessage'+chat._id;
    socket.on(call, (message) => {
      console.log('client got new message');
      this.setMessage(message);

    });


    let messageContent;
    let socketMessagesContent;
    let lastMessage = "";

    if (chat === null || loading || Object.keys(chat).length === 0) {
      messageContent = <Spinner />;
    }
    else {
      messageContent = chat.messages.map(
        message => 
        { 
          lastMessage = message.content;
          if (user.id == message.sender)
          {
            return <p key={message._id} align="right" > {message.content} </p> 
          }
          else{
            return <p key={message._id} align="left" > {message.content} </p> 
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
      
        <div>
      
          User1: {chat.user1}
          <br />
          User2: {chat.user2}
          <br />
          Messages:
          <br />
          {messageContent}
          SPLITTTTTTTT
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
                Submit
              </button>
            </form>
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
  auth: PropTypes.object.isRequired,
  chat: PropTypes.object.isRequired,
  chatId: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  chat: state.chat
});

export default connect(mapStateToProps, { addMessage, getChat })(ChatItem);
