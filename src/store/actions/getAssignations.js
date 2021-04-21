/* eslint-disable array-callback-return */
import DBConnection, {firebaseInitializeApp} from '../../config/DBConnection';
import { yearAndMonth } from '../../components/Utils/dateUtils';
import { regexNumbers } from '../../components/Utils/regex';
import moment from 'moment-timezone';
const firestore = DBConnection.firestore(firebaseInitializeApp);
const currentMonth = moment().tz('America/Argentina/Buenos_Aires').format('YYYYMM');
const yearMonth = yearAndMonth();

export function getAssignedAppointments(specialty, collectionName, doctors, uid, date) {
	return new Promise(async function (resolve, reject) {
		try {
			const assigns = [];
			firestore
				.collection(`assignations/${specialty}/${collectionName}`)
				.where('date', '==', date)
				.where('patient.uid', '==', uid)
				.get()
				.then(async function (snapshot) {
					snapshot.forEach((subDoc) => {
						const data = { ...subDoc.data(), path: subDoc.ref.path };
						const u = JSON.parse(localStorage.getItem('userData'));
						let match;
						if (collectionName !== 'bag') {
							match = true
							/* if (u && u.context === 'temp') {
								match = doctors.find((d) => d.cuit === data.cuil && d.enable === 'temp');
							} else {
								match = doctors.find((d) => d.cuit === data.cuil && d.enable === 'si');
							} */
						} else {
							match = true;
						}
						let fullDate = `${data.date} ${data.time}:00`;
						let dt = new Date(fullDate);
						// In case its IOS, parse the fulldate parts and re-create the date object.
						if (Number.isNaN(dt.getMonth())) {
							let arr = fullDate.split(/[- :]/);
							dt = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
						}
						if (data && match) assigns.push(data);
					});
					const assigned = await assigns.find(function (assign) {
						if (assign.state === 'ASSIGN' || assign.state === 'ATT' || assign.state === 'OVERBOOK') {
							return assign;
						}
					});
					resolve(assigned);
				})
				.catch(err => console.log(err));
		} catch (error) {
			reject(error);
		}
	});
}

export function getFreeAppointments(specialty, doctors, date) {
	return new Promise(function (resolve, reject) {
		try {
			let assigns = [];
			const query = firestore
				.collection('assignations')
				.doc(specialty)
				.collection(yearMonth)
				.where('date', '==', date)
				.where('state', '==', 'FREE')
				.limit(500)
			query.get().then(function (res) {
				res.forEach((subDoc) => {
					const data = { ...subDoc.data(), path: subDoc.ref.path };
					const u = JSON.parse(localStorage.getItem('userData'));
					let match;
					if (u && u.context !== 'temp') {
						if (u && (u.country === 'AR' || !u.country || u.country === '')) {
							match = doctors.find(
								(d) =>
									d.cuit === data.cuil &&
									d.enable === 'si' &&
									(!d.country ||
										d.country.includes('AR') ||
										d.country === [''] ||
										d.country === [] ||
										d.country.length === 0 ||
										d.country === 'AR')
							);
						} else {
							match = doctors.find((d) => {
								if (d.country?.includes('EC')) {
									console.log('EC');
								}
								return (
									d.cuit === data.cuil &&
									d.enable === 'si' &&
									d.country &&
									u.country !== 'AR' &&
									u.country !== '' &&
									d.country.includes(u.country.toString())
								);
							});
						}
					} else if (u && u.context === 'temp'){
						if (u && (u.country === 'AR' || !u.country || u.country === '')) {
							match = doctors.find((d) => d.cuit === data.cuil && d.enable === 'temp');
						} else {
							match = doctors.find(
								(d) =>
									d.cuit === data.cuil &&
									d.enable === 'temp' &&
									d.country &&
									d.country.includes(u.country.toString())
							);
						}
					}
					const now = new Date();
					let fullDate = `${data.date} ${data.time}:00`;
					let dt = new Date(fullDate);
					// In case its IOS, parse the fulldate parts and re-create the date object.
					if (Number.isNaN(dt.getMonth())) {
						let arr = fullDate.split(/[- :]/);
						dt = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
					}
					if (data && dt.getTime() > now.getTime() && match) assigns.push(data);
				});
				resolve(assigns);
			});
		} catch (error) {
			reject(error);
		}
	});
}

export async function getFreeAppointmentsCustom(date, specialty, condition) {
	try {
		const assigns = [];
		let query = {};
		if (!!condition?.match?.(regexNumbers)) {
			query = firestore
				.collection(`assignations/${specialty}/${date}`)
				.where('state', '==', 'FREE')
				.where('cuil', '==', condition)
				.limit(1000);
		} else {
			query = firestore
				.collection(`assignations/${specialty}/${date}`)
				.where('state', '==', 'FREE')
				.where('social_work', 'array-contains-any', condition)
				.limit(1000);
		}
		const res = await query.get();
		res.forEach((subDoc) => {
			const data = { ...subDoc.data(), path: subDoc.ref.path };
			const now = new Date();
			let fullDate = `${data.date} ${data.time}:00`;
			let dt = new Date(fullDate);
			// In case its IOS, parse the fulldate parts and re-create the date object.
			if (Number.isNaN(dt.getMonth())) {
				let arr = fullDate.split(/[- :]/);
				dt = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
			}
			if (data && dt.getTime() > now.getTime()) assigns.push(data);
		});
		return assigns;
	} catch (error) {
		console.log(error);
		return error;
	}
}

export function listenAppointment(specialty, key, cm) {
	const query = firestore
		.collection('assignations')
		.doc(specialty)
		.collection(currentMonth)
		.doc(key);
	var appointment = {};
	return (dispatch) => {
		query.onSnapshot(
			{
				includeMetadataChanges: true,
			},
			function (snapshot) {
				appointment = {
					...snapshot.data(),
					path: snapshot.ref.path,
					dateref: snapshot.date,
				};
				dispatch(getAppointment(appointment));
			}
		);
	};
}

export function matchToStore(match) {
	return (dispatch) =>
		dispatch({
			type: 'MATCH_TO_STORE',
			payload: match,
		});
}

export function selectedAppointment(appoint) {
	return (dispatch) =>
		dispatch({
			type: 'CONFIRMED_APPOINTMENT',
			payload: appoint,
		});
}

export const getAssignations = (assigns) => ({
	type: 'GET_ASSIGNS',
	payload: assigns,
});

export const getAppointment = (appoint) => ({
	type: 'GET_APPOINT',
	payload: appoint,
});

export const saveAppointment = (assigns) => ({
	type: 'SAVE_ASSIGN',
	payload: assigns,
});
