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
		if(currentUser) {
			getInitialData(currentUser)
			currentUser.getIdToken().then(token => {
				localStorage.setItem(`token`, `Bearer ${token}`)
				dispatch({ type: 'SET_LOGED_TOKEN', payload: token })
			})
		}
		return () => unsubscribe()
	}, [currentUser])

	const getInitialData = useCallback(async () => {
		if (currentUser.email) {
			console.log(currentUser)
			debugger
			const userAuth = await getAuth(currentUser.email.split("@")[0])
			console.log(userAuth)
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
	}, [currentUser])

	return (
		<AuthContext.Provider value={{ currentUser }}>
			<HiddenCacheClearer />
			{children}
		</AuthContext.Provider>
	)
}

export default withRouter(AuthProvider)