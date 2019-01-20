import {
  STAY_LOADING,
  GET_STAYS,
  ADD_STAY
} from '../actions/types';

const initialState = {
  stay: {},
  stays: [],
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_STAYS:
      return {
        ...state,
        stays: action.payload,
        loading: false
      };
    case ADD_STAY:
      return {
        ...state,
        stays: [action.payload, ...state.stays]
      };
    default:
      return state;
  }
}