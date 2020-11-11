import store from '../configStore';
import * as transportTypes from '../types/transportTypes';
import firebase from '../../config/DBConnection';
import { create_traslado } from '../../config/endpoints';
import { genTransportId } from '../../components/Utils/stringUtils';
import Axios from 'axios';
import { buildSheet } from '../../components/Utils/transportUtils';
import { calculateDistance } from '../../components/Utils/mapsApiHandlers';

const firestore = firebase.firestore();
const { dispatch } = store;

export const handleTransportService = (serviceData) => ({
	type: transportTypes.HANDLE_SERVICE_DATA,
	payload: serviceData
});

export const handleRouteOrigin = (data) => ({
	type: transportTypes.HANDLE_ORIGIN_POINT,
	payload: data
});

export const handleNotes = (data) => ({
	type: transportTypes.HANDLE_NOTES,
	payload: data
});

export const handleRouteDestiny = (data) => ({
	type: transportTypes.HANDLE_DESTINY_POINT,
	payload: data
});

export const handleStartSchedule = (value, key) => ({
	type: transportTypes.HANDLE_START_SCHEDULE,
	payload: { key, value },
});

export const handleReturnSchedule = (value, key) => ({
	type: transportTypes.HANDLE_RETURN_SCHEDULE,
	payload: { key, value },
});

export const handleStartDate = (value) => ({
	type: transportTypes.HANDLE_START_DATE,
	payload: value,
});

export const handleEndDate = (value) => ({
	type: transportTypes.HANDLE_END_DATE,
	payload: value,
});

export const handlePointSelector = () => ({
	type: transportTypes.HANDLE_POINT_SELECTOR,
	payload: 'destiny',
});

export const handleTimeReference = (value) => ({
	type: transportTypes.HANDLE_TIME_REFERENCE,
	payload: value
});

export const handleHasReturn = (value) => ({
	type: transportTypes.HANDLE_RETURN,
	payload: value
})

export const handleHasOrigin = (value) => ({
	type: transportTypes.HANDLE_ORIGIN,
	payload: value
})

export const handleReset = (value) => ({
	type: transportTypes.HANDLE_RESET
})

export const setInitialOriginPoint = (patient = {}) => {
	const pointData = {
		lat: patient.lat,
		lng: patient.lon,
		text: patient.address,
		address: patient.address,
	};
	if (!pointData.lat || !pointData.lng) return null;
	return dispatch(handleRouteOrigin(pointData));
}

export const handlePoints = (pointSelector) => (pointData) => {
	if (!pointData.lat || !pointData.lng) return null;
	if (pointSelector === 'origin') {
		return dispatch(handleRouteOrigin(pointData));
	} else {
		return dispatch(handleRouteDestiny(pointData));
	}
}

export const handleInputs = (pointSelector) => ({ target = {} }) => {
	const { name, value } = target;
	if (pointSelector === 'origin') {
		return dispatch(handleRouteOrigin({ [name]: value }));
	} else {
		return dispatch(handleRouteDestiny({ [name]: value }));
	}
}

export const createTransportSchedule = async (transportData, patient) => {
	const travelMetaData = await calculateDistance(transportData);
	const { distance = {}, duration = {} } = travelMetaData.routes?.[0]?.legs?.[0];
	console.log(transportData)
	console.log(patient)
	try {
		const data = {
			id_solicitud: genTransportId(patient),
			autorizado: '0',
			corporate: patient.corporate_norm,
			dependencia: '0',
			descrip: '0-PROGRAMADO',
			dni: patient.dni,
			eta_tramo: duration.text , // buscar en portal.
			km_tramo: distance.text, // buscar en portal.
			f_inicio: transportData.start_date,
			f_fin: transportData.end_date,
			geo_inicio: {
				address: transportData.origin.address,
				address_info: `${transportData.origin?.floor || ''} ${transportData.origin?.department || ''}`,
				lat: `${transportData.origin?.lat || ''}`,
				lon: `${transportData.origin?.lng || ''}`
			},
			geo_fin: {
				address: transportData.destiny.address,
				address_info: `${transportData.destiny?.floor || ''} ${transportData.destiny?.department || ''}`,
				lat: `${transportData.destiny?.lat || ''}`,
				lon: `${transportData.destiny?.lng || ''}`
			},
			notas: transportData.notes,
			provider_id: '',
			retorno_espera: buildSheet(transportData.returnSchedules),
			retorno_reserva: '0',
			retorno_tramo: `${Number(transportData.hasReturn)}`,
			sheet: buildSheet(transportData.startSchedules),
			time_reference: transportData.timeReference.toUpperCase(),
			tipo_asignacion: 'manual'
		}
		await Axios.post(create_traslado, data);
		return dispatch(handleReset());
	} catch (error) {
		console.error(error);
		throw new Error(error.message || error);
	}
}

export const getTransportService = ({ corporate, date, assignation_id }) => {
	try {
		const query = firestore.doc(`/assignations/${date}/${corporate}/${assignation_id}`);
		const unsubscribe = query.onSnapshot(doc => {
			const service = doc.data();
			dispatch(handleTransportService(service));
		});
		return unsubscribe;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export const setStartSchedule = (value, day) => dispatch(handleStartSchedule(value, day));
export const setReturnSchedule = (value, day) => dispatch(handleReturnSchedule(value, day));
export const setStartDate = ({ target: { value } }) => dispatch(handleStartDate(value));
export const setEndDate = ({ target: { value } }) => dispatch(handleEndDate(value));
export const setNotes = ({ target: { value } }) => dispatch(handleNotes(value));
export const setTimeReference = ({ target: { value } }) => dispatch(handleTimeReference(value));
export const setNextPoint = () => dispatch(handlePointSelector());
export const setHasReturn = (value) => dispatch(handleHasReturn(!value));
export const setHasOrigin = (value) => dispatch(handleHasOrigin(!value));
