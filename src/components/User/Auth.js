/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-use-before-define */
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { withRouter, useHistory } from 'react-router-dom';
import { getAuth } from '../../store/actions/firebaseQueries';
import { getDocumentFB, snapDocumentsByFilter } from '../Utils/firebaseUtils';
import { HiddenCacheClearer } from './VersionComponent';
import db, { askPermissionToRecieveNotifications }  from '../../config/DBConnection';
import { node_patient } from '../../config/endpoints';
import version from '../../config/version.json';
import isIos from '../Utils/isIos.js';
import * as DetectRTC from 'detectrtc';
import Axios from "axios";
import moment from 'moment';
export const AuthContext = React.createContext()

function AuthProvider({ children }) {
	const dispatch = useDispatch()
	const history = useHistory()
	const [notification, setNotification] = useState(false)
	const [currentUser, setCurrentUser] = useState(() => db.auth().currentUser)
	const patient = useSelector(state => state.queries.patient)
    const { callRejected } = useSelector(store => store.call)
	const token = useSelector(state => state.userActive.token)
	const firestore = db.firestore()

    useEffect(() => {
		const unsubscribe = db.auth().onAuthStateChanged(setCurrentUser)
        if (patient.ws) {
			detectTokenAndDevice()
			getDeliveryInfo()
            listenDoctorCall(patient.ws)
        } else if (currentUser) {
			getInitialData(currentUser)
			currentUser.getIdToken().then(token => {
				localStorage.setItem(`token`, `Bearer ${token}`)
				dispatch({ type: 'SET_LOGED_TOKEN', payload: token })
			})
		}
		return () => unsubscribe()
	}, [patient, firestore, callRejected, currentUser, dispatch])
	
	function detectTokenAndDevice() {
		DetectRTC.load(function () {
			const ios = isIos()
			if (!!window.chrome && !ios) {
				messaginTokenUpdate(currentUser, DetectRTC, true)
			} else {
				messaginTokenUpdate(currentUser, DetectRTC, false)
			}
		})
	}

	function listenDoctorCall(ws) {
		try {
			let subscription, queryUser = firestore.doc(`auth/${ws}`)
			subscription = queryUser.onSnapshot(async function (doc) {
				let data = doc.data()
				if (data && data?._start_date !== '' && data._start_date) {
					let calldata = data?._start_date?.split('///')
					if (!callRejected && history.location.pathname !== '/:dni/onlinedoctor/attention/'){
						setNotification(true)
						dispatch({ type: 'SET_CALL_ROOM', payload: { room: calldata?.[0], token: calldata?.[1] } })
					}
				} else {
					setNotification(false)
					dispatch({ type: 'SET_CALL_ROOM', payload: { room: '', token: '' } })
				}
			})
			return () => {
				if (typeof subscription === 'function') {
					setNotification(false)
					subscription()
				}
			}
		} catch (error) {
			setNotification(false)
			console.log(error)
		}
	}

	async function messaginTokenUpdate(currentUser, deviceInfo, deviceWithPush) {
		//first we get the messaging token
		let userToken = ''
		if(deviceWithPush) {
			userToken = await askPermissionToRecieveNotifications()
		}
		// now we get the current user
		if (currentUser && currentUser.email) {
			try {
				let dt = moment().format('YYYY-MM-DD HH:mm:ss')
				let device = {
						messaging_token: userToken,
						device: deviceInfo.osName,
						os: deviceInfo.browser.name,
						last_login: dt,
						uma_version: version.patients
					}
				await updateDeviceInFirestore(device)
			} catch (err) {
				console.log(err)
			}
		}
	}
	
	const updateDeviceInFirestore = useCallback((device) => {
		let data = {
			newValues: { device },
		};
		Axios
			.patch(`${node_patient}/${patient.dni}`, data,  {headers: { 'Content-Type': 'Application/json', Authorization: token }})
			.then((res) => {
				console.log("Device ok");
			})
			.catch((err) => {
				console.log(err);
			});
    }, [patient])


    const getDeliveryInfo = useCallback(async()=> {
        const params = await getDocumentFB('parametros/userapp/delivery/hisopados')
		dispatch({type: 'SET_DELIVERY_PARAMS', payload: params})
		let filters =  [{field: 'status', value: ['ASSIGN:DELIVERY', "PREASSIGN", "ASSIGN:ARRIVED", "DONE:RESULT"], comparator: 'in'}, {field: 'patient.dni', value: patient.dni, comparator: '=='}]
		await snapDocumentsByFilter('events/requests/delivery', filters, (data) => dispatch({type: 'SET_DELIVERY', payload: [data]}))
    }, [patient])

	async function getInitialData(user) {
		if (user.email) {
			const userAuth = await getAuth(user.email.split("@")[0])
			let plan = undefined;
			plan = await getCoverage(userAuth)
			// El siguiente código comentado quedaría en desuso
			if (!!userAuth) {
				dispatch({ type: 'GET_PATIENT', payload: userAuth })
				dispatch({ type: 'SET_PLAN_DATA', payload: plan })
			}
		}
	}	
	
	const getCoverage = async (user) => {
		// Busco BASIC primero porque es el básico sin ningun permiso
		let plan = await getDocumentFB('services/porfolio/BASIC/active')
		let free = await getDocumentFB('services/porfolio/FREE/active')
		if(plan && free) {
			plan["onlinedoctor"] = free.onlinedoctor
		}
		if (!!user.coverage && Array.isArray(user.coverage) && plan) { 
			// Este else if es el mas importante. 
			// Un usuario puede tener multiples subscriptions
			// El usuario tiene como servicios el resultado de la sumatoria de ellos (de los true)
			user.coverage.forEach(async each => {
				if(each?.plan) {
					let path = `services/porfolio/${each?.plan?.toUpperCase()}/active`
					let coverageTemp = await getDocumentFB(path)
					for (const service in coverageTemp) {
						if(coverageTemp[service] === true) {
							plan.plan[service] = true
						}
					}
				}
			})
		}
		return plan
	}



	return (
		<AuthContext.Provider value={{ currentUser }}>
			<HiddenCacheClearer />
			{children}
		</AuthContext.Provider>
	)
}

export default withRouter(AuthProvider)