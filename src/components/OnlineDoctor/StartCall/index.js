/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { GenericHeader } from '../../GeneralComponents/Headers';
import StartCall from './StartCall';
import FooterBtn from '../../GeneralComponents/FooterBtn';
import Loading from '../../GeneralComponents/Loading';
import db  from '../../../config/DBConnection';
import '@opentok/client';
import './polyfills';
import '../../../styles/onlinedoctor/Call.scss';

const CallContainer = (props) => {
	const dispatch = useDispatch();
	const history = useHistory();
	const firestore = db.firestore()
	const user = useSelector(state => state.user);
	const call = useSelector((state) => state.call);
	const {activeUid} = useParams()
	const location = useLocation()
	const {dependant} = queryString(location.search)
	const { loading } = useSelector((state) => state.front);
	const { currentUser } = useSelector(state => state.userActive)


	useEffect(() => {
		dispatch({ type: 'LOADING', payload: true });
	}, []);

	useEffect(() => {
		if (call.room !== '') {
			dispatch({ type: 'LOADING', payload: false });
		} else {
			if (user.ws) {
				try {
					let subscription, queryUser = firestore.doc(`user/${currentUser.uid}`)
					subscription = queryUser.onSnapshot(async function (doc) {
						let data = doc.data()
						if (data && data?.call?.room !== '') {
								dispatch(
									{ 
										type: 'SET_CALL_ROOM', 
										payload: { 
											activeUid: data.call.activeUid,
											assignation_id: data.call.assignation_id,
											dependant: data.call.dependant,
											date: data.call.date,
											room: data.call.room, 
											token: data.call.token, 

										} 
									})
						}
					})
					return () => {
						if (typeof subscription === 'function') {
							subscription()
						}
					}
				} catch (error) {
					console.log(error)
				}
			}
		}
		setTimeout(() => dispatch({ type: 'LOADING', payload: false }), 10000);
	}, [call, user]);

	return (
		<>
			<GenericHeader onClick={() => history.replace(`/home`)} profileDisabled={true}>
				Atención online
			</GenericHeader>
			<div className='call-container'>
				{call?.token && call.token !== '' ?
					<StartCall sala={call.room} token={call.token} activeUid={activeUid} dependant={dependant} />
				:
					<>
						{loading && <Loading centered={true} />}
						<div className='m-5 text-center'>
							Ocurrió un error al conectarse a la sala. Puede deberse a una conexión demasiado
							débil o que el médico ya haya cerrado la atención.
						</div>
						<FooterBtn mode='single' text='Volver' callback={() => history.replace(`/home`)} />
					</>
				}
			</div>
		</>
	);
};

export default CallContainer;
