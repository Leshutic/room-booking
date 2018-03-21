import {
    GET_ALL_ROOMS,
    DELETE_ROOM,
    CREATE_ROOM,
} from '../actions/types';

export default function ( state = [], action) {
    switch( action.type) {
        case GET_ALL_ROOMS:
            return  action.payload || false;

        case CREATE_ROOM:
            return [...state, action.payload] || false;

        case DELETE_ROOM:
            return  [...state.filter(({ id }) => id !== action.payload.id)] || false;

        default:
            return state;
    }
}