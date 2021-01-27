import DBConnection from '../../config/DBConnection';
import moment from 'moment-timezone';

var d = new Date();
var currentMonth = ('0' + (d.getMonth() + 1)).substr(-2);
const currentDate = [d.getFullYear(), currentMonth].join('');
const firestore = DBConnection.firestore();

export const getAppointments = (apoint) => ({
	type: 'GET_APPOINTMENTS',
	payload: apoint,
});

export const getPatient = (patient) => ({
	type: 'GET_PATIENT',
	payload: patient,
});

export const getOneRecord = (patient) => ({
	type: 'GET_ONE_RECORD',
	payload: patient,
});


export async function getFreeGuardia(test = false, country = false, type = false) {
	let docQuery = []
	// console.log(`Country: ${country}, Type: ${type}, Test: ${test}`)
	if(test === true) {
		await firestore
			.collection('assignations/guardia/test')
			.get()
			.then(snap => {
				snap.forEach((element) => {
					docQuery.push(element.data())
				})
			})
	} else {
		await firestore
			.collection('assignations/guardia/upcoming')
			.get()
			.then(snap => {
				snap.forEach((element) => {
					if(type === 'pediatria') {
						if(element.data().doc?.specialty === "pediatria") {
							docQuery.push(element.data())
						} 
					} else {
						if(element.data().doc?.country.includes(country)) {
							docQuery.push(element.data())
						} else if(country === false || country === 'AR' || country === "") {
							docQuery.push(element.data())
						}
					}
				})
			})
	}
	return docQuery
}
export function searchActiveProviders(service = 'online', type = '', social_work) {
    let docQuery = firestore
            .collection('providers')
			.where('services.MEDICO', 'array-contains', service)
    return new Promise((resolve, reject) => {
        docQuery
            .get()
            .then(snap => {
                let data = [];
                snap.forEach(res => {
                    let doctor = res.data()
                    if (doctor.matricula_especialidad && doctor.matricula_especialidad.includes(type)) {
                            data.push(doctor)
						/*  Sirve para filtrar por OS
						if(social_work === "PAMI" && doctor.social_work && doctor.social_work.includes("PAMI")) {
						} else if((social_work !== "PAMI" 
                                    && doctor.social_work && !doctor.social_work.includes("PAMI"))
                                    || doctor.social_work === []
                                    || !doctor.social_work) {
                            data.push(doctor)
                        } */
                    }
                });
                return resolve(data);
            })
            .catch(err => reject(err));
    });
}

export function listenAppointments(specialty) {
	try {
		var appointments = [];
		specialty = 'online_clinica_medica'; // Temporal, luego habrá más especialidades
		const appointmentsQuery = firestore
			.collection('assignations')
			.doc(specialty)
			.collection(currentDate)
			.where('state', '==', 'ASSIGN');
		return (dispatch) => {
			appointmentsQuery.onSnapshot(
				{
					includeMetadataChanges: true,
				},
				function(snapshot) {
					snapshot.forEach((subDoc) => {
						let data = subDoc.data();
						appointments.push(data);
					});
					dispatch(getAppointments(appointments));
				}
			);
		};
	} catch (err) {
		return { type: 'ERROR', payload: 'listenAppointments' + err };
	}
}

export function getDoctors(condition) {
	return new Promise((resolve, reject) => {
		try {
			const query = firestore
				.collection('providers')
				// .where('especialidad', '==', specialty)
				.where('services.MEDICO', 'array-contains', condition || 'online');
			query
				.get()
				.then((doctors) => {
					let data = [];
					doctors.forEach((d) => {
						data.push(d.data());
					});
					return resolve(data);
				})
				.catch((e) => {
					throw e;
				});
		} catch (error) {
			console.error(error);
			return reject(error);
		}
	});
}

