import { HANDLE_SELECTHOME_FORM, ADDRESS_VALID_FOR_HISOPADO } from '../types/deliveryTypes';

const initialState = {
	selectHomeForm: {
		piso: '',
		depto: '',
		address: '',
		lat: 0,
		lng: 0,
	},
	isAddressValidForHisopado: true
};

export default (state = initialState, { type, payload }) => {
	switch (type) {
		case HANDLE_SELECTHOME_FORM:
			return { ...state, selectHomeForm: payload };
		case ADDRESS_VALID_FOR_HISOPADO:
			return { ...state, isAddressValidForHisopado: payload };
		default:
			return state;
	}
};
