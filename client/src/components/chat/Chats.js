
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import ChatFeed from './ChatFeed';
import { getChats } from '../../actions/chatActions';
import { getCurrentProfile } from '../../actions/profileActions';
import Spinner from '../common/Spinner';

class Chats extends Component {
  componentDidMount() {
    this.props.getChats();
    this.props.getCurrentProfile();
  }
  render() {

    const { user } = this.props.auth;
    const { chats, loading } = this.props.chat;
    const { profile } = this.props.profile;
    let chatContent;
   
    if(user === null || chats === null || loading || profile === null) {
      chatContent = <Spinner />;

    } else {

      if(!user.profile && profile === null) {
        return <Redirect to='/dashboard' />;
      }
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
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  chat: state.chat,
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, { getChats, getCurrentProfile })(Chats);