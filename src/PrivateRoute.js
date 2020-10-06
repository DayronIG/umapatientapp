import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { Route, withRouter } from "react-router-dom";
import { AuthContext } from "./components/User/Auth";
import LoginComponent from "./components/User/Login";
import db from './config/DBConnection';
import Loading from './components/GeneralComponents/Loading';
import ToastNotification from '../src/components/GeneralComponents/toastNotification'
import tone from '../src/assets/ring.mp3'

const Login = () => {
	const [delay, setDelay] = useState(false)

	useEffect(() => {
		let timeout = setTimeout(() => setDelay(true), 2000)
		return () => clearTimeout(timeout)
	}, [])

	if (delay) {
		return <LoginComponent />
	} else {
		return <Loading />
	}
}


const PrivateRoute = ({ component: RouteComponent, authed, ...rest }) => {
	const dispatch = useDispatch();
	const firestore = db.firestore();
	const { currentUser } = useContext(AuthContext);
	const { patient } = useSelector(store => store.queries);
	const [notification, setNotification] = useState(false);

	useEffect(() => {
		if (patient.ws) {
			try {
				let subscription, queryUser = firestore.doc(`auth/${patient.ws}`);
				subscription = queryUser.onSnapshot(async function (doc) {
					let user = doc.data()
					if (user?._start_date !== undefined && user?._start_date !== '' && user?._start_date !== 'geo') {
						let data = user?._start_date?.split('///');
						setNotification(true);
						dispatch({ type: 'SET_CALL_ROOM', payload: { room: data?.[0] || '', token: data?.[1] || '' } });
						setTimeout(() => {
							setNotification(false);
						}, 10000)
					} else {
						setNotification(false);
						dispatch({ type: 'SET_CALL_ROOM', payload: { room: '', token: '' } });
					}
				});
				return () => {
					if (typeof subscription === 'function') subscription();
				}
			} catch (error) {
				console.log(error)
			}
		}
	}, [patient, RouteComponent])

	return (
		<>
			{notification &&
				<ToastNotification
					title='Tu profesional te está llamando...'
					button='Ingresar'
					action={`/${patient.dni}/onlinedoctor/attention/`}
					unsetNotification={setNotification}
					audio={tone}
				/>
			}
			<Route
				{...rest}
				render={routeProps =>
					!!currentUser ? <RouteComponent {...routeProps} /> : <Login />
				}
			/>
		</>
	)
}


export default withRouter(PrivateRoute)