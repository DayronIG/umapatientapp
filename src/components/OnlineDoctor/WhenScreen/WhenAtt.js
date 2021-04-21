/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter, useParams, useLocation } from 'react-router-dom';
import db , {firebaseInitializeApp} from '../../../config/DBConnection';
import queryString from 'query-string'
import moment from 'moment';
import axios from 'axios';
import {NODE_SERVER} from '../../../config/endpoints'
import * as DetectRTC from 'detectrtc';
import Comments from './Comments.js';
import { Loader } from '../../GeneralComponents/Loading';
import MobileModal from '../../GeneralComponents/Modal/MobileModal';
import Advice from '../AttQueue/Advice';
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
	const {active_guardia, active_guardia_ec, active_list, guardia_advice} = useSelector((state) => state.front);
	const permissions = useSelector((state) => state.front.mic_cam_permissions);
	const user = useSelector((state) => state.user);
	const {currentUser} = useSelector((state) => state.userActive);
	const [action, setAction] = useState('Empty');
	const [assignations, setAssignations] = useState([]);
	const [queue, setQueue] = useState("1")
	const [pediatric, setPediatric] = useState(false);
	const dispatch = useDispatch();
	const { activeUid, aid } = useParams()
	const location = useLocation()
    const params = queryString.parse(location.search)
	
	useEffect(() => {
		if(params.aid) {
			localStorage.setItem('external_reference', params.aid)
			loginExternal()
		}
	}, [])

	const loginExternal = useCallback(async () => {
		dispatch({ type: 'LOADING', payload: true })
		await axios.post(`${NODE_SERVER}/uma/sendCode`, { uid: activeUid }, { headers: { 'Content-Type': 'application/json' } })
			.then(res => {
				if(res.data.code) {
				db.auth(firebaseInitializeApp)
					.signInWithEmailAndPassword(`${res.data.ws}@${res.data.code}.com`, res.data.code)
					.then((reg) => {
						console.log("Loged in")
					})
					.catch(err => console.log(err))
				}
			})
			.catch(err => console.log(err))
		dispatch({ type: 'LOADING', payload: false })
	}, [activeUid])

	useEffect(() => {
		dispatch({ type: 'SET_ASSIGNED_APPOINTMENT', payload: {}})
	}, [])

	useEffect(() => {
		if (activeUid && currentUser && activeUid !== currentUser?.uid && !params.aid) {
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
		// get params
		try {
			getDocumentFB('parametros/userapp/guardia/variables').then(res => {
				dispatch({type: 'SET_GUARDIA_VARIABLES', payload: res})
			})
			getDocumentFB(`/assignations/guardia/stats/${moment().tz('America/Argentina/Buenos_Aires').subtract(1, 'minutes')
			.format('YYYYMMDDHHmm')}`).then(res => {
				dispatch({type: 'SET_GUARDIA_STATS', payload: res})
			})
		} catch(err) {
			console.log(err)
		}
	}, [])


	useEffect(() => {
		if(user) {
			let os = user.context === "test" ? "test" : false
			if(user.corporate_norm === "VALE") {
				os = "EC"
			}
			const type = moment().diff(user.dob, 'years') <= 16 ? 'pediatria' : '';
			setPediatric(type);
			findAssignedAppointments(user, type, os);
		}
	}, [user])

	async function findAssignedAppointments(person, type, os) {
		if(currentUser.uid){
			try {
				setAction('Loading');
				if(currentUser) {
					let assigned = await findAllAssignedAppointment(currentUser?.uid, type);
					if (assigned) {
						dispatch({ type: 'SET_ASSIGNED_APPOINTMENT', payload: assigned });
						return props.history.replace(`/onlinedoctor/queue/${activeUid}?dependant=${params.dependant}`);
					} else {
						return findFreeAppointments(person, type, os);
					}
				} else {
					setAction('Empty');
				}
			} catch (error) {
				console.error("Error", error)
				return props.history.replace('/');
			}
		} else {
			setAction("Empty")
		}
	}

	const findFreeAppointments = useCallback(async (person, type, os) => {
		try {
			let freeAppoints =  []
			freeAppoints = await getFreeGuardia(os, user.country, type); // WIP
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
					{guardia_advice && user.country === "AR" && <Advice text={guardia_advice} />}
					{((active_guardia && user.corporate_norm !== "VALE")
						|| pediatric) 
						&& <GuardCard pediatric={pediatric} dni={user.dni} doctorsCount={assignations.length} queue={queue} />}
					{((active_list && action === 'Doctors') || user.context === "temp" || user.corporate_norm === "VALE") && (
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
