import { HANDLE_SELECTHOME_FORM, ADDRESS_VALID_FOR_HISOPADO, SET_ADDRESS_LAT_LONG_HISOPADO } from '../types/deliveryTypes';

const initialState = {
	addressLatLongHisopado: "",
	changeMarker: 0,
	coverage: [],
	current: {},
	currentHisopadoIndex: 0,
	deliveryInfo: [],
	deliveryType: '',
	dependantInfo: {
		isAddressValidForHisopado: true,
		address: ''
	},
	hisopadoDependantAddresses: [],
	hisopadoUserAddress: "",
	isAddressValidForHisopado: true,
	params: "",
	selectHomeForm: {
		piso: '',
		depto: '',
		address: '',
		lat: 0,
		lng: 0,
	},
	step: "ASK_FOR_BUY",
	deliveryLatLongProviders: {
		lat: '',
		lon: ''
	}
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
		case "SET_HISOPADO_DEPENDANT_ADDRESSES":
			return { ...state, hisopadoDependantAddresses: payload };
		case "SET_DELIVERY_PARAMS":
			return { ...state, params: payload }
		case "SET_DELIVERY_STEP":
			return { ...state, step: payload }
		case "SET_DELIVERY_CURRENT":
			return { ...state, current: payload}
		case "SET_DELIVERY_FROM_ZERO":
			return { ...state, deliveryInfo: payload}
		case "SET_DELIVERY":
			return { ...state, deliveryInfo: [...state.deliveryInfo, payload] }
		case "SET_DELIVERY_COVERAGE":
			return { ...state, coverage: payload }
		case 'CLEAN_DELIVERYDATA':
			return { ...initialState, selectHomeForm: initialState.selectHomeForm }
		case "REMOVE_DELIVERY":
			const deliveryInfo = state.deliveryInfo
			deliveryInfo.splice(payload, 1)
			return { ...state, deliveryInfo: deliveryInfo }
		case "SET_DELIVERY_ALL":
			return { ...state, deliveryInfo: [...payload] }
		case "CLEAN_DELIVERY":
			return { ...state, deliveryInfo: [] }
		case "SET_DEPENDANT_INFO":
			return { ...state, dependantInfo: payload }
		case "SET_HISOPADO_INDEX":
			return {...state, currentHisopadoIndex: payload}
		case "CHANGE_MARKER":
			return {...state, changeMarker: state.changeMarker + 1}
		case "SET_DELIVERY_LAT_LONG_PROVIDERS":
			return {...state, deliveryLatLongProviders: payload}
		default:
			return state;
	}
};
