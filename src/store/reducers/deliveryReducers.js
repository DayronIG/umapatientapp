import { HANDLE_SELECTHOME_FORM, ADDRESS_VALID_FOR_HISOPADO, SET_ADDRESS_LAT_LONG_HISOPADO } from '../types/deliveryTypes';

const initialState = {
	addressLatLongHisopado: "",
	deliveryType: '',
	hisopadoUserAddress: "",
	isAddressValidForHisopado: true,
	params: "",
	pending: {},
	selectHomeForm: {
		piso: '',
		depto: '',
		address: '',
		lat: 0,
		lng: 0,
	},
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
		case "SET_DELIVERY_CURRENT":
			return { ...state, current: payload}
		case "SET_DELIVERY_PENDING":
			return { ...state, pending: payload}
		default:
			return state;
	}
};
