import axios from 'axios';

import {
    GET_PROFILE,
    GET_PROFILES,
    PROFILE_LOADING,
    GET_CURRENT_PROFILE,
    CLEAR_CURRENT_PROFILE,
    GET_ERRORS,
    GET_POST,
    SET_CURRENT_USER,
} from './types';

// Get current profile
export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get('/api/profile')
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        payload: {}
      })
    );
};

// Get profile by id
export const getProfile = id => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get(`/api/profile/${id}`)
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        payload: null
      })
    );
};




// Create Profile
export const createProfile = (profileData, history) => dispatch => {
  //make user have a profile be true in auth router
  axios.post('/api/users/updateUser', profileData);
  axios
    .post('/api/profile', profileData)
    .then(res => history.push('/dashboard'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );

};

// Add Favorite or remove if already favorited
export const addFavorite = (userID, favoriteData) => dispatch => {
    axios
        .post(`/api/profile/favorites/${userID}`, favoriteData)
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
        });
};


// Add review
export const addReview = (reviewData, history) => dispatch => {
    axios
        .post('/api/profile/reviews', reviewData)
        .then(res => history.push('/dashboard'))
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};


// Get all profiles
export const getProfiles = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get('/api/profile/all')
    .then(res =>
      dispatch({
        type: GET_PROFILES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILES,
        payload: null
      })
    );
};


// Update Search location
export const updateSearch = (address, history) => dispatch => {
  dispatch(setProfileLoading());
  axios
    .post('/api/profile/updateSearch', address)
    .then(res => {
      //DO NOT FUCK WITH THIS CODE, VERY PRONE TO BUGS IF CHANGED THE WAY THIS IS HANDLED
      //THE HISTORY PUSH THE USER TO THE FEED NO MATTER WHAT 
      history.push('/feed');
      //THIS MAKES SURE IT GRABS THE LATEST LAT AND LNG
      window.location.reload();
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};



// Delete account & profile
export const deleteAccount = () => dispatch => {
  if (window.confirm('Are you sure? This can NOT be undone!')) {
    axios
      .delete('/api/profile')
      .then(res =>
        dispatch({
          type: SET_CURRENT_USER,
          payload: {}
        })
      )
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  }
};

// Profile loading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};

// Clear profile
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  };
};
