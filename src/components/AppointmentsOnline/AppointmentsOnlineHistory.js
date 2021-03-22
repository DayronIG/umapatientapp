/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter, Link, useParams, useLocation } from 'react-router-dom';
import queryString from 'query-string'
import { GenericHeader } from '../GeneralComponents/Headers';
import { getMedicalRecord } from '../../store/actions/firebaseQueries';
import { Loader } from '../global/Spinner/Loaders';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment-timezone';
import axios from 'axios';
import swal from 'sweetalert';
import { user_cancel } from '../../config/endpoints';
import { getDependant } from '../../store/actions/firebaseQueries';
import tone from '../../assets/ring.mp3';
import '../../styles/TurnoConsultorio.scss';


const AppointmentsOnlineHistory = (props) => {
	const dispatch = useDispatch()
	const token = useSelector(state => state.userActive.token)
	const [medicalRecord, setMedicalRecord] = useState(props.mr || [])
	const [loading, setLoading] = useState(false)
	const { incomingCall } = useSelector(state => state.call)
	const currentUser = useSelector(state => state.userActive.currentUser)
	const { activeUid } = useParams()
	const location = useLocation()
    const params = queryString.parse(location.search)

	useEffect(() => {
		if (activeUid && activeUid !== currentUser.uid) {
			dispatch(getDependant(currentUser.uid, activeUid))
			findMR(currentUser.uid, activeUid)
		}
	}, [currentUser])

	useEffect(() => {
		try {
			var audioControl = document.getElementById('toneAudio')
			dispatch({ type: 'START_CALL' })
			if (audioControl !== null) {
				var interval = setInterval(() => {
					audioControl.play()
					try {
						window.navigator.vibrate(1000)
					} catch (err) { }
				}, 3000)
			}
			return () => clearInterval(interval)
		} catch (err) {
			alert(err)
		}
	}, [incomingCall, dispatch])


	async function findMR(uid, dependant) {
		setLoading(true)
		try {
			const medicRecs = await getMedicalRecord(uid, dependant)
			if (!!medicRecs && medicRecs.length) {
				let filteredRecords = []
				medicRecs.forEach(function (mr) {
					if (mr.mr_preds) {
						let scheduledTurn = mr.mr_preds.pre_clasif[0]
						const doctorName = mr.mr_preds.pre_clasif[1]
						const specialty = mr.mr_preds.pre_clasif[2]
						const date = mr.mr_preds.pre_clasif[3]
						const time = mr.mr_preds.pre_clasif[4]
						const path = mr.mr_preds.pre_clasif[5]
						if(mr.category && mr.category === "MI_ESPECIALISTA") {
							scheduledTurn = 'TurnoConsultorioOnline'
						}
						if (scheduledTurn === 'TurnoConsultorioOnline' && mr.mr.destino_final === "") {
							filteredRecords.push({ doctorName, specialty, date, time, mr, path })
						}
					}
				})
				setMedicalRecord(filteredRecords)
				setLoading(false)
			}
		} catch (error) {
			console.log(error)
			setLoading(false)
		}
	}

	async function cancelAppointment() {
		const confirmAction = await swal({
			title: 'Confirmar',
			text: 'Está seguro que desea cancelar el turno?',
			buttons: true,
			dangerMode: true,
		})
		if (confirmAction) {
			try {
				let date = moment().format('YYYY-MM-DD HH:mm:ss')
				let data = {
					ws: medicalRecord[0].mr.patient.ws,
					dni: medicalRecord[0].mr.patient.dni || '',
					dt: date || '',
					assignation_id: medicalRecord[0].mr.assignation_id || '',
					appointment_path: `assignations/${medicalRecord[0].path}` || '',
					type: 'cancel',
					complain: '',
					uid: currentUser.uid,
					uid_dependant: params.dependant === 'true' ? activeUid: false
				}
				await axios.post(user_cancel, data, {headers: { 'Content-Type': 'Application/Json', 'Authorization': token }})
				dispatch({ type: 'RESET_ALL' })
				return props.history.push('/home')
			} catch (err) {
				dispatch({ type: 'ERROR', payload: err })
				dispatch({ type: 'LOADING', payload: false })
				dispatch({ type: 'RESET_ALL' })
				return props.history.push('/home')
			}
		}
	}

	return (
		<div className="appointmentInPlace">
			<GenericHeader children="Turnos en consultorio" />
			<div className="successScheduledContainer">
				<div className="successScheduledContainer__container">
					<span className="successScheduledContainer__container--icon">
						<FontAwesomeIcon icon={faCheckCircle} />
					</span>
				</div>
				<div className="successScheduledContainer__container">
					<h5 className="successScheduledContainer__container--title">Usted tiene un turno</h5>
					<span className="successScheduledContainer__container--text">No olvides acudir a tu cita</span>
				</div>
			</div>
			{(!!medicalRecord && medicalRecord.length > 0) &&
				<>
					<div className="listScheduledAppoints">
						<ul className="listScheduledAppoints__list">
							{medicalRecord.map((mr, index) => (
								<li key={index} className="listScheduledAppoints__list--item">
									<span className="name">Doctor: <b>{mr.doctorName}</b></span> <br />
									<span className="specialty">Especialidad: {mr.specialty}</span><br />
									<span className="date">Fecha: {mr.date}</span> <br />
									<span className="time">Hora: {mr.time}</span> <br />
								</li>
							))}
						</ul>
					</div>
					{incomingCall &&
						<div style={{ textAlign: 'center', color: 'green' }}>
							<small>Su médico ya lo está esperando en la sala</small>
							<Link to={`/onlinedoctor/attention/${activeUid}?dependant=${params.dependant}`} replace={true}>
								<button
									type="button"
									className="btn btn-blue-lg btn-calling">
									Ingresar al consultorio
                                </button>
							</Link>
						</div>}
					<button className="btn btn-blue-lg btn-alert btn-cancel" onClick={() => cancelAppointment()}>Cancelar consulta</button>
					{incomingCall && <audio src={tone} id='toneAudio' autoPlay />}
				</>
			}
			<button className="btn btn-blue-lg btn-back" onClick={() => props.history.push('/home')}>Volver al inicio</button>
			{loading &&
				<div className="text-center mt-5">
					<Loader />
				</div>}
		</div>
	)
}

export default withRouter(AppointmentsOnlineHistory)