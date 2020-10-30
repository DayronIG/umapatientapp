import { HANDLE_SELECTHOME_FORM, ADDRESS_VALID_FOR_HISOPADO, SET_ADDRESS_LAT_LONG_HISOPADO } from '../types/deliveryTypes';

const initialState = {
	selectHomeForm: {
		piso: '',
		depto: '',
		address: '',
		lat: 0,
		lng: 0,
	},
	isAddressValidForHisopado: true,
	addressLatLongHisopado: "",
	hisopadoUserAddress: "",
	params: "",
	step: "ASK_FOR_BUY"
};

export default (state = initialState, { type, payload }) => {
	switch (type) {
		case HANDLE_SELECTHOME_FORM:
			return { ...state, selectHomeForm: payload };
		case ADDRESS_VALID_FOR_HISOPADO:
			return { ...state, isAddressValidForHisopado: payload };
		case SET_ADDRESS_LAT_LONG_HISOPADO:
			return { ...state, addressLatLongHisopado: payload };
		case "SET_HISOPADO_USER_ADDRESS":
			return { ...state, hisopadoUserAddress: payload };
		case "SET_DELIVERY_PARAMS":
			return { ...state, params: payload }
		case "SET_DELIVERY_STEP":
			return { ...state, step: payload}
		default:
			return state;
	}
};
