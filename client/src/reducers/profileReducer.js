import {
  GET_PROFILE,
  GET_PROFILES,
  GET_CHAT_PROFILE,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE
} from '../actions/types';

const initialState = {
  profile: null,
  chatprofile: null,
  profiles: null,
  favoriteProfile: [],
  favoriteHash: {},
    loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
      case PROFILE_LOADING:
          return {
              ...state,
              loading: true
          };
      case GET_PROFILE:
          return {
              ...state,
              profile: action.payload,
              loading: false
          };
      case GET_CHAT_PROFILE:
          return {
              ...state,
              chatprofile: action.payload,
              loading: false
          };
      case GET_PROFILES:
          return {
              ...state,
              profiles: action.payload,
              loading: false
          };
      case CLEAR_CURRENT_PROFILE:
          return {
              ...state,
              profile: initialState
          };
      default:
          return state;
  }
}
