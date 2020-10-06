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
	// const firestore = db.firestore();
	// const patient = useSelector(state => state.queries.patient);
	const dispatch = useDispatch();
	const token = useSelector(state => state.userActive.token);
	const [medicalRecord, setMedicalRecord] = useState(props.mr || []);
	const [loading, setLoading] = useState(false);
	const salatoken = useSelector((state) => state.queries.callSettings);
	const { dni } = props.match.params;

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
				let headers = { 'Content-Type': 'Application/Json', 'Authorization': token }
				await axios.post(user_cancel, data, headers)
				dispatch({ type: 'RESET_ALL' })
				return props.history.push('/')
			} catch (err) {
				dispatch({ type: 'ERROR', payload: err })
				dispatch({ type: 'LOADING', payload: false })
				dispatch({ type: 'RESET_ALL' })
				return props.history.push('/')
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
					{salatoken.room !== '' &&
						<div style={{ textAlign: 'center', color: 'green' }}>
							<small>Su médico ya lo está esperando en la sala</small>
							<Link to={`/${dni}/onlinedoctor/attention/`} replace={true}>
								<button
									type="button"
									className="btn btn-blue-lg btn-calling">
									Ingresar al consultorio
						</button>
							</Link>
						</div>
					}
					{salatoken.room === '' &&
						<button className="btn btn-blue-lg btn-alert btn-cancel" onClick={cancelAppointment}>Cancelar consulta</button>
					}
					{salatoken.room !== '' &&
						<audio src={tone} id='toneAudio' autoPlay />
					}
				</>
			}
			<button className="btn btn-blue-lg btn-back" onClick={() => props.history.push('/')}>Volver al inicio</button>
			{loading &&
				<div className="text-center mt-5">
					<Loader />
				</div>}
		</div>
	)
}

export default withRouter(AppointmentsOnlineHistory)