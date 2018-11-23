import axios from 'axios';

import {
  ADD_MESSAGE,
  GET_MESSAGE,
  GET_MESSAGES,
  MESSAGE_LOADING,
  CLEAR_MESSAGE_ERRORS,
  GET_MESSAGE_ERRORS

} from './types';

// Add Post
export const addMessage = messageData => dispatch => {
  dispatch(clearMessageErrors());
  axios
    .post('/api/messages', messageData)
    .then(res =>
      dispatch({
        type: ADD_MESSAGE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_MESSAGE_ERRORS,
        payload: err.response.data
      })
    );
};
// Get Posts
export const getMessages = () => dispatch => {
  dispatch(setMessageLoading());
  axios
    .get('/api/messages')
    .then(res =>
      dispatch({
        type: GET_MESSAGES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_MESSAGES,
        payload: null
      })
    );
};

// Get Post
export const getMessage = id => dispatch => {
  dispatch(setMessageLoading());
  axios
    .get(`/api/messages/${id}`)
    .then(res =>
      dispatch({
        type: GET_MESSAGE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_MESSAGE,
        payload: null
      })
    );
};

// Profile loading
export const setMessageLoading = () => {
  return {
    type: MESSAGE_LOADING
  };
};
// Clear errors
export const clearMessageErrors = () => {
  return {
    type: CLEAR_MESSAGE_ERRORS
  };
};
