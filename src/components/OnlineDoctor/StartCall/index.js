import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { GenericHeader } from '../../GeneralComponents/Headers';
import StartCall from './StartCall';
import DBConnection from '../../../config/DBConnection';
import FooterBtn from '../../GeneralComponents/FooterBtn';
import Loading from '../../GeneralComponents/Loading';
import { getDocumentFB } from '../../Utils/firebaseUtils';
import '@opentok/client';
import './polyfills';
import '../../../styles/onlinedoctor/Call.scss';

const CallContainer = (props) => {
	const dispatch = useDispatch();
	const [dni] = useState(props.match.params.dni);
	const salatoken = useSelector((state) => state.queries.callSettings);
	const { loading } = useSelector((state) => state.front);
	// const token = useSelector((state) => state.userActive.token);


	useEffect(() => {
		dispatch({ type: 'LOADING', payload: true });
	}, []);

	useEffect(() => {
		if (salatoken.room !== '') dispatch({ type: 'LOADING', payload: false });
		setTimeout(() => dispatch({ type: 'LOADING', payload: false }), 30000);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [salatoken]);


	useEffect(() => {
		const firestore = DBConnection.firestore();
		if (salatoken.room === '') {
			try {
				let queryUser = firestore.collection('auth').where('dni', '==', props.match.params.dni);
				queryUser.onSnapshot(async function(querySnapshot) {
					await querySnapshot.forEach((each) => {
						dispatch({ type: 'GET_PATIENT', payload: each.data() });
						let data = each.data()._start_date.split('///');
						if (data[0] !== salatoken.sala)
							dispatch({ type: 'SET_CALL_ROOM', payload: { room: data[0], token: data[1] } });
					});
				});
			} catch (err) {
				// console.error('FAILED QueryUser', err)
			}
		}
		dispatch({ type: 'START_CALL', payload: true });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.match.params.dni]);

	return (
		<>
			<GenericHeader onClick={() => props.history.replace(`/${dni}`)} profileDisabled={true}>
				Atención online
			</GenericHeader>
			<div className='call-container'>
				{salatoken.room !== '' ? (
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
						<FooterBtn mode='single' text='Volver' callback={() => props.history.replace(`/${dni}`)} />
					</>
				)}
			</div>
		</>
	);
};

export default withRouter(CallContainer);
