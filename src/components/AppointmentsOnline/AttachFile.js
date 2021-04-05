import React, { useState } from 'react';
import {  useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import moment from 'moment-timezone';
import { uploadFileToFirebase } from '../Utils/postBlobFirebase';
import swal from 'sweetalert';
import { FaFileMedicalAlt } from 'react-icons/fa';

const AttachFile = ({ appoint, specialty }) => {
	const [files, setFiles] = useState([]);
	const {filesCount} = useSelector(state => state.assignations)
	const dispatch = useDispatch();
	const {dni} = useSelector(state => state.user)

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
				dispatch({type: 'SUM_FILE_COUNT'})				
				setFiles([ ...files, imgLink ]);
				dispatch({ type: 'LOADING', payload: false });
				swal('Éxito', 'Archivo cargado exitosamente', 'success');
			})
			.catch(() => {
				dispatch({ type: 'LOADING', payload: false });
				swal('Error', 'Hubo un error al adjuntar el archivo, intente nuevamente', 'error');
			});
	};


	return <div className='umaBtn attachFile'>
					<FaFileMedicalAlt className='attachFile__icon' />
					<p>
						{filesCount < 1
							? renderBtnText()
							: filesCount === 1
							? `${filesCount} archivo adjunto`
							: `${filesCount} archivos adjuntos`
						}
					</p>
					<input type='file' onChange={uploadImage} />
			</div>
}

export default AttachFile;