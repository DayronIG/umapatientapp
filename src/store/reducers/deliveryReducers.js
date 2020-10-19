import { HANDLE_SELECTHOME_FORM } from '../types/deliveryTypes';

const initialState = {
	selectHomeForm: {
		piso: '',
		depto: '',
		address: '',
		lat: 0,
		lng: 0,
	},
};

export default (state = initialState, { type, payload }) => {
	switch (type) {
		case HANDLE_SELECTHOME_FORM:
			return { ...state, selectHomeForm: payload };
		default:
			return state;
	}
};
