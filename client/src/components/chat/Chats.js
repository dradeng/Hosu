
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ChatFeed from './ChatFeed';
import { getChats } from '../../actions/chatActions';
import Spinner from '../common/Spinner';

class Chats extends Component {
  componentDidMount() {
    this.props.getChats();
  }
  render() {

    const { user } = this.props.auth;
    const { chats, loading } = this.props.chat;
    let chatContent;
   
    if(user === null || chats === null || loading) {
      chatContent = <Spinner />;

    } else {
      chatContent = <ChatFeed chats={chats} />;
    }

    return (
      <div>
        
        {chatContent}
       

      </div>
    );
  }
}


Chats.propTypes = {
  getChats: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  chat: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  chat: state.chat,
  auth: state.auth,
});

export default connect(mapStateToProps, { getChats })(Chats);