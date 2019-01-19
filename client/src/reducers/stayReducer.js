import {
  STAY_LOADING,
} from '../actions/types';

const initialState = {
  stay: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
      default:
          return state;
  }
}