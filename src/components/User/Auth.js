/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from "react";
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
			let plan = undefined;
			plan = await getCoverage(userAuth)
			// El siguiente código comentado quedaría en desuso
			/* let subscription = userAuth.subscription || userAuth.suscription || userAuth.subcription;
			if (!!subscription) {
				let path = `services/porfolio/${subscription.toUpperCase()}/active`
				plan = await getDocumentFB(path)
				if (!plan || !('onlinedoctor' in plan)) {
					plan = await getDocumentFB('services/porfolio/FREE/active')
				}
			} else if (!!userAuth) {
				plan = await getDocumentFB('services/porfolio/FREE/active')
			} */
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