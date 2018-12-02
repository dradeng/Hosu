import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { addMessage } from '../../actions/chatActions';
import { getProfileByID, getCurrentProfile } from '../../actions/profileActions';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import UserIcon from '../../assets/UserIcon.png';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {

    const { user } = this.props.auth;

    const { chat, loading } = this.props;

    this.props.getCurrentProfile();

    if(user.id == chat.user1){
      console.log('hello'+chat.user2);
      this.props.getProfileByID(chat.user2);
    } else {
      console.log('hello2'+chat.user1);
      this.props.getProfileByID(chat.user1);
    }
  }
  componentWillReceiveProps(newProps) {
    if (newProps.errors) {
      this.setState({ errors: newProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const { user } = this.props.auth;
    const { chatId } = this.props;
    const { chat } = this.props;

    const newMessage = {
      content: this.state.content,
    };
   
    this.props.addMessage(chat._id, newMessage);
    this.setState({ content: '' });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  render() {

    const { chat } = this.props;
    const { user } = this.props.auth;
    const { otherProfile, loading } = this.props.profile;

    let reciever;
    let recieverImage;

    if(user.id == chat.user1){

      reciever = <p className="chatName">{chat.user2Name}</p>;
 
    } else {

      reciever = <p className="chatName">{chat.user1Name}</p>;

    }

    if(otherProfile == null || loading)
    {
      // do nothing
    } else {
      console.log('otherprof'+otherProfile.profilePic);
      if(otherProfile.profilePic !== null) {
        recieverImage = <img
          className="rounded-circle"
          src={otherProfile.profilePic}
          style={{ width: '25px', marginRight: '5px' }}
          title="You must have a Gravatar connected to your email to display an image" />;

      } else {
        recieverImage = <img
          className="rounded-circle"
          src={UserIcon}
          alt={user.name}
          style={{ width: '25px', marginRight: '5px' }}
          title="You must have a Gravatar connected to your email to display an image" />;
      }
    }


    let messageContent;
    let count = 0;
    messageContent = chat.messages.map(
      message => 
      {   
          while(count < 1) { 
            count += 1;
            return <p key={message._id} className="chatPreview" message={message}> {message.content} </p> 
          }
      }
    );
    return (
      
        <div>
          {recieverImage}
          {reciever} 
          {messageContent}
        </div>
      
    );
  }
}
Chat.defaultProps = {
  showActions: true
};

Chat.propTypes = {
  getProfileByID: PropTypes.func.isRequired,
  addMessage: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  chat: PropTypes.object.isRequired,
  otherProfile: PropTypes.object.isRequired,
  chatId: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { addMessage, getProfileByID, getCurrentProfile })(Chat);
