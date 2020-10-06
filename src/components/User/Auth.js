import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import DBConnection, { askPermissionToRecieveNotifications } from "../../config/DBConnection";
import { getAuth } from '../../store/actions/firebaseQueries';
import isIos from '../Utils/isIos.js';
import Axios from "axios";
import { getDocumentFB } from '../Utils/firebaseUtils';
import { push_token } from '../../config/endpoints';
import * as DetectRTC from 'detectrtc';

export const AuthContext = React.createContext()

function AuthProvider({ children }) {
	const dispatch = useDispatch()
	const [currentUser, setCurrentUser] = useState(() => DBConnection.auth().currentUser)

	useEffect(() => {  // Get authorization changes
		const unsubscribe = DBConnection.auth().onAuthStateChanged(setCurrentUser)
		return () => unsubscribe()
	}, [currentUser])


	useEffect(() => { // Get Device info and save messaging token(push notifications)
		DetectRTC.load(function () {
			if (currentUser && currentUser.email) {
				const ios = isIos()
				if (!ios) {
					messaginTokenUpdate(currentUser, DetectRTC)
				}
			}
		})
	}, [currentUser])

	useEffect(() => {
		if (currentUser) {
			getInitialData(currentUser)
			currentUser.getIdToken().then(token => {
				localStorage.setItem(`token`, `Bearer ${token}`)
				dispatch({ type: 'SET_LOGED_TOKEN', payload: token })
			})
		}
	})

	async function getInitialData(user) {
		if (user.email) {
			const userAuth = await getAuth(user.email.split("@")[0])
			let plan = undefined;
			const subscription = userAuth?.suscription || userAuth?.subscription;
			if (!!subscription) {
				plan = await getDocumentFB(`services/porfolio/${subscription.toUpperCase()}/active`)
				if (!plan || !('onlinedoctor' in plan)) {
					plan = await getDocumentFB('services/porfolio/FREE/active')
				}
			} else if (userAuth) {
				plan = await getDocumentFB('services/porfolio/FREE/active')
			}
			if (userAuth) {
				dispatch({ type: 'GET_PATIENT', payload: userAuth })
				dispatch({ type: 'SET_PLAN_DATA', payload: plan })
			}
		}
	}

	return (
		<AuthContext.Provider value={{ currentUser }}>
			{children}
		</AuthContext.Provider>
	)
}

async function messaginTokenUpdate(currentUser, device) {
	//first we get the messaging token
	const userToken = await askPermissionToRecieveNotifications()
	// now we get the current user
	if (currentUser && currentUser.email) {
		let ws = currentUser.email.split('@')[0]
		// const patient = await getDocumentFB(`auth/${ws}`)
		// if the messaging_token doesn't exist or is different than the userToken we update the document
		try {
			let data = {
				ws,
				device: {
					messaging_token: userToken,
					device: device.osName,
					os: device.browser.name
				}
			}
			let headers = { 'Content-Type': 'Application/Json'/* , 'Authorization': localStorage.getItem('token') */ }
			Axios.post(push_token, data, headers)
		} catch (err) {
			// console.log(err)
		}
	}
}

export default withRouter(AuthProvider)