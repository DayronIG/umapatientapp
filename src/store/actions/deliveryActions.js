import { HANDLE_SELECTHOME_FORM } from '../types/deliveryTypes';

export const handleDeliveryForm = (form) => ({
	type: HANDLE_SELECTHOME_FORM,
	payload: form,
});
