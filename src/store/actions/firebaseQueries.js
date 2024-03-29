import DBConnection, {firebaseInitializeApp} from '../../config/DBConnection';
import {useDispatch} from 'react-redux';
import moment from 'moment-timezone';
const firestore = DBConnection.firestore(firebaseInitializeApp);

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


export async function getFreeGuardia(os = false, country = false, type = false) {
	let docQuery = []
	if(os !== false) {
		await firestore
			.collection(`assignations/guardia/${os}`)
			.get()
			.then(snap => {
				snap.forEach((element) => {
					docQuery.push(element.data())
				})
			})
			.catch(err => console.log(err))
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

export function getUserParentsFirebase(uid) {
	return new Promise(function(resolve, rejected) {
		let queryUser = firestore.collection('user').doc(uid).collection('dependants');
		queryUser
			.get()
			.then(async (family) => {
				let parentsTemp = [];
				await family.forEach((p) => {
					let data = p.data();
					let id = p.id
					if (p.exists && data.dni !== uid) parentsTemp.push({ ...data, did: id});
				});
				if (parentsTemp.length > 0) resolve(parentsTemp);
				else rejected('No hay parientes disponibles.');
			})
			.catch((err) => console.log(err));
	});
}

export function getBenficiaries(uid) {
	let queryUser = firestore.collection(`user/${uid}/dependants`);
	return (dispatch) => {
		queryUser.onSnapshot(
			(beneficiaries) => {
				let parentsTemp = [];
				beneficiaries.forEach((p) => {
					let data = p.data();
					if(parentsTemp.length === 0 || parentsTemp.find(el => {
						return el.dni !== data.dni
					})){
						parentsTemp.push({...data, id: p.ref.id} );
					}
				})
				dispatch({ type: 'GET_BENEFICIARIES', payload: parentsTemp });
				localStorage.setItem('beneficiaries', JSON.stringify(parentsTemp))
			}, (error) => console.log(error))
	}
}


export function getAntecedents(uid) {
	return dispatch => {
		try{
			firestore.doc(`user/${uid}/history/self`)
			.get()
			.then((user)=> {
				dispatch({type: 'GET_HISTORY', payload: user.data()})
				localStorage.setItem('userHistory', JSON.stringify(user.data()))
			})
			.catch(err => console.log(err))
		}catch(err) {
			console.error(err)
		}
	}
}

export function setAntecedentsActive() {
	return dispatch => {
		try{
			firestore.doc(`/parametros/userapp/profile/variables`)
			.get()
			.then((res)=> {
				dispatch({type: 'USER_HISTORY_ACTIVE', payload: res.data()})
			})
			.catch(err => console.log(err))
		}catch(err) {
			console.error(err)
		}
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

export function getDependant(uid, dependant = false) {
	return dispatch => {
		try {
			let authQuery = firestore.doc(`user/${uid}`)
			if(dependant){
				authQuery = firestore.doc(`user/${uid}/dependants/${dependant}`)
			}
			authQuery
				.get()
				.then((user) => {
					dispatch({type: 'GET_PATIENT', payload: user.data()});
				})
				.catch(function(error) {
					console.log(error)
				});
		} catch (error) {
			console.log(error);
		}
	};
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

export function getPrescriptions(uid) {
	try {
		return dispatch => {
			firestore.collection('events/prescriptions/AR').where("uid", "==", uid).get()
				.then(snap => {
					let prescriptions = []
					snap.forEach((el) => {
						prescriptions.push(el.data())
					})
					dispatch({type: 'SET_PRESCRIPTIONS', payload: prescriptions})
				})
				.catch(err => console.log(err))
			}
	// eslint-disable-next-line no-unreachable
	} catch (err){
		console.log(err)
	}
}

export function getDerivationStatus (uid) {
	return dispatch => {
		try{
			firestore.doc(`user/${uid}/active/derivation`)
			.onSnapshot(res => {
				try {
					if(res.exists) {
						dispatch({type: 'USER_DERIVATIONS', payload: {
							derivationActive: res.data().active,
							derivationStatus: res.data().status
						}})
					}
				}catch(err) {
					console.log(err)
				}
			})
		}catch(err) {
			console.log(err)
		}
	}
}

export function getMedicalRecord(uid, dependant = false){
	return dispatch => {
		try {
			const usersQuery = firestore
				.collection(`user/${uid}/medical_records`)
				usersQuery.onSnapshot(subSnapshot => {
					var tempArray = [];
					subSnapshot.forEach(content => {
						let data = content.data()
						// Esta condición que sigue puede ser confusa pero está bien, dejarla
						if(dependant === data.patient.dependant_uid) {
							tempArray.push(data);
						} else if(!dependant) {
							tempArray.push(data);
						}
					});
					let result = tempArray.sort((a, b) => new Date(b.created_dt) - new Date(a.created_dt))
					dispatch({
						type: 'GET_MEDICAL_RECORD',
						payload: result
					});
				}, function(error) {
				   console.log(error)
				});
		} catch (err) {
			console.log('ERROR getMedicalRecord', err);
		}
	}
}

export async function getUserMedicalRecord(uid, ws) {
	try {
		
		const query = firestore.collection(`user/${uid}/medical_records`).where('patient.ws', '==', ws);
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
			.collection('user')
			.doc(user)
			.collection('medical_records')
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
export function getAppointmentByUid(uid, collectionName, specialty = 'online_clinica_medica') {
	if (uid !== '') {
		let appointments = [];
		let currentDate = moment(new Date())
			.tz('America/Argentina/Buenos_Aires')
			.format('YYYYMM');
		let compareDate = moment(new Date())
			.tz('America/Argentina/Buenos_Aires')
			.format('YYYY-MM-DD');
		const query = firestore
			.collection('assignations')
			.doc(specialty)
			.collection(collectionName || currentDate)
			.where('patient.uid', '==', uid)
			.where('state', '==', 'ASSIGN');
		return new Promise((resolve, reject) => {
			query
				.get()
				.then((snap) => {
					snap.forEach((subDoc) => {
						let data = {
							...subDoc.data(),
							id: subDoc.ref.id,
							path: subDoc.ref.path
						};
						if(data) {
							appointments.push(data);
						}
					});
					return resolve(appointments[0]);
				})
				.catch((err) => reject(err));
		});
	}
}
