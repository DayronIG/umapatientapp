const initialState = {
	salatoken: { sala: '', token: '' },
	call: false,
	callRejected: false,
	publish: 'PENDING',
	subscribe: 'PENDING',
	session: 'PENDING'
}

export default function callReducers(state = initialState, action) {
	switch (action.type) {
		case 'SET_SALATOKEN':
			return { ...state, salatoken: action.payload };
		case 'CALL_REJECTED':
			return { ...state, callRejected: action.payload };
		case 'START_CALL':
			return { ...state, call: true }
		case 'FINISH_CALL':
			return { ...state, call: false }
		case 'SET_PUBLISH_STATUS':
			return { ...state, publish: action.payload }
		case 'SET_SUBSCRIBE_STATUS':
			return { ...state, subscribe: action.payload }
		case 'SET_SESSION_STATUS':
			return { ...state, session: action.payload }
		case 'SET_CALL_STATUS':
			return { ...state, status: action.payload }
		default:
			return state;
	}
}