export function getUserParentsFirebase(group) {
	return new Promise(function(resolve, rejected) {
		let queryUser = firestore.collection('users').where('group', '==', group);
		queryUser
			.get()
			.then(async (family) => {
				let parentsTemp = [];
				await family.forEach((p) => {
					let data = p.data();
					if (p.exists && data.dni !== group) parentsTemp.push(data);
				});
				if (parentsTemp.length > 0) resolve(parentsTemp);
				else rejected('No hay parientes disponibles.');
			})
			.catch((err) => console.log(err));
	});
}
// TO DO -> HERE ARE TWO FUNCTIONS DOING EXACTLY THE SAME
export function getBenficiaries(group) {
	let queryUser = firestore.collection('users').where('group', '==', group);
	return (dispatch) => {
		queryUser.get()
			.then((beneficiaries) => {
				let parentsTemp = [];
				beneficiaries.forEach((p) => {
					let data = p.data();
					if (p.exists && data.dni !== group) {
						parentsTemp.push(data);
					}
				})
				dispatch({ type: 'GET_BENEFICIARIES', payload: parentsTemp });
			})
			.catch((err) => {
				console.log(err)
			})
	};
}

export function getPendingTraslate(dni) {
	let daysAgo = moment()
		.subtract(3, 'days')
		.format('YYYY-MM-DD 00:00:00');
	return new Promise(function(resolve, rejected) {
		let queryUser = firestore
			.collection('events/requests/online')
			.where('dni', '==', dni)
			.where('att_date', '>=', daysAgo)
			.where('destino_final', '==', 'Traslado protocolo pandemia');
		queryUser
			.get()
			.then(async (pending) => {
				await pending.forEach((query) => {
					let data = query.data();
					if (data.corporate && data.corporate.toUpperCase() === 'IOMA') {
						resolve(true);
					} else {
						resolve(false);
					}
				});
			})
			.catch((err) => rejected(false));
	});
}

export function getfirstAppointment(user, specialty) {
	try {
		var appointments = [];
		specialty = 'online_clinica_medica'; // Temporal, luego habrá más especialidades
		const appointmentsQuery = firestore
			.collection('assignations')
			.doc(specialty)
			.collection(currentDate)
			.where('state', 'in', ['ASSIGN', 'ATT'])
			.where('appointments.0', 'array-contains', user);
		return (dispatch) => {
			appointmentsQuery.onSnapshot(
				{
					includeMetadataChanges: true,
				},
				function(snapshot) {
					snapshot.forEach((subDoc) => {
						let data = subDoc.data();
						appointments.push(data);
					});
					dispatch({ type: 'SET_FIRST_APPOINTMENT', payload: appointments[0] });
				}
			);
		};
	} catch (err) {
		return { type: 'ERROR', payload: 'listenAppointments' + err };
	}
}

export function getDoctor(cuit) {
	return new Promise((resolve, reject) => {
		try {
			const docQuery = firestore.collection('providers').doc(cuit);
			docQuery
				.get()
				.then((doc) => {
					return resolve(doc.data());
				})
				.catch((err) => reject(err));
		} catch (err) {
			console.log(err);
		}
	});
}

export function getFeedback(cuit) {
	let docQuery = firestore
		.collection('events')
		.doc('feedback')
		.collection(cuit);
	// console.log(docQuery)
	return new Promise((resolve, reject) => {
		let feedback = [];
		docQuery
			.get()
			.then((snap) => {
				snap.forEach((data) => {
					feedback.push(data.data());
				});
				resolve(feedback);
			})
			.catch((err) => reject(err));
	});
}

export function getUser(dni) {
	return new Promise((resolve, reject) => {
		try {
			const authQuery = firestore.collection('users').doc(dni);
			authQuery
				.get()
				.then((user) => {
					return resolve(user.data());
				})
				.catch(function(error) {
					throw error;
				});
		} catch (error) {
			reject(error);
		}
	});
}

export function getAuth(uid) {
	return new Promise((resolve, reject) => {
		try {
			const authQuery = firestore.collection('user').doc(uid);
			authQuery
				.get()
				.then((doc) => {
					return resolve(doc.data());
				})
				.catch((err) => {
					console.log(err)
					reject(err)
				});
		} catch (error) {
			console.log(error)
			return reject(error);
		}
	});
}

export function getBills(dni) {
	return new Promise((resolve, reject) => {
		let bills = [];
		const authQuery = firestore
			.collection('services')
			.doc('bills')
			.collection(dni);
		authQuery
			.get()
			.then((doc) => {
				doc.forEach((d) => {
					bills.push(d.data());
					// console.log(d)
				});
				return resolve(bills);
			})
			.catch((err) => reject(err));
	});
}

