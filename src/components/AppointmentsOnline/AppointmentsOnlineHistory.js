/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { GenericHeader } from '../GeneralComponents/Headers';
import { getUserMedicalRecord } from '../../store/actions/firebaseQueries';
import { Loader } from '../global/Spinner/Loaders';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import axios from 'axios';
import swal from 'sweetalert';
import { user_cancel } from '../../config/endpoints';
import { getUser } from '../../store/actions/firebaseQueries';
import tone from '../../assets/ring.mp3';
import db from '../../config/DBConnection';
import '../../styles/TurnoConsultorio.scss';


const AppointmentsOnlineHistory = (props) => {
	const firestore = db.firestore()
	const dispatch = useDispatch()
	const token = useSelector(state => state.userActive.token)
	const patient = useSelector(state => state.queries.patient)
	const [medicalRecord, setMedicalRecord] = useState(props.mr || [])
	const [loading, setLoading] = useState(false)
	const { incomingCall } = useSelector(state => state.call)
	const { dni } = props.match.params

	useEffect(() => {
		if (dni) {
			getUser(dni)
				.then(res => {
					findMR(dni, res.ws)
					dispatch({ type: 'GET_PATIENT', payload: res })
				})
				.catch(err => console.log(err))
		}
	}, [])

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


	async function findMR(dni, ws) {
		setLoading(true)
		try {
			const medicRecs = await getUserMedicalRecord(dni, ws)
			if (!!medicRecs && medicRecs.length) {
				let filteredRecords = []
				medicRecs.forEach(function (mr) {
					if (mr.mr_preds) {
						const scheduledTurn = mr.mr_preds.pre_clasif[0]
						const doctorName = mr.mr_preds.pre_clasif[1]
						const specialty = mr.mr_preds.pre_clasif[2]
						const date = mr.mr_preds.pre_clasif[3]
						const time = mr.mr_preds.pre_clasif[4]
						const path = mr.mr_preds.pre_clasif[5]
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
					complain: ''
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
							<Link to={`/${dni}/onlinedoctor/attention/`} replace={true}>
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