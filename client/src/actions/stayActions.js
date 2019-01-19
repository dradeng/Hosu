import axios from 'axios';

import {
  GET_STAY_ERRORS,
  CLEAR_STAY_ERRORS,
  STAY_LOADING,
} from './types';

// Add Post
export const addStay = (stayData, history) => dispatch => {
  dispatch(clearStayErrors());
  axios
    .post('/api/stays', stayData)
    .then(res => history.push('/dashboard'))
    .catch(err =>
      dispatch({
        type: GET_STAY_ERRORS,
        payload: err.response.data
      })
    );
};


// STAY loading
export const setStayLoading = () => {
  return {
    type: STAY_LOADING
  };
};
// Clear errors
export const clearStayErrors = () => {
  return {
    type: CLEAR_STAY_ERRORS
  };
};