export function getPatientData(ws) {
	try {
		const usersQuery = firestore
			.collection('auth')
			.doc(ws)
			.get();
		return (dispatch) => {
			dispatch({ type: 'LOADING', payload: true });
			usersQuery
				.then(function(doc) {
					if (doc.exists) {
						let data = doc.data();
						dispatch(getPatient(data));
						dispatch({ type: 'LOADING', payload: false });
						return 'exist';
					} else {
						dispatch({ type: 'ERROR', payload: 'No se encontraron usuarios' });
						dispatch({ type: 'LOADING', payload: false });
						return 'doesnt exist';
					}
				})
				.catch((err) => {
					// console.log(err);
					dispatch({
						type: 'ERROR',
						payload: 'getPatientData for ' + ws + err,
					});
					dispatch({ type: 'LOADING', payload: false });
				});
		};
	} catch (err) {
		return { type: 'ERROR', payload: ' getPatientData for ' + ws + err };
	}
}

export function getMedicalRecord(dni, ws){
    try {
        const usersQuery = firestore
            .collection('events')
            .doc('mr')
            .collection(dni)
            .where('patient.ws', '==', ws)
        return dispatch => {
            usersQuery.onSnapshot(subSnapshot => {
                var tempArray = [];
                subSnapshot.forEach(content => {
                    tempArray.push(content.data());
                });
                let result = tempArray.sort((a, b) => new Date(b.created_dt) - new Date(a.created_dt))
                dispatch({
                    type: 'GET_MEDICAL_RECORD',
                    payload: result
                });
            }, function(error) {
               console.log(error)
            });
        }
    } catch (err) {
        return { type: 'ERROR getMedicalRecord', err };
    }
}

export async function getUserMedicalRecord(dni, ws) {
	try {
		const query = firestore.collection(`events/mr/${dni}`).where('patient.ws', '==', ws);
		let arr = []
		await query.get()
			.then(async (res) => {
			await res.docs.forEach((content) => arr.push(content.data()))
			})
			.catch((err) => console.log(err))
		return arr
	} catch (err) {
		console.log(err)
	}
}

export function getVoucher(user) {
	try {
		const usersQuery = firestore
			.collection('events')
			.doc('mr')
			.collection(user)
			.orderBy('created_dt', 'desc')
			.limit(1);
		return (dispatch) => {
			usersQuery.onSnapshot(
				(subSnapshot) => {
					var tempArray = [];
					subSnapshot.forEach((content) => {
						let data = content.data();
						if (data.mr.dt_cierre !== '') {
							tempArray.push(content.data());
						}
					});
					dispatch(getOneRecord(tempArray));
				},
				function(error) {
					console.error(error);
				}
			);
		};
	} catch (err) {
		return { type: 'ERROR getVoucher', err };
	}
}

export function getVoucherById(user, aid) {
	try {
		const usersQuery = firestore
			.collection('events')
			.doc('mr')
			.collection(user)
			.doc(aid);
		return (dispatch) => {
			usersQuery.onSnapshot((doc) => {
				let data = doc.data();
				dispatch(getOneRecord(data));
			});
		};
	} catch (err) {
		return { type: 'ERROR', err };
	}
}

// eslint-disable-next-line react-hooks/exhaustive-deps
export function getAppointmentByDni(dni, collectionName) {
	if (dni !== '') {
		let appointments = [];
		let currentDate = moment(new Date())
			.tz('America/Argentina/Buenos_Aires')
			.format('YYYYMM');
		let compareDate = moment(new Date())
			.tz('America/Argentina/Buenos_Aires')
			.format('YYYY-MM-DD');
		let specialty = 'online_clinica_medica'; // Temporal, luego habrá más especialidades
		const query = firestore
			.collection('assignations')
			.doc(specialty)
			.collection(collectionName || currentDate)
			.where('appointments.0', 'array-contains', dni)
			.where('state', '==', 'ASSIGN');
		return new Promise((resolve, reject) => {
			query
				.get()
				.then((snap) => {
					snap.forEach((subDoc) => {
						let data = subDoc.data();
						// I compare the date just in case there is another appointment in the past days
						if (data.date >= compareDate) {
							appointments.push(data);
						}
					});
					return resolve(appointments[0]);
				})
				.catch((err) => reject(err));
		});
	}
}
