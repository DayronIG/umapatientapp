import * as transportTypes from '../types/transportTypes';

const initialState = {
	pointSelector: 'origin',
	origin: { lat: 0, lng: 0 },
	destiny: { lat: 0, lng: 0 },
	start_date: '',
	end_date: '',
	startSchedules: {},
	returnSchedules: {},
	timeReference: 'ORIGEN',
	service: {},
	notes: '',
	hasReturn: false,
	origin_translate_monday: false,
    origin_translate_tuesday: false,
    origin_translate_wednesday: false,
    origin_translate_thursday: false,
    origin_translate_friday: false,
    origin_translate_saturday: false,
};

export default (state = initialState, { type, payload }) => {
	switch (type) {
		case transportTypes.HANDLE_ORIGIN_POINT:
			return { ...state, origin: { ...state.origin, ...payload } };
		case transportTypes.HANDLE_DESTINY_POINT:
			return { ...state, destiny: { ...state.destiny, ...payload } };
		case transportTypes.HANDLE_POINT_SELECTOR:
			return { ...state, pointSelector: payload }
		case transportTypes.HANDLE_START_SCHEDULE:
			return { ...state, startSchedules: { ...state.startSchedules, [payload.key]: payload.value } };
		case transportTypes.RESET_START_SCHEDULE:
			return { ...state, startSchedules: {} };
		case transportTypes.RESET_RETURN_SCHEDULE:
			return { ...state, returnSchedules: {} };
		case transportTypes.HANDLE_RETURN_SCHEDULE:
			return { ...state, returnSchedules: { ...state.returnSchedules, [payload.key]: payload.value } };
		case transportTypes.HANDLE_START_DATE:
			return { ...state, start_date: payload };
		case transportTypes.HANDLE_END_DATE:
			return { ...state, end_date: payload };
		case transportTypes.HANDLE_TIME_REFERENCE:
			return { ...state, timeReference: payload };
		case transportTypes.HANDLE_SERVICE_DATA:
			return { ...state, service: payload };
		case transportTypes.HANDLE_NOTES:
			return { ...state, notes: payload };
		case transportTypes.HANDLE_RETURN:
			return { ...state, hasReturn: payload };
		case transportTypes.HANDLE_ORIGIN_DAY:
			return {...state.originDay, [payload.key]: payload.value  }
		case 'SET_ORIGIN_TRANSLATE_MONDAY':
			return { ...state, origin_translate_monday: payload };
		case 'SET_ORIGIN_TRANSLATE_TUESDAY':
			return { ...state, origin_translate_tuesday: payload };
		case 'SET_ORIGIN_TRANSLATE_WEDNESDAY':
			return { ...state, origin_translate_wednesday: payload };
		case 'SET_ORIGIN_TRANSLATE_THURSDAY':
			return { ...state, origin_translate_thursday: payload };
		case 'SET_ORIGIN_TRANSLATE_FRIDAY':
			return { ...state, origin_translate_friday: payload };
		case 'SET_ORIGIN_TRANSLATE_SATURDAY':
			return { ...state, origin_translate_saturday: payload };
		case 'SET_ORIGIN_TRANSLATE_SUNDAY':
			return { ...state, origin_translate_sunday: payload };
		case 'SET_BACK_TRANSLATE_MONDAY':
				return { ...state, back_translate_monday: payload };
		case 'SET_BACK_TRANSLATE_TUESDAY':
			return { ...state, back_translate_tuesday: payload };
		case 'SET_BACK_TRANSLATE_WEDNESDAY':
			return { ...state, back_translate_wednesday: payload };
		case 'SET_BACK_TRANSLATE_THURSDAY':
			return { ...state, back_translate_thursday: payload };
		case 'SET_BACK_TRANSLATE_FRIDAY':
			return { ...state, back_translate_friday: payload };
			case 'SET_BACK_TRANSLATE_SATURDAY':
			return { ...state, back_translate_saturday: payload };
		case 'SET_BACK_TRANSLATE_SUNDAY':
			return { ...state, back_translate_sunday: payload };
		case transportTypes.HANDLE_RESET:
			return { ...initialState };
		default:
			return state;
	}
}

