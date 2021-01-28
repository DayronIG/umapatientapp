const initialState = {
	isEdition: false,
	loadingReminders: true,
	newReminder: {
		uid: '',
		dose: 0,
		quantity_days: 0,
		medicine: "",
		notify: true,
		personalized: false,
		initial_date: "",
		active: false,
		reminders: {
			mon: [],
			tue: [],
			wed: [],
			thu: [],
			fri: [],
			sat: [],
			sun: []
		}
	},
	filteredRecipes: [],
	personalizedShifts: false,
	recipes: [],
	renderState: 'LIST',
	reminderToEdit: {},
	reminderToEditIndex: 0,
	shiftsToPost: {}
};

export default (state = initialState, { type, payload }) => {
	switch (type) {
		case "SET_LOADING_REMINDERS":
			return {...state, loadingReminders: payload}
		case "SET_NEW_REMINDER":
			return {...state, newReminder: payload}
		case "SET_PERSONALIZED_SHIFTS":
			return {...state, personalizedShifts: payload}
		case "SET_RECIPES_REMINDERS":
			return {...state, recipes: payload}
		case "SET_FILTERED_RECIPES":
			return {...state, filteredRecipes: payload}
		case "SET_RENDER_STATE":
			return {...state, renderState: payload}
		case "SET_REMINDER_TO_EDIT":
			return {...state, reminderToEdit: payload}
		case "SET_REMINDER_TO_EDIT_INDEX":
			return {...state, reminderToEditIndex: payload}
		case "SET_IS_EDITION":
			return {...state, isEdition: payload}
		case "SET_SHIFTS_TO_POST":
			return {...state, shiftsToPost: {...state.shiftsToPost, ...payload}}
		default:
			return state;
	}
};