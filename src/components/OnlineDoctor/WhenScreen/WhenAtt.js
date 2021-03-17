/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter, useParams, useLocation } from 'react-router-dom';
import queryString from 'query-string'
import moment from 'moment';
import * as DetectRTC from 'detectrtc';
import Comments from './Comments.js';
import { Loader } from '../../GeneralComponents/Loading';
import MobileModal from '../../GeneralComponents/Modal/MobileModal';
import DoctorCard, { GuardCard } from './DoctorCard';
import DinamicScreen from '../../GeneralComponents/DinamicScreen';
import Backbutton from '../../GeneralComponents/Backbutton';
import { getDependant, getFreeGuardia } from '../../../store/actions/firebaseQueries';
import enablePermissions from '../../Utils/enableVidAudPerms';
import { findAllAssignedAppointment } from '../../Utils/appointmentsUtils';
import { getDocumentsByFilter, getDocumentFB } from '../../Utils/firebaseUtils';
import 'moment/locale/es';

const WhenScreen = (props) => {
	const modal = useSelector((state) => state.front.openDetails);
	const {active_guardia, active_list} = useSelector((state) => state.front);
	const permissions = useSelector((state) => state.front.mic_cam_permissions);
	const user = useSelector((state) => state.user);
	const {currentUser} = useSelector((state) => state.userActive);
	const [action, setAction] = useState('Loading');
	const [assignations, setAssignations] = useState([]);
	const [queue, setQueue] = useState("1")
	const [pediatric, setPediatric] = useState(false);
	const dispatch = useDispatch();
	const { activeUid } = useParams()
	const location = useLocation()
    const params = queryString.parse(location.search)

	useEffect(() => {
		if (activeUid && currentUser && activeUid !== currentUser?.uid) {
			dispatch(getDependant(currentUser.uid, activeUid))
		}
	}, [currentUser, activeUid]);

	useEffect(() => {
		let hasWebcam, hasMicrophone;
		DetectRTC.load(function() {
			hasWebcam = DetectRTC.isWebsiteHasWebcamPermissions;
			hasMicrophone = DetectRTC.isWebsiteHasMicrophonePermissions;
			if (hasWebcam && hasMicrophone) dispatch({ type: 'SET_CAM_MIC_PERMISSIONS', payload: 'enabled' });
			else dispatch({ type: 'SET_CAM_MIC_PERMISSIONS', payload: 'disabled' });
		});
	}, []);

	useEffect(() => {
		if(user) {
			let test = user.context === "temp" ? true : false
			const type = moment().diff(user.dob, 'years') <= 16 ? 'pediatria' : '';
			setPediatric(type);
			findAssignedAppointments(user, type, test);
		}
	}, [user])

	async function findAssignedAppointments(person, type, test) {
		try {
			setAction('Loading');
			let assigned = await findAllAssignedAppointment(currentUser?.uid, type);
			if (assigned) {
				dispatch({ type: 'SET_ASSIGNED_APPOINTMENT', payload: assigned });
				return props.history.replace(`/onlinedoctor/queue/${activeUid}?dependant=${params.dependant}`);
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
					{(active_guardia || action === 'Empty') && <GuardCard pediatric={pediatric} dni={user.dni} doctorsCount={assignations.length} queue={queue} />}
					{active_list && action === 'Doctors' && (
						<div>
							{assignations?.map((assignation, index) => (
								<DoctorCard
									{...assignation}
									key={index}
									dni={user.dni}
								/>
								))}
						</div>
					)}
					{user.context === "temp" &&  <div>
							{assignations?.map((assignation, index) => (
								<DoctorCard
									{...assignation}
									key={index}
									dni={user.dni}
								/>
								))}
						</div>}
					{action === 'Loading' && (
						<div className='when__loading'>
							<Loader />
							<div className='p-3 text-center'>Buscando especialistas, esto puede demorar algunos segundos...</div>
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
