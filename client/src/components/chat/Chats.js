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
 
    const { chats, loading } = this.props.chat;
    let chatContent;
   
    if(chats === null || loading) {
      chatContent = <Spinner />;

    } else {
      chatContent = <ChatFeed chats={chats} />;
    }

    return (
      <div style={{flex: 1}}>
        
        {chatContent}
       

      </div>
    );
  }
}


Chats.propTypes = {
  getChats: PropTypes.func.isRequired,
  chat: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  chat: state.chat
});

export default connect(mapStateToProps, { getChats })(Chats);