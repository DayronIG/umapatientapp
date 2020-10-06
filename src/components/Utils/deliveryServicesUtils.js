import { getDocumentFB } from './firebaseUtils';
import swal from 'sweetalert';

export const validDeliveryService = async ({ component, service, serviceId }) => {
	try {
		let servicesParams = await getDocumentFB('/parametros/userapp/variables/delivery_services');
		const { services, components } = servicesParams;
		if (!components.includes(component)) {
			throw new Error('Esta sección no está disponible');
		} else if (component !== 'selectService' && !services.includes(service)) {
			throw new Error('Este servicio no está disponible');
		} else if (component === 'trackProgress' && !serviceId) {
			throw new Error('No se encuentra el identificador del seguimiento');
		} else {
			return true;
		}
	} catch (error) {
		swal({
			title: 'Error',
			text: `${error.message || error}.`,
			icon: 'warning',
			dangerMode: true,
		});
		return false;
	}
};

export const calculateProgressPercentage = (progress) => {
	let counter = 0,
		totalPoints = 0,
		percentage = 0;
	progress.forEach((el) => {
		if (el.active) counter++;
	});
	totalPoints = progress.length;
	percentage = (100 * counter) / totalPoints;
	return percentage;
};
