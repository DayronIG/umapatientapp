import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import * as DetectRTC from 'detectrtc';
import axios from 'axios';
import { GenericHeader } from '../../GeneralComponents/Headers';
import StartCall from './StartCall';
import DBConnection from '../../../config/DBConnection';
import { device_info } from '../../../config/endpoints';
import FooterBtn from '../../GeneralComponents/FooterBtn';
import Loading from '../../GeneralComponents/Loading';
import { listenRedirectionGeo } from '../../../store/actions/deliveryActions';
import { getDocumentFB } from '../../Utils/firebaseUtils';
import '@opentok/client';
import './polyfills';
import '../../../styles/onlinedoctor/Call.scss';

const CallContainer = () => {
	const dispatch = useDispatch();
	const [firestore] = useState(DBConnection.firestore());
	const currentAssignation = useSelector((state) => state.assignations.current);
	const { redirectionIndicator, currentService } = useSelector((state) => state.deliveryService);
	const salatoken = useSelector((state) => state.queries.callSettings);
	const { loading } = useSelector((state) => state.front);
	const { patient } = useSelector((state) => state.queries);
	const { dni } = useParams();
	const history = useHistory();
	// const token = useSelector((state) => state.userActive.token);
	// const calling = useSelector(state => state.call.call)

	useEffect(() => {
		DetectRTC.load(() => {
			let headers = { 'Content-Type': 'Application/json' /*, 'Authorization': token */ };
			axios.post(device_info, { ws: `[${dni}] Ingresa a la consulta`, data: DetectRTC });
		});
	}, []);

	useEffect(() => {
		dispatch({ type: 'LOADING', payload: true });
		if (salatoken.room !== '') dispatch({ type: 'LOADING', payload: false });
		setTimeout(() => dispatch({ type: 'LOADING', payload: false }), 20000);
	}, [salatoken]);

	useEffect(() => {
		let queryUser
		if (salatoken.room === '') {
			try {
				queryUser = firestore.collection('auth').where('dni', '==', dni);
				queryUser.onSnapshot(function (querySnapshot) {
					querySnapshot.forEach((each) => {
						dispatch({ type: 'GET_PATIENT', payload: each.data() });
						let data = each.data()._start_date.split('///');
						if (data[0] !== salatoken.sala && data[1])
							dispatch({ type: 'SET_CALL_ROOM', payload: { room: data[0], token: data[1] } });
					});
				});
			} catch (err) {
				// console.error('FAILED QueryUser', err)
			}
		}
		dispatch({ type: 'START_CALL', payload: true });
		if(typeof queryUser === "function") {
			return () => {
				queryUser() 
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dni]);

	useEffect(() => {
		let queryEvent
		try {
			queryEvent = firestore.collection('events/requests/online').doc(patient.incidente_id).onSnapshot((snap) => {
				let data = snap.data()
				if(data?.status_derivacion === "PREASSIGN") {
					history.replace(`/${patient.ws}/delivery/progress/${data.incidente_id}`);
				}
				dispatch({type: 'SET_CURRENT_SERVICE', payload: data })
				dispatch({ type: 'LOADING', payload: false })
			})
		} catch (err) {
			// console.error('FAILED QueryUser', err)
		}

		if(typeof queryEvent === "function") {
			return () => {
				queryEvent()
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [patient]);

	useEffect(() => {
		if (patient.ws) {
			const unsubscribe = listenRedirectionGeo(patient.ws);
			return () => {
				if (typeof unsubscribe === 'function') unsubscribe();
			}
		}
	}, [patient]);

	useEffect(() => {
		if (redirectionIndicator === 'geo' || currentService?.status_derivacion === "PREASSIGN") {
			(async function listenChanges() {
				const assignationId = currentAssignation.appointments?.[0]?.[14];
				if (!assignationId) return null;
				try {
					const events_mr = await getDocumentFB(`/events/mr/${dni}/${assignationId}`);
					console.log(events_mr);
					if (events_mr.incidente_id) {
						history.replace(`/${patient.ws}/delivery/progress/${events_mr.incidente_id}`);
					} else {
						history.replace('/feedback');
					}
				} catch (error) {
					console.error(error);
					history.replace('/feedback');
				}
			})();
		}
	}, [redirectionIndicator]);

	return (
		<>
			<GenericHeader onClick={() => history.replace(`/${dni}`)} profileDisabled={true}>
				Atención online
			</GenericHeader>
			<div className='call-container'>
				{salatoken.room !== '' && salatoken.token !== '' ? (
					<StartCall sala={salatoken.room} token={salatoken.token} />
				) : (
						<>
							{loading && <Loading centered={true} />}
							<div className='m-5 text-center'>
								<p>
									<b>
										Ocurrió un error al conectarse a la sala. Puede deberse a una conexión demasiado
										débil o que el médico ya haya cerrado la atención.
								</b>
								</p>
							</div>
							<FooterBtn mode='single' text='Volver' callback={() => history.replace(`/${dni}`)} />
						</>
					)}
			</div>
		</>
	);
};

export default CallContainer;
