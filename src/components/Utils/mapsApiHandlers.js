import swal from 'sweetalert';

export const currentPositionHandler = (position) => ({
	lat: position.coords.latitude,
	lng: position.coords.longitude,
});

export const errorHandler = (err) =>
	swal({
		title: 'Error',
		msg: err,
		icon: 'warning',
		dangerMode: true,
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
	