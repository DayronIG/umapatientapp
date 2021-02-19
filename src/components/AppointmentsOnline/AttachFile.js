import React, { useState } from 'react';
import {  useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import moment from 'moment-timezone';
import { uploadFileToFirebase } from '../Utils/postBlobFirebase';
import swal from 'sweetalert';
import { FaFileMedicalAlt } from 'react-icons/fa';

const AttachFile = ({ appoint, specialty }) => {
	const [files, setFiles] = useState([]);
	const [contador, setContador] = useState(0);
	const dispatch = useDispatch();
	let { dni } = useParams();
		
	function renderBtnText() {
		if(specialty === 'medicinalaboral') {
			return 'Cargar constancia';
		} else {
			return 'Subir archivos';
		}
	}
    
	const uploadImage = (e) => {
		dispatch({ type: 'LOADING', payload: true });
		const dt = moment().format('DD-MM-YYYY_HH:mm:ss');
		const currentFile = e.target.files[0];
		const fileName = e.target.files[0].name;
		uploadFileToFirebase(currentFile, `${dni}/attached/${appoint?.path?.split('/')?.[3]}/${dt}_${fileName}`)
			.then((imgLink) => {
				setContador(contador + 1);
				setFiles([ ...files, imgLink ]);
				dispatch({ type: 'LOADING', payload: false });
				swal('Éxito', 'Archivo cargado exitosamente', 'success');
			})
			.catch(() => {
				dispatch({ type: 'LOADING', payload: false });
				swal('Error', 'Hubo un error al adjuntar el archivo, intente nuevamente', 'error');
			});
	};


	return <div className='umaBtn input-file'>
					<FaFileMedicalAlt size='1.5rem' />
					<p>
						{contador < 1
							? renderBtnText()
							: contador === 1
							? `${contador} archivo adjunto`
							: `${contador} archivos adjuntos`
						}
					</p>
					<input type='file' onChange={uploadImage} />
			</div>
}

export default AttachFile;