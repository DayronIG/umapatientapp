
const initialState = {
    cancelTripComments: '',
    token: '',
    currentUser: {},
    login: {}
}

export default function cancelTrip(state = initialState, action) {
    switch (action.type) {
        case 'CANCEL_TRIP_COMMENTS':
            return { ...state, cancelTripComments: action.payload }
        case 'SET_LOGED_TOKEN':
            return { ...state, token: `Bearer ${action.payload}`}
        case 'SET_LOGED_ACTIVE':
            return { ...state, currentUser: action.payload }
        case 'SET_USER_LOGIN':
            return { ...state, login: action.payload }
        default:
            return state;
    }
}
