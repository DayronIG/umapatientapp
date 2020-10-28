import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { make_appointment } from '../../../config/endpoints';
import { getDocumentFB } from '../../Utils/firebaseUtils';
import { yearAndMonth } from '../../Utils/dateUtils';
import { genAppointmentID } from '../../Utils/appointmentsUtils';
import { FaFileMedicalAlt } from 'react-icons/fa';
import { uploadFileToFirebase } from '../../Utils/postBlobFirebase';
import { Loader } from '../../global/Spinner/Loaders';
import swal from 'sweetalert';
import axios from 'axios';
import moment from 'moment';
import 'moment-timezone';
import '../../../styles/questions.scss';

const ConfirmAppointment = (props) => {
	const { dispatch, history, symptomsForDoc, answers, responseIA, patient, biomarkers, coordinates, alerta } = props;
	const [selectedAppointment, setSelectedAppointment] = useState({});
	const [loading, setLoading] = useState(false);
	const [File, setFile] = useState([]);
	const [contador, setContador] = useState(0);

	useEffect(() => {
		const data = JSON.parse(localStorage.getItem('selectedAppointment'));
		setSelectedAppointment(data);
	}, []);

	const uploadImage = e => {
		setLoading(true);
		let dt = moment().format('DD-MM-YYYY_HH:mm:ss');
		let file = e.target.files[0];
		let fileName = e.target.files[0].name;
		uploadFileToFirebase(file, `${patient.dni}/attached/${selectedAppointment?.path?.split('/')?.[3]}/${dt}_${fileName}`)
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

	const postData = async () => {
		dispatch({ type: 'LOADING', payload: true });
		try {
			let symptoms = '', userVerified;
			if (!!symptomsForDoc) symptoms = await cleanSyntoms();
			if (localStorage.getItem('appointmentUserData')) userVerified = JSON.parse(localStorage.getItem('appointmentUserData'));
			let dt = moment().tz('America/Argentina/Buenos_Aires').format('YYYY-MM-DD HH:mm:ss');
			const appointmentId = genAppointmentID(selectedAppointment, yearAndMonth());

			
			let data = {
				age: userVerified.age || '',
				biomarker: biomarkers || [],
				destino_final: responseIA.destino_final || '',
				diagnostico: responseIA.diagnostico || '',
				dt,
				dni: userVerified.dni || patient.dni,
				epicrisis: responseIA.epicrisis || '',
				lat: coordinates.lat || '', // Coordenadas de Melian si no hay location
				lon: coordinates.lng || '',
				msg: 'make_appointment',
				motivo_de_consulta: symptoms,
				alertas: alerta,
				ruta: appointmentId || '',
				sex: userVerified.sex || '',
				specialty: 'online_clinica_medica',
				ws: userVerified.ws || patient.ws,
			};

			const headers = { 'Content-type': 'application/json' };
			const res = await axios.post(make_appointment, data, headers);
			dispatch({ type: 'LOADING', payload: false });
			
			if (res.data.fecha === '') {
				return history.replace(`/${userVerified.dni}/onlinedoctor/who`);
			} else {
				localStorage.setItem('currentAppointment', JSON.stringify(data.ruta));
				localStorage.setItem('currentMr', JSON.stringify(res.data.assignation_id));
				return history.replace(`/${userVerified.dni}/onlinedoctor/queue`);
			}
		} catch (err) {
			swal('Error', 'Hubo un error al agendar el turno, intente nuevamente', 'error');
			dispatch({ type: 'LOADING', payload: false });
			return history.replace('/');
		}
	};

	const submitRequest = async () => {
		const confirmAction = await swal({
			title: 'Confirmación',
			text: 'Está seguro que desea agendar este turno?',
			icon: 'warning',
			buttons: true,
		});
		if (!confirmAction) {
			return;
		}
		dispatch({ type: 'LOADING', payload: true });
		const appointId = genAppointmentID(selectedAppointment, yearAndMonth());
		const lastAssingState = await getDocumentFB(`assignations/${appointId}`);
		if (appointId === '' || lastAssingState.state === 'FREE') {
			return postData();
		} else {
			dispatch({ type: 'LOADING', payload: false });
			swal(
				'La cita que escogió ya está ocupada',
				'Su turno ya ha sido escogido, por favor escoga otro. Será redirigido al home.',
				'warning'
			);
			return history.replace('/');
		}
	};

	return (
		<>
			{selectedAppointment && (
				<div className='appointment'>
					<h5>Información del turno</h5>
					<ul>
						<li>
							<img src={selectedAppointment.path_profile_pic} alt="Doctor" />
						</li>
						<li>Doctor: <b>{selectedAppointment.fullname}</b>
						</li>
						<li>
							Hora: <b>{selectedAppointment.time}</b>
						</li>
						<li>
							Fecha: <b>{selectedAppointment.date}</b>
						</li>
					</ul>
					<p>Presione <strong>"Confirmar turno"</strong> <br /> para agendar.</p>
				</div>
			)}
			<div className="questionsContainer">
				{
					loading ? <div className="text-center"><Loader /></div> 
					:
					<div className="input-file">
						<FaFileMedicalAlt size="1.5rem" />
						<p>{ contador < 1 ? 'Adjuntar archivo' : ( contador === 1 ? `${contador} archivo adjunto` : `${contador} archivos adjuntos` ) }</p>
						<input type="file" onChange={uploadImage} />
					</div>
				}
				<button className="btn-questions btn-normal" onClick={() => submitRequest()}>Confirmar turno</button>
			</div>
		</>
	);
};

export default withRouter(ConfirmAppointment);
