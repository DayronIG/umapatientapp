/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import StarRatings from 'react-star-ratings';
import moment from 'moment';
import * as DetectRTC from 'detectrtc';
import { getUser } from '../../../store/actions/firebaseQueries';
import enablePermissions from '../../Utils/enableVidAudPerms';
import DinamicScreen from '../../GeneralComponents/DinamicScreen';
import { Loader } from '../../GeneralComponents/Loading';
import Axios from 'axios';
import MobileModal from '../../GeneralComponents/Modal/MobileModal';
import DoctorCard, { GuardCard } from './DoctorCard';
import Backbutton from '../../GeneralComponents/Backbutton';
import { findAllAssignedAppointment, findAllFreeAppointments } from '../../Utils/appointmentsUtils';
import 'moment/locale/es';

const WhenScreen = (props) => {
	const token = useSelector((state) => state.userActive.token);
	const modal = useSelector((state) => state.front.openDetails);
	const permissions = useSelector((state) => state.front.mic_cam_permissions);
	const { feedback, patient } = useSelector((state) => state.queries);
	const [action, setAction] = useState('Loading');
	const [assignations, setAssignations] = useState([]);
	const [dni] = useState(props.match.params.dni);
	const [nocomments, setNocomments] = useState(false);
	const [pediatric, setPediatric] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		if (dni !== undefined) {
			getUser(dni)
				.then((p) => {
					const type = moment().diff(p.dob, 'years') <= 16 ? 'pediatria' : '';
					setPediatric(type ? true : false);
					findAssignedAppointments(p, type);
				})
				.catch(function(error) {
					return error;
				});
		}
	}, []);

	useEffect(() => {
		let haveComments = feedback.find((each) => each.notes !== '');
		if (!haveComments) {
			setNocomments(true);
		} else {
			setNocomments(false);
		}
	}, [feedback]);

	useEffect(() => {
		let hasWebcam, hasMicrophone;
		DetectRTC.load(function() {
			hasWebcam = DetectRTC.isWebsiteHasWebcamPermissions;
			hasMicrophone = DetectRTC.isWebsiteHasMicrophonePermissions;
			if (hasWebcam && hasMicrophone) dispatch({ type: 'SET_CAM_MIC_PERMISSIONS', payload: 'enabled' });
			else dispatch({ type: 'SET_CAM_MIC_PERMISSIONS', payload: 'disabled' });
		});
	}, []);

	async function findAssignedAppointments(person, type) {
		try {
			setAction('Loading');
			let assigned = undefined;
			// Check only when is for other person.
			if (person.group !== person.dni) {
				assigned = await findAllAssignedAppointment(person.dni, type);
			}
			if (assigned) {
				dispatch({ type: 'SET_ASSIGNED_APPOINTMENT', payload: assigned });
				return props.history.replace(`/${person.dni}/onlinedoctor/queue`);
			} else {
				return findFreeAppointments(person, type);
			}
		} catch (error) {
			// console.error(error)
			return props.history.replace('/');
		}
	}

	async function findFreeAppointments(person, type) {
		try {
			// Get free appointments from firebase.
			let freeAppoints;
			if (false && person.corporate_norm === 'PAMI') {
				/* Quitar el false para prod */
				freeAppoints = await findAllFreeAppointments(type, person.corporate_norm);
			} else {
				freeAppoints = await findAllFreeAppointments(type);
			}
			// Filter doctors by cuil
			if (freeAppoints.length > 0) {
				setAssignations(freeAppoints);
				return setAction('Doctors');
			} else {
				return setAction('Empty');
			}
		} catch (error) {
			return props.history.replace('/');
		}
	}

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
							dispatch({ type: 'SET_CAM_MIC_PERMISSIONS', payload: enablePermissions(patient.dni) })
						}>
						Habilitar permisos
					</div>
					<div className='btn btn-blue-lg' onClick={() => props.history.push('/')}>
						Volver
					</div>
				</MobileModal>
			)}
			{!!modal && (
				<MobileModal title='Comentarios'>
					<div className='feedback-container'>
						{nocomments && (
							<small className='feedback-no-comments'>Este médico aún no ha recibido comentarios</small>
						)}
						{feedback?.map(
							(comment) =>
								comment.notes !== '' && (
									<div className='feedback-comment' key={comment.dt}>
										<div className='feedback-stars'>
											{comment.doc_eval &&
												comment.doc_eval !== '' &&
												comment.doc_eval !== '0' && (
													<StarRatings
														rating={parseFloat(comment.doc_eval, 2)}
														starRatedColor='blue'
														numberOfStars={5}
														name='rating'
														starSpacing='1px'
														starDimension='15px'
													/>
												)}
										</div>
										{comment.notes}
										<div className='feedback-date'>
											{moment(comment.dt).format('DD/MM/YY hh:mm')}
										</div>
									</div>
								)
						)}
					</div>
				</MobileModal>
			)}
			<DinamicScreen>
				<div className='mt-3'>
					<Backbutton />
				</div>
				<div className='when__container'>
					{action === 'Loading' && (
						<div
							style={{
								margin: 'auto',
								width: '85vw',
								backgroundColor: 'white',
								borderRadius: '6px',
								minHeight: '360px',
							}}
							className='d-flex align-items-center justify-content-center flex-column mb-3'>
							<Loader />
							<div className='mt-5'>Cargando datos...</div>
						</div>
					)}
					{action !== 'Loading' && (
						<div className='mb-4'>
							<GuardCard pediatric={pediatric} dni={dni} />
						</div>
					)}
					{action === 'Doctors' && (
						<div>
							<div className='when-question'>O elija un {pediatric ? 'pediatra' : 'médico'}</div>
							{assignations?.map((assignation, index) => (
								<DoctorCard
									remaining={assignation.remaining}
									doctor={assignation}
									dni={dni}
									key={index}
								/>
							))}
						</div>
					)}
					{action === 'Empty' && (
						<div className='dinamic-time'>
							Aún no hemos encontrado turnos, por favor espere o seleccione médico de guardia.
						</div>
					)}
					<div className='btn btn-blue-lg mb-5' onClick={() => props.history.push('/')}>
						Volver
					</div>
				</div>
			</DinamicScreen>
		</>
	);
};

export default withRouter(WhenScreen);
