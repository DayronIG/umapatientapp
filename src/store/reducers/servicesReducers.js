import * as service from '../types/servicesTypes'

/*
    TEMPLATE:

    "id": "",
    "type": "",
    "destination": {
        "address": "",
        "floor": "",
        "lat": "",
        "lon": "",
        "number": ""
    },
    "dt_arrived": "",
    "dt_assign": "",
    "dt_cancel": "",
    "dt_cierre": "",
    "dt_create": "",
    "dt_lab": "",
    "dt_start": "",
    "dt_validate": "",
    "payment": {
        "status": ""
    },
    "eval": {
        "notes": "",
        "nurse_eval": 0,
        "uma_eval": 0
    },
    "lab": {
        "lab": "",
        "lab_date_result": "",
        "observaciones_lab": "",
        "path_doc_lab": "",
        "result_lab": ""
    },
    "patient": {
        "corporate": "",
        "country": "",
        "dni": "",
        "dob": "",
        "sex": "",
        "uid": "",
        "fullname": "",
        "ws": ""
    },
    "persisted": "",
    "service": "",
    "status": ""
*/

const initialState = {
    currentServices: {
        delivery: [],
        onSite: [],
    }
}

export default function servicesReducers (state = initialState, { type, payload }) {
    switch (type) {
        case service.GET_EXISTING_DELIVERY_SERVICES:
            return { ...state, currentServices: {...state.currentServices, delivery: payload}}
        case service.GET_EXISTING_ON_SITE_SERVICES:
            return { ...state, currentServices: {...state.currentServices, onSite: payload}}
        case service.SET_ALL_DELIVERY_SERVICE:
            return { ...state, currentServices: { ...state.currentServices, delivery: payload}}
        case service.SET_ALL_ON_SITE_SERVICE:
            return { ...state, currentServices: { ...state.currentServices, onSite: payload}}
        case service.SET_NEW_DELIVERY_SERVICE:
            return { ...state, currentServices: {...state.currentServices, delivery: [...state.currentServices.delivery, payload]}}
        case service.SET_NEW_ON_SITE_SERVICE:
            return { ...state, currentServices: {...state.currentServices, onSite: [...state.currentServices.onSite, payload]}}
        default:
            return state
    }
}