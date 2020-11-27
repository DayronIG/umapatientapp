const initialState = {
	shiftsToPost: {}
};

export default (state = initialState, { type, payload }) => {
	switch (type) {
		case "SET_SHIFTS_TO_POST":
			return {...state, shiftsToPost: {...state.shiftsToPost, ...payload}}
		default:
			return state;
	}
};