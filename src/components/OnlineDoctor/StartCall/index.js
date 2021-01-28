/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
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
	const firestore = db.firestore()
	const user = useSelector(state => state.user);
	const salatoken = useSelector((state) => state.queries.callSettings);
	const { loading } = useSelector((state) => state.front);

	useEffect(() => {
		dispatch({ type: 'LOADING', payload: true });
	}, []);

	useEffect(() => {
		if (salatoken.room !== '') {
			dispatch({ type: 'LOADING', payload: false });
		} else {
			if (user.ws) {
				try {
					let subscription, queryUser = firestore.doc(`auth/${user.ws}`)
					subscription = queryUser.onSnapshot(async function (doc) {
						let data = doc.data()
						if (data && data?._start_date !== '' && data._start_date) {
							let calldata = data?._start_date?.split('///')
								dispatch({ type: 'SET_CALL_ROOM', payload: { room: calldata?.[0], token: calldata?.[1], assignation: calldata?.[2] } })
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
	}, [salatoken, user]);

	return (
		<>
			<GenericHeader onClick={() => props.history.replace(`/home`)} profileDisabled={true}>
				Atención online
			</GenericHeader>
			<div className='call-container'>
				{salatoken?.token && salatoken.token !== '' ?
					<StartCall sala={salatoken.room} token={salatoken.token} />
				:
					<>
						{loading && <Loading centered={true} />}
						<div className='m-5 text-center'>
							Ocurrió un error al conectarse a la sala. Puede deberse a una conexión demasiado
							débil o que el médico ya haya cerrado la atención.
						</div>
						<FooterBtn mode='single' text='Volver' callback={() => props.history.replace(`/home`)} />
					</>
				}
			</div>
		</>
	);
};

export default withRouter(CallContainer);
