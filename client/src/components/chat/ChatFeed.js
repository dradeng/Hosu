import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Chat from './Chat';
import ChatItem from './ChatItem';
import { Link } from 'react-router-dom';

class ChatFeed extends Component {
  render() {
    const { chats, chatId } = this.props;
    
    return chats.map(chat => 
      <Link className="chatFeedUnit" style={{"textDecoration":"none", display:'inline-block', paddingLeft:40}} to={`/chat/${chat._id}`}>
        <Chat key={chat._id} chat={chat} className="chat" chatId={chatId} />
      </Link>
    );
  }
}

ChatFeed.propTypes = {
  chats: PropTypes.array.isRequired,
  chatId: PropTypes.string.isRequired
};

export default ChatFeed;