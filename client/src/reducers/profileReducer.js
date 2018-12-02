import {
  GET_PROFILE,
  GET_PROFILES,
  GET_PROFILE_BY_ID,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE
} from '../actions/types';

const initialState = {
  profile: null,
  otherProfile: null,
  profiles: null,
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
      case GET_PROFILE_BY_ID:
          return {
              ...state,
              otherProfile: action.payload,
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
