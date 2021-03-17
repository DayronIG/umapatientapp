/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Comments from './Comments.js';
import moment from 'moment';
import * as DetectRTC from 'detectrtc';
import { getUser, getFreeGuardia } from '../../../store/actions/firebaseQueries';
import enablePermissions from '../../Utils/enableVidAudPerms';
import DinamicScreen from '../../GeneralComponents/DinamicScreen';
import { Loader } from '../../GeneralComponents/Loading';
import MobileModal from '../../GeneralComponents/Modal/MobileModal';
import DoctorCard, { GuardCard } from './DoctorCard';
import Backbutton from '../../GeneralComponents/Backbutton';
import { findAllAssignedAppointment } from '../../Utils/appointmentsUtils';
import { getDocumentsByFilter, getDocumentFB } from '../../Utils/firebaseUtils';
import 'moment/locale/es';

const WhenScreen = (props) => {
	const modal = useSelector((state) => state.front.openDetails);
	const {active_guardia, active_list} = useSelector((state) => state.front);
	const permissions = useSelector((state) => state.front.mic_cam_permissions);
	const user = useSelector((state) => state.user);
	const [action, setAction] = useState('Loading');
	const [assignations, setAssignations] = useState([]);
	const [queue, setQueue] = useState("1")
	const [dni] = useState(props.match.params.dni);
	const [pediatric, setPediatric] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		// get params
		try {
			getDocumentFB('parametros/userapp/guardia/variables').then(res => {
				dispatch({type: 'SET_GUARDIA_VARIABLES', payload: res})
			})
		} catch(err) {
			console.log(err)
		}
	}, [])

	useEffect(() => {
		if (dni !== undefined) {
			dispatch({type: 'LOADING', payload: true})
			getUser(dni)
				.then((p) => {
					const type = moment().diff(p.dob, 'years') <= 16 ? 'pediatria' : '';
					setPediatric(type);
					let test = p.context === "temp" ? true : false
					findAssignedAppointments(p, type, test);
					dispatch({type: 'LOADING', payload: false})
				})
				.catch(function(error) {
					dispatch({type: 'LOADING', payload: false})
					return error;
				});
		}
	}, []);


	useEffect(() => {
		let hasWebcam, hasMicrophone;
		DetectRTC.load(function() {
			hasWebcam = DetectRTC.isWebsiteHasWebcamPermissions;
			hasMicrophone = DetectRTC.isWebsiteHasMicrophonePermissions;
			if (hasWebcam && hasMicrophone) dispatch({ type: 'SET_CAM_MIC_PERMISSIONS', payload: 'enabled' });
			else dispatch({ type: 'SET_CAM_MIC_PERMISSIONS', payload: 'disabled' });
		});
	}, []);

	async function findAssignedAppointments(person, type, test) {
		try {
			setAction('Loading');
			let assigned = undefined;
			if (person.group !== person.dni) {
				assigned = await findAllAssignedAppointment(person.dni, type);
			}
			if (assigned) {
				dispatch({ type: 'SET_ASSIGNED_APPOINTMENT', payload: assigned });
				return props.history.replace(`/onlinedoctor/queue/${person.dni}`);
			} else {
				return findFreeAppointments(person, type, test);
			}
		} catch (error) {
			// console.error(error)
			return props.history.replace('/');
		}
	}

	const findFreeAppointments = useCallback(async (person, type, test) => {
		try {
			let freeAppoints =  []
			freeAppoints = await getFreeGuardia(test, user.country, type); // WIP
			if (freeAppoints.length > 0) {
				setAssignations(freeAppoints);
				return setAction('Doctors');
			} else {
				return setAction('Empty');
			}
		} catch (error) {
			console.log(error)
			return props.history.replace('/');
		}
	}, [pediatric])

	useEffect(() => {
		let filters = [{field: 'state', value: 'ASSIGN', comparator: '=='}]
		getDocumentsByFilter(`/assignations/online_clinica_medica/bag`, filters)
			.then(res => {
				if(res.length > 0) {
					setQueue(res.length)
				}
			})
	}, [])


	return (
		<>
			{permissions === 'disabled' && (
				<MobileModal hideCloseButton='true' title='Habilite los permisos'>
					<p className='text-center'>
						Los permisos de cámara y micrófono son necesarios para utilizar el servicio. <br /> Haga click
						en 'Habilitar' y luego seleccione 'Permitir'.
					</p>
					<div
						className='btn btn-blue-lg'
						onClick={() =>
							dispatch({ type: 'SET_CAM_MIC_PERMISSIONS', payload: enablePermissions(user.dni) })
						}>
						Habilitar permisos
					</div>
					<div className='btn btn-blue-lg' onClick={() => props.history.push('/home')}>
						Volver
					</div>
				</MobileModal>
			)}
			{modal && (
				<MobileModal title='Comentarios' callback={() => dispatch({ type: 'TOGGLE_DETAIL', payload: false })}>
					<Comments />
				</MobileModal>
			)}
			<DinamicScreen>
				<Backbutton />
				<div className='when__container'>
					{(active_guardia || assignations.length < 1) && (<GuardCard 
						pediatric={pediatric} dni={dni} 
						queue={queue}
						doctorsCount={assignations.length} />)}
					{action === 'Loading' && (
						<div
							className='when__loading'>
							<Loader />
							<div className='p-3 text-center'>Buscando especialistas, esto puede demorar algunos segundos...</div>
						</div>
					)}
					{action === 'Doctors' && (active_list || user.context === 'temp') && (
						<div>
							{assignations?.map((assignation, index) => (
								<DoctorCard
									{...assignation}
									key={index}
									dni={dni}
								/>
							))}
						</div>
					)}
					<div className='btn btn-blue-lg mb-5' onClick={() => props.history.push('/home')}>
						Volver
					</div>
				</div>
			</DinamicScreen>
		</>
	);
};

export default withRouter(WhenScreen);
