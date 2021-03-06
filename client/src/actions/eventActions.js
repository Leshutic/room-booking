import axios from "axios/index";
import {
    ADD_EVENT,
    DELETE_EVENT,
    EDIT_EVENT,
    GET_EVENTS,
    GET_EVENTS_BY_PM
} from "./types";

export const getEvents = roomID => async (dispatch) => {
    const res = await axios.get(`/api/rooms/${roomID}/events`);
    dispatch({ type: GET_EVENTS, payload: res.data });
};


export const getEventsByInvitationUser = (roomID, userId ) => async (dispatch) => {
    const res = await axios.get(`/api/rooms/${roomID}/eventsByInviteUser/${userId}`);
    console.log("Filter_by_pm");
    dispatch({type: GET_EVENTS, payload: res.data});
};



export const createEvent = newEvent => async (dispatch) => {
    console.log("EVENT_ACTIONS_b", newEvent);
    const res = await axios.post('/api/events', newEvent);
    console.log("EVENT_ACTIONS_a", res.data);
    dispatch({ type: ADD_EVENT, payload:  {newEvent: res.data}});
};

export const editEvent = (eventID, editedEvent) => async (dispatch) => {
    //const res = await axios.put(`/api/events/${eventID}`, editedEvent);
    await axios.put(`/api/events/${eventID}`, editedEvent);
    dispatch({ type: EDIT_EVENT, payload: {newEvent: editedEvent} });
};

export const deleteEvent = eventID => async (dispatch) => {
    //const res = await axios.delete(`/api/events/${eventID}`);
    await axios.delete(`/api/events/${eventID}`);
    dispatch({ type: DELETE_EVENT, payload: eventID });
};



export const getAllEvents = (userId) => async (dispatch) => {
    const res = await axios.get(userId ? `/api/events?userId=${userId}` : '/api/events');
    dispatch({ type: GET_EVENTS, payload: res.data });
};


export const addEventToState = (newEvent, currentRoomId ) => async ( dispatch) => {
    dispatch({ type: ADD_EVENT, payload: { newEvent: newEvent, roomId: currentRoomId }})
};

export const editEventInState = (editedEvent, currentRoomId) => async ( dispatch) => {
    dispatch({ type: EDIT_EVENT, payload: { newEvent: editedEvent, roomId: currentRoomId }})
};

export const deleteEventFromState = (eventID) => async ( dispatch) => {
    dispatch({ type: DELETE_EVENT, payload: eventID})
};



