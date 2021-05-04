import * as ips from '../types/inPersonServiceTypes';

const initialState = {
    service: "",
    current: "",
    params: []
};

export default function inPersonServiceReducers (state = initialState, { type, payload }) {
    switch (type) {
        case ips.SET_IN_PERSON_SERVICE:
            return { ...state, service: payload };
        case ips.SET_CURRENT_IN_PERSON_SERVICE_USER:
            return { ...state, current: payload };
        case ips.SET_PARAMS_IN_PERSON_SERVICE:
            return { ...state, params: payload };
        default:
            return state;
    }
};
