import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Chat from './Chat';
import ChatItem from './ChatItem';
import ChatboxLink from './ChatboxLink.js';

class ChatFeed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentChatID: '',
            chat: '',
        };
    }

        render(){
            const {chats, chatId} = this.props;
           
            return (
                <div className="row">

                    <div style={{height: '80vh', marginLeft:20,
                        padding:0,borderRight: '1px solid rgba(0,0,0,0.25)',marginTop: -25}} className="col-md-2">
                        {chats.map(chat =>
                            <Link to={{pathname: `/chat/${chat._id}`, user2: chat.user2}}  className="btncustom btn btn-info mr-1">
                                <Chat key={chat._id} chat={chat} chatId={chatId} />
                            </Link>)

                        }
                    </div>
                    <div className="col-md-8">
                        { this.state.currentChatID &&
                            <Chat key={this.state.currentChatID} chat={this.state.chat}
                                  chatId={this.state.currentChatID}/>
                        }
                    </div>
                </div>
            );
        }

}

ChatFeed.propTypes = {
  chats: PropTypes.array.isRequired,
  chatId: PropTypes.string.isRequired
};

export default ChatFeed;
/*<Link to={`/chat/${chat._id}`} className="btn btn-info mr-1">
        <Chat key={chat._id} chat={chat} chatId={chatId} />
    </Link>)
    */

/*

ChatItem.propTypes = {
  addMessage: PropTypes.func.isRequired,
  getChat: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  chat: PropTypes.object.isRequired,
  chatId: PropTypes.string.isRequired,
};
 */