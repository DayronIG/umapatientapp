/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { GenericHeader } from '../../GeneralComponents/Headers';
import StartCall from './StartCall';
import FooterBtn from '../../GeneralComponents/FooterBtn';
import Loading from '../../GeneralComponents/Loading';
import Chat from './Chat';
import '@opentok/client';
import './polyfills';
import '../../../styles/onlinedoctor/Call.scss';

const CallContainer = (props) => {
	const dispatch = useDispatch();
	const [dni] = useState(props.match.params.dni);
	const salatoken = useSelector((state) => state.queries.callSettings);
	const { loading } = useSelector((state) => state.front);

	useEffect(() => {
		dispatch({ type: 'LOADING', payload: true });
	}, []);

	useEffect(() => {
		if (salatoken.room !== '') dispatch({ type: 'LOADING', payload: false });
		setTimeout(() => dispatch({ type: 'LOADING', payload: false }), 10000);
	}, [salatoken]);

	return (
		<>
			<GenericHeader onClick={() => props.history.replace(`/${dni}`)} profileDisabled={true}>
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
						<FooterBtn mode='single' text='Volver' callback={() => props.history.replace(`/${dni}`)} />
					</>
				}
			</div>
		</>
	);
};

export default withRouter(CallContainer);
