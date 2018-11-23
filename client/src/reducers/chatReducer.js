import {
  ADD_CHAT,
  GET_CHAT,
  GET_CHATS,
  CHAT_LOADING,
} from '../actions/types';

const initialState = {
  chats: [],
  chat: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CHAT_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_CHATS:
      return {
        ...state,
        chats: action.payload,
        loading: false
      };
    case GET_CHAT:
      return {
        ...state,
        chat: action.payload,
        loading: false
      };
    case ADD_CHAT:
      return {
        ...state,
        chats: [action.payload, ...state.chats]
      };
    default:
      return state;
  }
}
