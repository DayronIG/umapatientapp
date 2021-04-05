import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import queryString from 'query-string'
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
	const {symptomsForDoc, answers, responseIA, user, coordinates, alerta } = props;
	const history = useHistory();
	const dispatch = useDispatch();
	const [selectedAppointment, setSelectedAppointment] = useState({});
	const [loading, setLoading] = useState(false);
	const [File, setFile] = useState([]);	
	const biomarkers = useSelector(state => state.biomarkers)
	const { activeUid } = useParams()
	const location = useLocation()
	const params = queryString.parse(location.search)
	const {currentUser} = useSelector(state => state.userActive)
	const patient = useSelector(state => state.user)
	const {filesCount} = useSelector(state => state.assignations)


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
				dispatch({type: 'SUM_FILE_COUNT'})
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
		let symptoms = '', userVerified = user;
		if (localStorage.getItem('appointmentUserData')) userVerified = JSON.parse(localStorage.getItem('appointmentUserData'));
		try {
			if (!!symptomsForDoc) symptoms = await cleanSyntoms();
			let dt = moment().tz('America/Argentina/Buenos_Aires').format('YYYY-MM-DD HH:mm:ss');
			let category = selectedAppointment.path?.split('assignations/')[1] ? "GUARDIA_MEDICO" : "GUARDIA_RANDOM"
			let ruta = selectedAppointment.path?.split('assignations/')[1]
			if(bag) {
				category = "GUARDIA_RANDOM"
				ruta = ''
			}
			let data = {
				age: userVerified.age || patient.age,
				biomarker: biomarkers || [],
				destino_final: responseIA.destino_final || '',
				diagnostico: responseIA.diagnostico || '',
				dt,
				dni: userVerified.dni || patient.dni,
				epicrisis: responseIA.epicrisis || '',
				lat: coordinates.lat || '', 
				lon: coordinates.lng || '',
				msg: 'make_appointment',
				cuit: `${selectedAppointment.cuit}`,
				motivo_de_consulta: symptoms,
				alertas: alerta,
				ruta: ruta || '',
				sex: userVerified.sex || patient.sex,
				specialty: 'online_clinica_medica',
				ws: userVerified.ws || patient.ws,
				uid: currentUser?.uid || patient.core_id,
				uid_dependant: params.dependant === 'true' ? activeUid : false,
				category
			};

			const headers = { 'Content-type': 'application/json' };
			const res = await axios.post(make_appointment, data, headers);
			dispatch({ type: 'LOADING', payload: false });
			if (res.data.fecha === '') {
				return history.replace(`/onlinedoctor/when/${activeUid}?dependant=${params.dependant}`);
			} else {
				localStorage.setItem('currentAppointment', JSON.stringify(data.ruta));
				localStorage.setItem('currentMr', JSON.stringify(res.data.assignation_id));
				return history.replace(`/onlinedoctor/queue/${activeUid}?dependant=${params.dependant}`);
			}
		} catch (err) {
			if(err.response?.data?.fecha === '') {
				return history.replace(`/onlinedoctor/when/${activeUid}?dependant=${params.dependant}`);
			}
			console.log(err)
			swal('Error', 'Hubo un error al agendar el turno, intente nuevamente...', 'error');
			dispatch({ type: 'LOADING', payload: false });
		}
	};

	const submitRequest = useCallback(async () => {
		dispatch({ type: 'LOADING', payload: true });
		let appointId = "", lastAssingState = ""
		if(selectedAppointment?.path) {
			appointId = genAppointmentID(selectedAppointment, yearAndMonth());
			lastAssingState = await getDocumentFB(`${selectedAppointment.path}`);
		}
		if (appointId === '' || lastAssingState?.state === 'FREE') {
			return postData();
		} else {
			dispatch({ type: 'LOADING', payload: false });
			/* const confirmAction =  */await swal({
				title: 'El especialista que escogió ya no está disponible',
				text: 'Podemos asignarte a otro médico con disponibilidad. Deseas que te asignemos el primero disponible?',
				icon: 'warning',
				buttons: true,
			});
			if (true /* confirmAction */) {
/* 				postData(true);
			} else { */
				let userVerified = user.dni
				if (localStorage.getItem('appointmentUserData')) userVerified = JSON.parse(localStorage.getItem('appointmentUserData'));
				return history.replace(`/onlinedoctor/when/${activeUid}?dependant=${params.dependant}`);
			}
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
					<div className="umaBtn attachFile">
						<FaFileMedicalAlt className="attachFile__icon" />
						<p>{filesCount < 1 ? 'Adjuntar archivo' : (filesCount === 1 ? `${filesCount} archivo adjunto` : `${filesCount} archivos adjuntos`)}</p>
						<input type="file" onChange={uploadImage} />
					</div>
				}
				<button className="umaBtn" onClick={() => submitRequest()}>Confirmar turno</button>
			</div>
		</>
	);
};

export default ConfirmAppointment;