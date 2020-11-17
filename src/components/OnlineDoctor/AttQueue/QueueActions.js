import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Alert from '../../GeneralComponents/Alert/Alerts';
import '../../../styles/questions.scss';
import { FaFileMedicalAlt } from 'react-icons/fa';
import { uploadFileToFirebase } from '../../Utils/postBlobFirebase';
import moment from 'moment-timezone';
import swal from 'sweetalert';

const QueueActions = (props) => {
	const dispatch = useDispatch()
	const [alert, setAlert] = useState(false)
	const [contador, setContador] = useState(0);
	const [loading, setLoading] = useState(false);
	const [selectedAppointment, setSelectedAppointment] = useState({});
	const [File, setFile] = useState([]);
	const auth = useSelector((state) => state.queries.patient);

	useEffect(() => {
		const data = JSON.parse(localStorage.getItem('selectedAppointment'));
		setSelectedAppointment(data);
	}, []);


	const uploadImage = e => {
		setLoading(true);
		let dt = moment().format('DD-MM-YYYY_HH:mm:ss');
		let file = e.target.files[0];
		let fileName = e.target.files[0].name;
		
		uploadFileToFirebase(file, `${auth.dni}/attached/${selectedAppointment?.path?.split('/')?.[3]}/${dt}_${fileName}`)
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

    return (
		<div className="questionsContainer">
			{	
				alert && 
				<Alert
					alertType="question"
					titleMessage="Cancelar cita"
					customMessage="¿Está seguro que desea cancelar la consulta?"
					handleConfirm={() => props.setShowModalCancelOptions(true)}
					handleReject={() => setAlert(false)}
					customAction={() => setAlert(false)}
				/>
			}
			{/* Adjuntar archivo */}
			{ 
				props.calling &&
				<Link to={`/${props.dni}/onlinedoctor/attention/`} replace={true}>
					<button className="btn-questions btn-calling" onClick={() => setAlert(true)}>Ingresar al consultorio</button>
				</Link>
			}

			<div className="input-file">
					<FaFileMedicalAlt size="1.5rem" />
					<p>{ contador < 1 ? 'Adjuntar archivo' : ( contador === 1 ? `${contador} archivo adjunto` : `${contador} archivos adjuntos` ) }</p>
					<input type="file" onChange={uploadImage} />
			</div>


			{	
				props.appState !== 'ATT' && props.appState !== 'DONE' && !props.calling && 
				<button className="btn-questions btn-alert" onClick={() => setAlert(true)}>Cancelar consulta</button>
			}
			{	
				props.appState === 'DONE' && 
				<h2>El médico ya cerró tu consulta.</h2>
			}
			<button className="btn-questions btn-claim" onClick={() => dispatch({ type: 'TOGGLE_DETAIL' })}>Realizar un reclamo</button>
		</div>
	)
}

export default QueueActions;