
const initialState = {
    cancelTripComments: '',
    token: ''
}

export default function cancelTrip(state = initialState, action) {
    switch (action.type) {
        case 'CANCEL_TRIP_COMMENTS':
            return { ...state, cancelTripComments: action.payload }
        case 'SET_LOGED_TOKEN':
            return { ...state, token: `Bearer ${action.payload}`}
        default:
            return state;
    }
}
