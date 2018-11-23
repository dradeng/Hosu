import axios from 'axios';

import {
  ADD_CHAT,
  GET_CHAT,
  GET_CHATS,
  CHAT_LOADING,
  CLEAR_CHAT_ERRORS,
  GET_CHAT_ERRORS

} from './types';

// Add Post
export const addChat = chatData => dispatch => {
  dispatch(clearChatErrors());
  axios
    .post('/api/chats', chatData)
    .then(res =>
      dispatch({
        type: ADD_CHAT,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_CHAT_ERRORS,
        payload: err.response.data
      })
    );
};

// Get Posts
export const getChats = () => dispatch => {
  dispatch(setChatLoading());
  axios
    .get('/api/chats')
    .then(res =>
      dispatch({
        type: GET_CHATS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_CHATS,
        payload: null
      })
    );
};

// Get Chat
export const getChat = id => dispatch => {
  dispatch(setChatLoading());
  axios
    .get(`/api/chats/${id}`)
    .then(res => {
      dispatch({
        type: GET_CHAT,
        payload: res.data
      });
      
      }
    )
    .catch(err => {
      dispatch({
        type: GET_CHAT,
        payload: null
      });

      }
    );
};
// Add Comment
export const addMessage = (chatId, messageData) => dispatch => {
  dispatch(clearChatErrors());
  axios
    .post(`/api/chats/${chatId}`, messageData)
    .then(res =>
      dispatch({
        type: GET_CHAT,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_CHAT_ERRORS,
        payload: err.response.data
      })
    );
};


// Profile loading
export const setChatLoading = () => {
  return {
    type: CHAT_LOADING
  };
};
// Clear errors
export const clearChatErrors = () => {
  return {
    type: CLEAR_CHAT_ERRORS
  };
};

