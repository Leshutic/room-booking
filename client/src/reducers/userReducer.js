import {
    GET_CURRENT_USER,
    GET_ALL_USERS,
    REMOVE_USER_FROM_STATE
} from '../actions/types';

export default function ( state = {}, action) {

    switch( action.type) {
        case GET_CURRENT_USER:
            return  action.payload || false ;

        case REMOVE_USER_FROM_STATE:
            return null || false;

        case GET_ALL_USERS:
            return  {...state, allUsers: action.payload};

        default:
            return state;
    }
}