import {
    GET_CURRENT_USER,
    GET_ALL_USERS,
    REMOVE_USER_FROM_STATE,
    ADD_USER_DB,
    DELETE_USER_DB,
} from '../actions/types';

export default function (state = {}, action) {
  switch (action.type) {

      case ADD_USER_DB:
          return { ...state, allUsers: [action.payload, ...state.allUsers]};

      case DELETE_USER_DB:
          return { ...state, allUsers: state.allUsers.filter(({ id }) => id !== action.payload)};


      case GET_CURRENT_USER:
        return action.payload || false;

      case REMOVE_USER_FROM_STATE:
        return null || false;

      case GET_ALL_USERS:
        return { ...state, allUsers: action.payload };

      default:
        return state;
  }
}
