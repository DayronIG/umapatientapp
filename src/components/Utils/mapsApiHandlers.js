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
