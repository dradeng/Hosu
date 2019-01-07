import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import { addMessage, getChat } from '../../actions/chatActions';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';

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
      date: new Date(),
    };

    var newArray = this.state.socketMessages.slice();    
    newArray.push(newMessage);      
    this.setState({ socketMessages: newArray});
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
    //const socket = io('http://localhost:5000');
    const socket = io.connect('https://salty-plateau-48594.herokuapp.com');//NEED TO NOT HARD CODE THIS
  
    socket.emit('addMessage', newMessage); // change 'red' to this.state.color


    this.props.addMessage(chat._id, newMessage2);
    
    //Might try later to getchat non-noticably later. Not super important but could save so many messages
    //be saved on client side
    //this.props.getChat(this.props.match.params.id);
    this.setState({ content: '' });
    this.setState({ socketMessages: [] });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  render() {

    const { chat, loading } = this.props.chat;
    const { user } = this.props.auth;
    
    //const socket = io('http://localhost:5000');
    const socket = io.connect('https://salty-plateau-48594.herokuapp.com');
   

    var call = 'addMessage'+chat._id;
    socket.on(call, (message) => {
      
      this.setMessage(message);

    });

    let receiverName;
    let recieverImage;
    let recieverSrc;




    let messageContent;
    let socketMessagesContent;
    let lastMessage = "";

    if (chat === null || loading || Object.keys(chat).length === 0) {
      messageContent = <Spinner />;
    }
    else {


      if(user.id === chat.user1){
        receiverName = chat.user2Name;
        recieverSrc = chat.user2ProfilePic;
      } else {
        receiverName = chat.user1Name;
        recieverSrc = chat.user1ProfilePic;
      }

      
      recieverImage = <img
        className="rounded-circle"
        src={recieverSrc}
        style={{ borderRadius: '50%', height: '100px', width: '100px', marginRight: '5px' }}
        title="You must have a Gravatar connected to your email to display an image" />;

      


      // DATE SETUP IS DIFFERENT FOR SOCKET SERVER MESSAGES AND THOSE SAVED TO DB
      // FASTER TO DO DATE.NOW FOR THOSE SAVING TO THE DB
      // AND HAVE TO DO NEW DATE FOR THOSE COMING FROM THE SOCKET SERVER SO CLIENT CAN
      // INTERPET WHATS GOING ON.
      // REASON DOING THIS IS BECAUSE DATE.NOW IS NaN UNTIL SAVED TO THE DB, SO HAVE TO 
      // DO NEW DATE FOR SOCKET SERVER MESSAGES 

      messageContent = chat.messages.map(
        message => 
        { 
          let formattedDate =  this.formatAMPM(new Date(message.date));
          lastMessage = message.content;
          if (user.id === message.sender)
          {
            return (
              <div className="row" style={{marginBottom: 15}} align="right">
                <div className="col-md-11">
                  <span style={{boxShadow: '0 1px 0.5px rgba(0, 0, 0, 0.13)', padding: 8, paddingLeft: 10, paddingRight: 10, background: '#C6DEFF', borderRadius: 5}} key={message._id} > {message.content} </span> 
                  <div style={{fontSize: 9, marginTop: 4, color: '#B4B4B4'}}> {formattedDate} </div>
                </div>
              </div>
            );
          }
          else{
            return (
              <div className="row" style={{marginBottom: 15}} align="left">
                <div className="col-md-11">
                  <span style={{boxShadow: '0 1px 0.5px rgba(0, 0, 0, 0.13)', padding: 8, paddingLeft: 10, paddingRight: 10, background: '#C6DEFF', borderRadius: 5}} key={message._id} > {message.content} </span> 
                  <div style={{fontSize: 9, marginTop: 4, color: '#B4B4B4'}}> {formattedDate} </div>
                </div>
              </div>
            );
          }
        }
      );
    }
  
    var oldMessage = '';
   

    //THIS IS THE MESSAGES NOT IN THE DB YET BUT THE SOCKET SERVER PICKS
    //UP A NEW EMIT AND ADDS IT TO STATE
    socketMessagesContent = this.state.socketMessages.map(message => { 
      
        if(oldMessage !== message.content && message.content !== lastMessage) {
         
          oldMessage = message.content;
          let oldFormattedDate =  this.formatAMPM(message.date);
          if (user.id === message.sender)
          {
            return (
              <div className="row" style={{marginBottom: 15}} align="right">
                <div className="col-md-11">
                  <span style={{boxShadow: '0 1px 0.5px rgba(0, 0, 0, 0.13)', padding: 8, paddingLeft: 10, paddingRight: 10, background: '#C6DEFF', borderRadius: 5}} key={message._id} > {message.content} </span> 
                  <div style={{fontSize: 9, marginTop: 4, color: '#B4B4B4'}}> {oldFormattedDate} </div>
                </div>
              </div>
            );
          } else {
            return (
              <div className="row" style={{marginBottom: 15}} align="left">
                <div className="col-md-11">
                  <span style={{boxShadow: '0 1px 0.5px rgba(0, 0, 0, 0.13)', padding: 8, paddingLeft: 10, paddingRight: 10, background: '#C6DEFF', borderRadius: 5}} key={message._id} > {message.content} </span> 
                  <div style={{fontSize: 9, marginTop: 4, color: '#B4B4B4'}}> {oldFormattedDate} </div>
                </div>
              </div>
            );
          }
        }
      }
    );

    return (
      
        <div>
      
          <span>
            {recieverImage}
            {receiverName}
          </span>
          <br />
          <br />

          {messageContent}
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
