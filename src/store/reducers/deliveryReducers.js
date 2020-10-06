import * as deliveryTypes from '../types/deliveryTypes';

const initialState = {
	selectHomeForm: {
		piso: '',
		depto: '',
		address: '',
		lat: 0,
		lng: 0,
	},
	currentService: {},
	modifiedObjService: {},
	redirectionIndicator: ''
};

export default (state = initialState, { type, payload }) => {
	switch (type) {
		case deliveryTypes.HANDLE_SELECTHOME_FORM:
			return { ...state, selectHomeForm: payload };
		case deliveryTypes.SET_CURRENT_SERVICE:
			return { ...state, currentService: payload };
		case deliveryTypes.SET_MODIFIED_SERVICE_OBJECT:
			return { ...state, modifiedObjService: payload };
		case deliveryTypes.SET_REDIRECTION_INDICATOR:
			return { ...state, redirectionIndicator: payload };
		default:
			return state;
	}
};
