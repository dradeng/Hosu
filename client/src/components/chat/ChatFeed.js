import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Chat from './Chat';
import { Link } from 'react-router-dom';

class ChatFeed extends Component {
  render() {
    const { chats, chatId } = this.props;


    let chatContent;
    if(chats.length === 0) {
      chatContent = <div>You have no messages. Start exploring the world and messaging landlords for chats to appear here!</div>;
    } else {
      chatContent = chats.map(chat => 
        <Link style={{ 
          "textDecoration":"none",
          display:'inline-block', 
          paddingLeft:40,
          width:"100%",borderStyle: 'solid',
          color: '#B4B4B4',
          borderWidth: '0px 0px 1px 0px', 
          boxShadow: 'none'}}
          to={`/chat/${chat._id}`}
        >
          <Chat key={chat._id} chat={chat} className="chat" chatId={chatId} />
        </Link>
      );
    }

    return (
      <div>
        {chatContent}
      </div>
    );
  }
}

ChatFeed.propTypes = {
  chats: PropTypes.array.isRequired,
  chatId: PropTypes.string.isRequired
};

export default ChatFeed;