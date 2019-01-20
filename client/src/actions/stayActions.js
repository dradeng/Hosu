import axios from 'axios';

import {
  GET_STAY_ERRORS,
  CLEAR_STAY_ERRORS,
  STAY_LOADING,
  GET_STAYS,
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
// Get Stays
export const getStays = () => dispatch => {
  dispatch(setStayLoading());
  axios
    .get('/api/stays')
    .then(res =>
      dispatch({
        type: GET_STAYS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_STAYS,
        payload: null
      })
    );
};
export const updateStay = (updatedDate) => dispatch => {
  dispatch(clearStayErrors());
  axios
    .post('/api/stays/update')
    .then(res =>
      dispatch({
        type: GET_STAYS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_STAYS,
        payload: null
      })
    );
}

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