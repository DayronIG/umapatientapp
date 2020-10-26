import * as deliveryTypes from '../types/deliveryTypes';
import { calculateProgressPercentage } from '../../components/Utils/deliveryServicesUtils';
import firebase from '../../config/DBConnection';
import store from '../../store/configStore';

const { dispatch } = store;
const firestore = firebase.firestore();

export const handleDeliveryForm = (form) => ({
	type: deliveryTypes.HANDLE_SELECTHOME_FORM,
	payload: form,
});
export const handleCurrentService = (service) => ({
	type: deliveryTypes.SET_CURRENT_SERVICE,
	payload: service
});
export const handleModifiedService = (modifiedObj) => ({
	type: deliveryTypes.SET_MODIFIED_SERVICE_OBJECT,
	payload: modifiedObj
});
export const handleRedirectionIndicator = (indicator) => ({
	type: deliveryTypes.SET_REDIRECTION_INDICATOR,
	payload: indicator
});
export const handleAddressValidForHisopado = (isValid) => ({
	type: deliveryTypes.ADDRESS_VALID_FOR_HISOPADO,
	payload: isValid
});
export const setAddressLatLongHisopado = (latlong) => ({
	type: deliveryTypes.SET_ADDRESS_LAT_LONG_HISOPADO,
	payload: latlong
});

export const listenToChangesInService = (aid) => {
	if (!aid) return null;
	let subscription = undefined;
	try {
		const query = firestore.doc(`/events/requests/online/${aid}`);
		const listener = (doc) => {
			if (!doc.exists) return null;
			const document = doc.data();
			dispatch(handleCurrentService(document));
		};
		subscription = query.onSnapshot({ includeMetadataChanges: true }, listener);
	} catch (error) {
		console.error(error);
	} finally {
		return subscription;
	}
}
export const modifyServiceToProgress = (service) => {
	if (Object.keys(service).length === 0) return null;
	const { status_derivacion, cuit_delivery, address, incidente_id, cuit_nurse, user_lat, user_lon } = service;
	const modifiedService = {
		status_derivacion,
		incidente_id,
		active: service.status_derivacion,
		delivery_lat: service.lat_delivery,
		delivery_lng: service.lon_delivery,
		user_lat,
		user_lng: user_lon,
		progress: [
			{
				text: 'Esperando validación de la obra social.',
				active: status_derivacion === 'PREASSIGN:VALIDATE' ? true : false
			},
			{
				text: 'Buscando prestador',
				active: status_derivacion === 'PREASSIGN:READY' ? true : false
			},
			{
				text: 'En camino.',
				active: status_derivacion === 'ASSIGN' ? true : false
			},
			{
				text: 'Llegó a tu domicilio.',
				active: status_derivacion === 'ASSIGN:READY' ? true : false
			},
			{
				text: 'Hisopado realizado.',
				active: status_derivacion === 'DONE:HISOPADO' ? true : false
			},
			{
				text: 'Analizando en laboratorio.',
				active: status_derivacion === 'DONE:IN_LAB' ? true : false
			},
			{
				text: 'Resultado disponible',
				active: status_derivacion === 'DONE:RESULT' ? true : false
			}
		],
		deliveryData: {
			service: 'Hisopado',
			cuit_delivery,
			cuit_nurse,
			address,
		}
	};
	modifiedService.percent = calculateProgressPercentage(modifiedService.progress);
	return dispatch(handleModifiedService(modifiedService));
}
export const listenRedirectionGeo = async (ws) => {
	let unsubscribe = undefined;
	try {
		const listener = (doc) => {
			if (!doc.exists) return null;
			const document = doc.data();
			dispatch(handleRedirectionIndicator(document._start_date))
		};
		unsubscribe = firestore
			.doc(`/auth/${ws}`)
			.onSnapshot({ includeMetadataChanges: true }, listener);
	} catch (error) {
		console.error(error);
	} finally {
		return unsubscribe;
	}
}