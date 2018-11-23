import {
    ADD_POST,
    GET_POSTS,
    GET_POST,
    DELETE_POST,
    UPDATE_SELECTED_DATE,
    UPDATE_SELECTED_ENDDATE,
    UPDATE_SELECTED_CURRENT,

    POST_LOADING
} from '../actions/types';

const initialState = {
    posts: [],
    post: {},
    currentMonth: new Date(),
    selectedDate: null,
    selectedEndDate: null,
    loading: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case POST_LOADING:
            return {
                ...state,
                loading: true
            };
        case GET_POSTS:
            return {
                ...state,
                posts: action.payload,
                loading: false
            };
        case GET_POST:
            return {
                ...state,
                post: action.payload,
                loading: false
            };
        case ADD_POST:
            return {
                ...state,
                posts: [action.payload, ...state.posts]
            };
        case DELETE_POST:
            return {
                ...state,
                posts: state.posts.filter(post => post._id !== action.payload)
            };
        case UPDATE_SELECTED_CURRENT:
            return {
                ...state,
                currentMonth: action.payload
            };
        case UPDATE_SELECTED_DATE:
            return {
                ...state,
                selectedDate: action.payload
            };
        case UPDATE_SELECTED_ENDDATE:
            return {
                ...state,
                selectedEndDate: action.payload
            };
        default:
            return state;
    }
}
