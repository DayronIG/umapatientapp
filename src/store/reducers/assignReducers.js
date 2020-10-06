const initialState = {
	all: [{}],
	appointments: [],
	assignations: [{}],
	current: {},
	event: {},
	firstAppointment: '',
	match: {
		specialty: '',
	},
	providers: [],
	actionHandler: '',
	selected: {},
	selectedAppointment: {},
	selectedDoctor: ''
};

export default (state = initialState, action) => {
	switch (action.type) {
		case 'GET_APPOINT':
			return { ...state, selected: action.payload };
		case 'SAVE_ASSIGN':
			return { ...state, appointments: action.payload };
		case 'GET_ASSIGNS':
			return { ...state, all: action.payload };
		case 'GET_CURRENT_ASSIGNATION':
			return { ...state, current: action.payload };
		case 'MATCH_TO_STORE':
			return { ...state, match: { ...action.payload, specialty: '' } };
		case 'CONFIRMED_APPOINTMENT':
			return { ...state, confirmedAppoint: action.payload };
		case 'REMOVE_APPOINT':
			return { ...state, appointments: action.payload };
		case 'SET_CURRENT_EVENT':
			return { ...state, event: action.payload }
		case 'SET_FIRST_APPOINTMENT':
			return { ...state, firstAppointment: action.payload };
		case 'SET_SELECTED_DOCTOR':
			return { ...state, selectedAppointment: action.payload };
		default:
			return state;
	}
};
