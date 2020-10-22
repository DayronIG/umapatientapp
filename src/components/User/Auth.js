import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import DBConnection, { askPermissionToRecieveNotifications } from "../../config/DBConnection";
import { getAuth } from '../../store/actions/firebaseQueries';
import isIos from '../Utils/isIos.js';
import Axios from "axios";
import { getDocumentFB } from '../Utils/firebaseUtils';
import { node_patient } from '../../config/endpoints';
import * as DetectRTC from 'detectrtc';
import { HiddenCacheClearer } from './VersionComponent';
import version from '../../config/version.json';
import moment from 'moment';

export const AuthContext = React.createContext()

function AuthProvider({ children }) {
	const dispatch = useDispatch()
	const [currentUser, setCurrentUser] = useState(() => DBConnection.auth().currentUser)
	const user = useSelector(state => state.queries.patient)
	const token = useSelector(state => state.userActive.token)

	useEffect(() => {  // Get authorization changes
		const unsubscribe = DBConnection.auth().onAuthStateChanged(setCurrentUser)
		return () => unsubscribe()
	}, [currentUser])

	useEffect(() => { // Get Device info and save messaging token(push notifications)
		if (currentUser && currentUser.email) {
			if(user && user.dni){
			DetectRTC.load(function () {
					const ios = isIos()
					if (!!window.chrome && !ios) {
						messaginTokenUpdate(currentUser, DetectRTC, true)
					} else {
						messaginTokenUpdate(currentUser, DetectRTC, false)
					}
				})
			}
			getInitialData(currentUser)
			currentUser.getIdToken().then(token => {
				localStorage.setItem(`token`, `Bearer ${token}`)
				dispatch({ type: 'SET_LOGED_TOKEN', payload: token })
			})
		}
	}, [currentUser])


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
				await handleSubmit(device)
			} catch (err) {
				console.log(err)
			}
		}
	}
	
	const handleSubmit = (device) => {
		let data = {
			newValues: { device },
		};
		Axios
			.patch(`${node_patient}/${user.dni}`, data,  {headers: { 'Content-Type': 'Application/json', Authorization: token }})
			.then((res) => {
				console.log("Device ok");
			})
			.catch((err) => {
				console.log(err);
			});
	};

	async function getInitialData(user) {
		if (user.email) {
			const userAuth = await getAuth(user.email.split("@")[0])
			let plan = undefined;
			let subscription = userAuth.subscription || userAuth.suscription || userAuth.subcription;
			if (!!subscription) {
				let path = `services/porfolio/${subscription.toUpperCase()}/active`
				plan = await getDocumentFB(path)
				if (!plan || !('onlinedoctor' in plan)) {
					plan = await getDocumentFB('services/porfolio/FREE/active')
				}
			} else if (!!userAuth) {
				plan = await getDocumentFB('services/porfolio/FREE/active')
			}
			if (!!userAuth) {
				dispatch({ type: 'GET_PATIENT', payload: userAuth })
				dispatch({ type: 'SET_PLAN_DATA', payload: plan })
			}
		}
	}

	return (
		<AuthContext.Provider value={{ currentUser }}>
			<HiddenCacheClearer />
			{children}
		</AuthContext.Provider>
	)
}

export default withRouter(AuthProvider)