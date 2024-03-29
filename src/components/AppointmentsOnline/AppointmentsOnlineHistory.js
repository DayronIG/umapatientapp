/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter, Link, useParams, useLocation } from 'react-router-dom';
import queryString from 'query-string'
import { GenericHeader } from '../GeneralComponents/Headers';
import { getMedicalRecord, getAppointmentByUid } from '../../store/actions/firebaseQueries';
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
	const mrs = useSelector(state => state.queries.medicalRecord)
	const patient = useSelector(state => state.user)
	const [loading, setLoading] = useState(false)
	const [filteredMrs, setFilteredMrs] = useState(null)
	const { incomingCall } = useSelector(state => state.call)
	const {currentUser, token} = useSelector(state => state.userActive)
	const { activeUid } = useParams()
	const location = useLocation()
    const params = queryString.parse(location.search)

	useEffect(() => {
		if (currentUser && activeUid) {
			let dependant = params.dependant === "false" ? false : params.dependant
			dispatch(getDependant(activeUid, dependant))
			dispatch(getMedicalRecord(activeUid, dependant))
		}
	}, [currentUser])

	useEffect(() => {
		if (currentUser && activeUid) {
			findMR(currentUser.uid, activeUid)
		}
	}, [mrs])

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
			if (mrs && mrs.length) {
				let getFirst = 0
				mrs.forEach(async function (mr) {
					if (mr.att_category === "MI_ESPECIALISTA" && getFirst === 0) {
						getFirst++
						await getAppointmentByUid(uid, undefined, `online_${mr.especialidad}`).then(appointment => {
							let scheduledTurn = appointment?.time
							const doctorName = appointment?.fullname
							const specialty = appointment?.especialidad
							const date = appointment?.date
							const time = appointment?.time
							const path = appointment?.path 
							if(mr.att_category && mr.att_category === "MI_ESPECIALISTA") {
								scheduledTurn = 'TurnoConsultorioOnline'
							}
							if (scheduledTurn === 'TurnoConsultorioOnline' && mr.mr.destino_final === "") {
								setFilteredMrs({ ...mr, doctorName, specialty, date, time, path })
							}
						})
					}
				})
				setLoading(false)
			}
		} catch (error) {
			console.log(error)
			setLoading(false)
		}
	}

	const cancelAppointment = useCallback(async () => {
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
					ws: filteredMrs.patient?.ws || patient.ws,
					dni: filteredMrs.patient?.dni || patient.dni,
					dt: date || '',
					assignation_id: filteredMrs.assignation_id || '',
					appointment_path: `${filteredMrs.path}` || '',
					type: 'cancel',
					complain: '',
					uid: currentUser.uid,
					uid_dependant: params.dependant === 'false' ? false : activeUid
				}
				await axios.post(user_cancel, data, {headers: { 'Content-Type': 'Application/Json', 'Authorization': token }})
				dispatch({ type: 'RESET_ALL' })
				return props.history.push('/home')
			} catch (err) {
				console.log(err)
				dispatch({ type: 'ERROR', payload: err })
				dispatch({ type: 'LOADING', payload: false })
				dispatch({ type: 'RESET_ALL' })
				return props.history.push('/home')
			}
		}
	}, [filteredMrs])

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
			{!!filteredMrs &&
				<>
					<div className="listScheduledAppoints">
						<ul className="listScheduledAppoints__list">
							 <li className="listScheduledAppoints__list--item">
									<span className="name">Doctor: <b>{filteredMrs.doctorName}</b></span> <br />
									<span className="specialty">Especialidad: {filteredMrs.specialty}</span><br />
									<span className="date">Fecha: {filteredMrs.date}</span> <br />
									<span className="time">Hora: {filteredMrs.time}</span> <br />
								</li>
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