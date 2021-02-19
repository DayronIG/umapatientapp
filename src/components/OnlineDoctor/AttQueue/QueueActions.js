import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FaFileMedicalAlt } from 'react-icons/fa';
import { uploadFileToFirebase } from '../../Utils/postBlobFirebase';
import moment from 'moment-timezone';
import swal from 'sweetalert';
import '../../../styles/questions.scss';

const QueueActions = (props) => {
	const history = useHistory()
	const [contador, setContador] = useState(0);
	const [File, setFile] = useState([]);
	const auth = useSelector((state) => state.user);

	const uploadImage = e => {
		let dt = moment().format('DD-MM-YYYY_HH:mm:ss');
		let file = e.target.files[0];
		let fileName = e.target.files[0].name;
		uploadFileToFirebase(file, `${auth.dni}/attached/${props.id}/${dt}_${fileName}`)
			.then(imgLink => {
				setContador(contador + 1);
				setFile([...File, imgLink]);
				swal('Éxito', 'Archivo cargado exitosamente', 'success');
			})
			.catch(() => {
				swal('Error', 'Hubo un error al adjuntar el archivo, intente nuevamente', 'error');
			})
	}

	const joinAppointment = () => {
		history.replace(`/onlinedoctor/attention/${props.dni}`)
	}

	const antipanicAction = () => {
		history.replace(`/support/guardia?id=${props.id}`)
	}

    return (
		<div className="questionsContainer">
			{props.calling &&
				<button 
					className="umaBtn green" 
					onClick={joinAppointment}>
					Ingresar al consultorio
				</button>}
			<div className="umaBtn attachFile">
				<FaFileMedicalAlt size="1.5rem" />
				<p>{ contador < 1 ? 'Adjuntar archivo' : ( contador === 1 ? `${contador} archivo adjunto` : `${contador} archivos adjuntos` ) }</p>
				<input type="file" onChange={uploadImage} />
			</div>
			{props.appState !== 'ATT' && props.appState !== 'DONE' && !props.calling && 
				<button 
					className="umaBtn secondary" 
					onClick={antipanicAction}>
					Necesito ayuda
				</button>}
		</div>
	)
}

export default QueueActions;