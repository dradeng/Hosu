import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { addMessage } from '../../actions/chatActions';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';


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

    const { chat, loading } = this.props;
    const { user } = this.props.auth;

    let messageContent;
    messageContent = chat.messages.map(
      message =>
      {
          if (user.id == message.sender)
          {
              return <div style={{marginBottom: 15}} align="right">
                  <span style={{boxShadow: '0 1px 0.5px rgba(0, 0, 0, 0.13)', padding: 8, paddingLeft: 10, paddingRight: 10, background: '#E1FAF5', borderRadius: 5}} key={message._id}  > {message.content} </span>
              </div>
          }
          else{
              return <div align="left" style={{margin: 5}} > <span style={{boxShadow: '0 1px 0.5px rgba(0, 0, 0, 0.13)', padding: 8, paddingLeft: 10, paddingRight: 10,  background: '#F5F5F5', borderRadius: 5}} key={message._id}  key={message._id} > {message.content} </span>
              </div>
          }
      }
    );

    return (
      
        <div>
          User1:
          {chat.user1Name}<br />
          User2:
          {chat.user2Name}<br />
          Messages:
          <br />
          {messageContent}
          <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <TextAreaFieldGroup
                  placeholder="Send Message"
                  name="content"
                  value={this.state.content}
                  onChange={this.onChange}
                />
              </div>
              <button type="submit" className="btncustom btn">
                Submit
              </button>
            </form>
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
  chatId: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { addMessage })(Chat);
