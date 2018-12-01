import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Chat from './Chat';
import ChatItem from './ChatItem';
import { Link } from 'react-router-dom';

class ChatFeed extends Component {
  render() {
    const { chats, chatId } = this.props;
    
    return chats.map(chat => 
      <Link to={`/chat/${chat._id}`}>
        <Chat key={chat._id} chat={chat} style={{color: '#B4B4B4'}} className="chat" chatId={chatId} />
      </Link>
    );
  }
}

ChatFeed.propTypes = {
  chats: PropTypes.array.isRequired,
  chatId: PropTypes.string.isRequired
};

export default ChatFeed;