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
		default:
			return state;
	}
}

