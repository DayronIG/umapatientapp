import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import db, {firebaseInitializeApp} from "../../config/DBConnection";
import { getAuth } from '../../store/actions/firebaseQueries';
import { getDocumentFB, snapDocumentsByFilter } from '../Utils/firebaseUtils';
import { HiddenCacheClearer } from './VersionComponent';
export const AuthContext = React.createContext()

function AuthProvider({ children }) {
	const dispatch = useDispatch()
	const [currentUser, setCurrentUser] = useState(() => db.auth(firebaseInitializeApp).currentUser)

	useEffect(() => {  // Get authorization changes
		const unsubscribe = db.auth(firebaseInitializeApp).onAuthStateChanged(setCurrentUser)
		dispatch({ type: 'SET_LOGED_ACTIVE', payload: currentUser })
		if(currentUser) {
			getInitialData(currentUser)
		}
		return () => unsubscribe()
	}, [currentUser])

	useEffect(() => {
		if (currentUser) {
			currentUser.getIdToken().then(token => {
				localStorage.setItem(`token`, `Bearer ${token}`)
				dispatch({ type: 'SET_LOGED_TOKEN', payload: token })
			})
		}
	})

    async function getDeliveryInfo(userAuth) {
		const params = await getDocumentFB('parametros/userapp/delivery/hisopados')
		dispatch({type: 'SET_DELIVERY_PARAMS', payload: params})
		if(userAuth.dni) {
			let filters =  [{field: 'status', value: ["PREASSIGN", "ASSIGN:DELIVERY", "ASSIGN:ARRIVED", "DONE:RESULT", "FREE:IN_RANGE", 'IN_PROCESS', 'FREE'], comparator: 'in'}, {field: 'patient.uid', value: userAuth.core_id, comparator: '=='}]
			await snapDocumentsByFilter('events/requests/delivery', filters, (data) => {
				if(data.length > 0) {
					dispatch({type: 'CLEAN_DELIVERY', payload: "CLEAN"})
					dispatch({type: 'SET_DELIVERY_ALL', payload: data})
				}
			})
		}
	}


	async function getInitialData(user) {
		const userAuth = await getAuth(user.uid)
		let plan = undefined;
		plan = await getCoverage(userAuth)
		if (!!userAuth) {
			dispatch({ type: 'GET_PATIENT', payload: userAuth })
			dispatch({ type: 'SET_PLAN_DATA', payload: plan })
			getDeliveryInfo(userAuth)
		}
	}	
	
	const getCoverage = async (user) => {
		// Busco BASIC primero porque es el básico sin ningun permiso
		let plan = await getDocumentFB('services/porfolio/BASIC/active')
		let free = await getDocumentFB('services/porfolio/FREE/active')
		if(plan && free) {
			plan["onlinedoctor"] = free.onlinedoctor
		}
		if (!!user?.coverage && Array.isArray(user?.coverage) && plan) { 
			// Este else if es el mas importante. 
			// Un usuario puede tener multiples subscriptions
			// El usuario tiene como servicios el resultado de la sumatoria de ellos (de los true)
			user && user.coverage && user.coverage.forEach(async each => {
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

export default AuthProvider