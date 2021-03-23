import * as deliveryTypes from '../types/deliveryTypes';

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
