/* eslint-disable no-use-before-define */
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import DBConnection from "../../config/DBConnection";
import { getAuth } from '../../store/actions/firebaseQueries';
import { getDocumentFB } from '../Utils/firebaseUtils';
import { HiddenCacheClearer } from './VersionComponent';

export const AuthContext = React.createContext()

function AuthProvider({ children }) {
	const dispatch = useDispatch()
	const [currentUser, setCurrentUser] = useState(() => DBConnection.auth().currentUser)

	useEffect(() => {  // Get authorization changes
		const unsubscribe = DBConnection.auth().onAuthStateChanged(setCurrentUser)
		return () => unsubscribe()
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
			// Busco BASIC primero porque es el básico sin ningun permiso
			let plan = await getDocumentFB('services/porfolio/JAJAMON/active')
			let subscription = userAuth.subscription || userAuth.suscription || userAuth.subcription;	
			if (!!subscription && typeof subscription === "string") {
				let path = `services/porfolio/${subscription.toUpperCase()}/active`
				plan = await getDocumentFB(path)
			} else if (!!subscription && Array.isArray(subscription)) { 
				// Este else if es el mas importante. 
				// Un usuario puede tener multiples subscriptions
				// El usuario tiene como servicios el resultado de la sumatoria de ellos (de los true)
				subscription.forEach(async each => {
					let path = `services/porfolio/${each.toUpperCase()}/active`
					let tempPlan = await getDocumentFB(path)
					for (const service in tempPlan) {
						if(tempPlan[service] === true) {
							plan[service] = true
						}
					}
				})
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