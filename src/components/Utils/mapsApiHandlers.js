import swal from 'sweetalert';

export const currentPositionHandler = (position) => ({
	lat: position.coords.latitude,
	lng: position.coords.longitude,
});

export const errorHandler = (err) =>
	swal({
		title: 'Error',
		msg: err.message,
		icon: 'warning',
		dangerMode: true,
	});


export const handleApiLoaded = (callback) => {
	return new Promise((resolve, reject) => {
		try {
			if (!navigator.geolocation) reject('Geolocalización no soportada.');
			navigator.geolocation.getCurrentPosition((pos) => {
				const latLng = currentPositionHandler(pos);
				resolve(callback(latLng));
			}, errorHandler);
		} catch (error) {
			console.error(error);
			reject(error);
		}
	});
};

export const routeDrawer = (mapsApi, directionsService, directionsDisplay) => (origin, destiny) => {
	return new Promise((resolve, reject) => {
		if (!origin?.lat || !destiny?.lat) reject('No hay datos disponibles');
		const request = {
			origin: new mapsApi.LatLng(origin.lat, origin.lng || origin.lon),
			destination: new mapsApi.LatLng(destiny.lat, destiny.lng) || destiny.lon,
			travelMode: mapsApi.DirectionsTravelMode.DRIVING,
		};
		directionsService.route(request, function (response, status) {
			if (status == mapsApi.DirectionsStatus.OK) {
				resolve(response.routes[0].legs[0].duration.text);
				resolve(directionsDisplay.setOptions({ suppressMarkers: true }));
				// resolve(directionsDisplay.setDirections(response));
			}
		});
	});
};

export const mapBounds = (map, mapsApi) => (points) => {
	try {
		if (points?.length === 0 || points.some(point => !point.lng || !point.lat)) return null;
		const bounds = new mapsApi.LatLngBounds();
		points.forEach((item) => {
			const position = new mapsApi.LatLng(item.lat, item.lon || item.lng);
			bounds.extend(position);
		});
		return map.fitBounds(bounds);
	} catch (error) {
		console.error(error);
		return error;
	}
};

export const mapConfig = (
	center = { lat: 0, lng: 0 },
	onClick = () => { },
	zoom = 15,
	yesIWantToUseGoogleMapApiInternals = true,
	options = {
		streetViewControl: false,
		disableDefaultUI: false,
		mapTypeControl: false,
		styles: [
			{
				featureType: 'poi',
				elementType: 'labels',
				stylers: [{ visibility: 'off' }],
			},
		],
	},
	bootstrapURLKeys = {
		key: 'AIzaSyDLnpXWJx1qKAfHtTeYWa30b9jGH2GeXfs',
		libraries: ['places'],
		language: 'es',
	}
) => ({
	center,
	bootstrapURLKeys,
	yesIWantToUseGoogleMapApiInternals,
	zoom,
	options,
	onClick
});

export const calculateDistance = ({origin, destiny}) => {
	return new Promise((resolve, reject) => {
		const originPoint = {
			lat: origin?.lat,
			lng: origin?.lng
		};
		const destinyPoint = {
			lat: destiny?.lat,
			lng: destiny?.lng
		};
		const DirectionsService = new window.google.maps.DirectionsService();
		DirectionsService.route({
				origin: originPoint,
				destination: destinyPoint,
				travelMode: window.google.maps.TravelMode.DRIVING
		}, (result, status) => {
				if (status === window.google.maps.DirectionsStatus.OK) {
					console.log(status);
					resolve(result);
				} else {
					console.error(`error fetching directions ${result}`);
					reject(result);
				}
		});
	})
}
