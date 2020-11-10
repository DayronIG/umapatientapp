export const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export function buildSheet(schedule) {
	if (Object.keys(schedule).length > 0) {
		return days.map(day => schedule[day] || '');
	} else {
		return [];
	}
}

export function renderMarker(service) {
	switch (service?.status_tramo) {
		case 'STANDBY':
			return (
				{
					lat:service.request.geo_inicio.lat,
					lng:service.request.geo_inicio.lon,					
					text:service.request.address
				}
			);
		case 'GOING-ORIGIN':
			return (
				{
					lat:service.request.geo_inicio.lat,
					lng:service.request.geo_inicio.lon,					
					text:service.request.address
				}
			);
		case 'ARRIVED-ORIGIN':
			return (
				{
					lat:service.request.geo_inicio.lat,
					lng:service.request.geo_inicio.lon,					
					text:service.request.address
				}
			);
		case 'GOING-DESTINY':
			return (
				{
					lat:service.request.geo_fin.lat,
					lng:service.request.geo_fin.lon,					
					text:service.request.address
				}
			);
		case 'FINISHED':
			return (
				{
					lat:service.request.geo_fin.lat,
					lng:service.request.geo_fin.lon,					
					text:service.request.address
				}
			);
		default:
			return {};
	}
}

export function calculateFirstPoint(service) { 
	switch (service?.status_tramo) {
		case 'STANDBY':
			return (
				{
					lat: service.request.geo_inicio.lat,
					lng: service.request.geo_inicio.lon	
				}
			);
		case 'GOING-ORIGIN':
			return (
				{
					lat: service.request.geo_inicio.lat,
					lng: service.request.geo_inicio.lon					
				}
			);
		case 'ARRIVED-ORIGIN':
			return (
				{
					lat: service.request.geo_inicio.lat,
					lng: service.request.geo_inicio.lon					
				}
			);
		case 'GOING-DESTINY':
			return (
				{
					lat: service.request.geo_fin.lat,
					lng: service.request.geo_fin.lon					
				}
			);
		case 'FINISHED':
			return (
				{
					lat: service.request.geo_fin.lat,
					lng: service.request.geo_fin.lon					
				}
			);
		default:
			return {
				lat: 0,
				lng: 0 
			};
	}
}

export function renderTitle(service) {
	switch (service?.status_tramo) {
		case 'STANDBY':
			return 'Todavía no está en transcurso este viaje';
		case 'GOING-ORIGIN':
			return 'Tu conductor está en camino';
		case 'ARRIVED-ORIGIN':
			return 'Tu conductor está en el domicilio';
		case 'GOING-DESTINY':
			return 'En camino al destino';
		case 'FINISHED':
			return 'Viaje finalizado';
		default:
			return '';
	}
}

export function renderStatus(status_tramo) {
	switch (status_tramo) {
		case 'FREE':
			return 'PENDIENTE DE APROBACION';
		case 'ASSIGN':
			return 'CONDUCTOR ASIGNADO';
		case 'AUTHORIZED':
			return 'AUTORIZADO';
		case 'DONE':
			return 'FINALIZADO';
		case 'CANCEL':
			return 'CANCELADO';
		default:
			return '';
	}
}