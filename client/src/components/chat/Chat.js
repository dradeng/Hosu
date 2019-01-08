import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addMessage } from '../../actions/chatActions';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      userImage: '',
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {

    const { user } = this.props.auth;

    const { chat, loading } = this.props;
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
      user1:  chat.user1,
      user2: chat.user2
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
    let recieverSrc;
    if(user.id === chat.user1){

      reciever = <p className="chatName">{chat.user2Name}</p>;
      recieverSrc = chat.user2ProfilePic;
 
    } else {

      reciever = <p className="chatName">{chat.user1Name}</p>;
      recieverSrc = chat.user1ProfilePic;
    }

    recieverImage = <img
      className="rounded-circle"
      src={recieverSrc}
      style={{ borderRadius: '50%', height: '100px', width: '100px', marginRight: '5px' }}
      title="You must have a Gravatar connected to your email to display an image" />;


    let messageContent;
    let count = 0;
    messageContent = chat.messages.map(
      message => 
      {   
          while(count < 1) { 
            count += 1;
            return <p style={{marginLeft: '15px'}} key={message._id} className="chatPreview" message={message}> {message.content} </p> 
          }
      }
    );
    return (
      
        <div class="row">
          <div style={{padding: '15px'}} class="column">
            {recieverImage}
          </div>
          <div style={{marginTop: '30px' }}class="column">
            {reciever}
            {messageContent}
          </div>
          <br />
        </div>
      
    );
  }
}
Chat.defaultProps = {
  showActions: true
};

Chat.propTypes = {
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

export default connect(mapStateToProps, { addMessage })(Chat);
