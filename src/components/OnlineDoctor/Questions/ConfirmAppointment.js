import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { make_appointment } from '../../../config/endpoints';
import { getDocumentFB } from '../../Utils/firebaseUtils';
import { yearAndMonth } from '../../Utils/dateUtils';
import { genAppointmentID } from '../../Utils/appointmentsUtils';
import { FaFileMedicalAlt } from 'react-icons/fa';
import { uploadFileToFirebase } from '../../Utils/postBlobFirebase';
import { Loader } from '../../global/Spinner/Loaders';
import { FaUserMd } from 'react-icons/fa'
import DoctorDelay from '../AttQueue/DoctorDelay';
import swal from 'sweetalert';
import axios from 'axios';
import moment from 'moment-timezone';
import '../../../styles/questions.scss';

const ConfirmAppointment = (props) => {
	const { dispatch, history, symptomsForDoc, answers, responseIA, user, coordinates, alerta } = props;
	const [selectedAppointment, setSelectedAppointment] = useState({});
	const [loading, setLoading] = useState(false);
	const [File, setFile] = useState([]);
	const [contador, setContador] = useState(0);
	const biomarkers = useSelector(state => state.biomarkers)

	useEffect(() => {
		if (localStorage.getItem('selectedAppointment') && localStorage.getItem('selectedAppointment') !== undefined) {
			const data = JSON.parse(localStorage.getItem('selectedAppointment'));
			delete data.history
			delete data.location
			delete data.match
			setSelectedAppointment(data);
		}
	}, []);

	const uploadImage = e => {
		setLoading(true);
		let dt = moment().format('DD-MM-YYYY_HH:mm:ss');
		let file = e.target.files[0];
		let fileName = e.target.files[0].name;
		uploadFileToFirebase(file, `${user.dni}/attached/${selectedAppointment?.path?.split('/')?.[3]}/${dt}_${fileName}`)
			.then(imgLink => {
				setContador(contador + 1);
				setFile([...File, imgLink]);
				setLoading(false);
				swal('Éxito', 'Archivo cargado exitosamente', 'success');
			})
			.catch(() => {
				setLoading(false);
				swal('Error', 'Hubo un error al adjuntar el archivo, intente nuevamente', 'error');
			})
	}

	const cleanSyntoms = () => {
		const finalSymptoms = [];
		symptomsForDoc.filter(Boolean).map(item => {
			finalSymptoms.push(item);
		});
		answers.split('. ').filter(Boolean).map(item => {
			finalSymptoms.push(item);
		});
		return finalSymptoms.join('.');
	}

	const postData = async (bag = false) => {
		dispatch({ type: 'LOADING', payload: true });
		try {
			let symptoms = '', userVerified;
			if (!!symptomsForDoc) symptoms = await cleanSyntoms();
			if (localStorage.getItem('appointmentUserData')) userVerified = JSON.parse(localStorage.getItem('appointmentUserData'));
			let dt = moment().tz('America/Argentina/Buenos_Aires').format('YYYY-MM-DD HH:mm:ss');
			let category = selectedAppointment.path?.split('assignations/')[1] ? "GUARDIA_MEDICO" : "GUARDIA_RANDOM"
			let data = {
				age: userVerified.age || '',
				biomarker: biomarkers || [],
				destino_final: responseIA.destino_final || '',
				diagnostico: responseIA.diagnostico || '',
				dt,
				dni: userVerified.dni || user.dni,
				epicrisis: responseIA.epicrisis || '',
				lat: coordinates.lat || '', 
				lon: coordinates.lng || '',
				msg: 'make_appointment',
				motivo_de_consulta: symptoms,
				alertas: alerta,
				ruta: selectedAppointment.path?.split('assignations/')[1] || '',
				// cuit: "2034109531",
				sex: userVerified.sex || '',
				specialty: 'online_clinica_medica',
				ws: userVerified.ws || user.ws,
				uid: user.core_id,
				category
			};

			const headers = { 'Content-type': 'application/json' };
			const res = await axios.post(make_appointment, data, headers);
			dispatch({ type: 'LOADING', payload: false });
			if (res.data.fecha === '') {
				return history.replace(`/onlinedoctor/when/${userVerified.dni}`);
			} else {
				localStorage.setItem('currentAppointment', JSON.stringify(data.ruta));
				localStorage.setItem('currentMr', JSON.stringify(res.data.assignation_id));
				return history.replace(`/onlinedoctor/queue/${userVerified.dni}`);
			}
		} catch (err) {
			console.log(err)
			if(err.data.fecha === '') {
				return history.replace(`/onlinedoctor/who`);
			}
			swal('Error', 'Hubo un error al agendar el turno, intente nuevamente', 'error');
			dispatch({ type: 'LOADING', payload: false });
		}
	};

	const submitRequest = useCallback(async () => {
		dispatch({ type: 'LOADING', payload: true });
		const appointId = genAppointmentID(selectedAppointment, yearAndMonth());
		const lastAssingState = await getDocumentFB(`${selectedAppointment.path}`);
		if (appointId === '' || lastAssingState.state === 'FREE') {
			return postData();
		} else {
			dispatch({ type: 'LOADING', payload: false });
			const confirmAction = await swal({
				title: 'El especialista que escogió ya no está disponible',
				text: 'Podemos asignarte a otro médico con disponibilidad. Deseas que te asignemos el primero disponible?',
				icon: 'warning',
				buttons: true,
			});
			if (!confirmAction) {
				return postData(true);
			}
			return history.replace('/');
		}
	}, [selectedAppointment])

	return (
		<>
			{selectedAppointment.doc?.path_profile_pic ?
				<div className='appointment'>
					<h5>Información del turno</h5>
					<div>
						<div className="appointment__doctorIcon">
							<img src={selectedAppointment.doc?.path_profile_pic} alt="Doctor" />
						</div>
						<div className="appointment__detail">Doctor: <b>{selectedAppointment.doc?.fullname}</b></div>
						<div className="appointment__detail">Hora: <b>{selectedAppointment.time}</b></div>
						<div className="appointment__detail">Fecha: <b>{selectedAppointment.date}</b></div>
					</div>
					<p>Presione <strong>"Confirmar turno"</strong> <br /> para agendar.</p>
				</div>
				:
				<div className='appointment'>
					<h5>Información del turno</h5>
					<div className="appointment__doctorIcon">
						<FaUserMd />
					</div>
					<div className="appointment__detail">Guardia médica</div>
					<DoctorDelay cuit={selectedAppointment.cuit} time={selectedAppointment.time} date={selectedAppointment.date} />
					<p>Presione <strong>"Confirmar turno"</strong> <br /> para agendar.</p>
				</div>
			}
			<div className="questionsContainer">
				{
					loading ? <div className="text-center"><Loader /></div>
					:
					<div className="umaBtn input-file">
						<FaFileMedicalAlt size="1.5rem" />
						<p>{contador < 1 ? 'Adjuntar archivo' : (contador === 1 ? `${contador} archivo adjunto` : `${contador} archivos adjuntos`)}</p>
						<input type="file" onChange={uploadImage} />
					</div>
				}
				<button className="umaBtn" onClick={() => submitRequest()}>Confirmar turno</button>
			</div>
		</>
	);
};

export default withRouter(ConfirmAppointment);
