const initialState = {
	activeUid: '',
	assignation_id: '',
	call: false,
	callRejected: false,
	date: '',
	dependant: false,
	publish: 'PENDING',
	room: '',
	token: '',
	session: 'PENDING',
	subscribe: 'PENDING'
}

export default function callReducers(state = initialState, action) {
	switch (action.type) {
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
		case 'SET_CALL_ROOM':
			return { ...state, ...action.payload };
		default:
			return state;
	}
}