import React, {useState, useEffect} from 'react';
import {  useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { uploadFileToFirebase } from '../Utils/postBlobFirebase';
import swal from 'sweetalert';
import { FaFileMedicalAlt } from 'react-icons/fa';

const AttachFile = ({appoint, specialty}) => {
	const [File, setFile] = useState([])
    const [contador, setContador] = useState(0)
    const [buttonText, setButtonText] = useState('Subir archivos')
    const dispatch = useDispatch()
    let { dni } = useParams();

    useEffect(() => {
        if(specialty === 'medicinalaboral') {
            setButtonText('Cargar constancia')
        }
    }, [])
    
    const uploadImage = (e) => {
		dispatch({ type: 'LOADING', payload: true });
		let dt = moment().format('DD-MM-YYYY_HH:mm:ss');
		let file = e.target.files[0];
		let fileName = e.target.files[0].name;
		uploadFileToFirebase(file, `${dni}/attached/${appoint?.path?.split('/')?.[3]}/${dt}_${fileName}`)
			.then((imgLink) => {
				setContador(contador + 1);
				setFile([...File, imgLink]);
				dispatch({ type: 'LOADING', payload: false });
				swal('Éxito', 'Archivo cargado exitosamente', 'success');
			})
			.catch(() => {
				dispatch({ type: 'LOADING', payload: false });
				swal('Error', 'Hubo un error al adjuntar el archivo, intente nuevamente', 'error');
			});
	};


    return <div className='input-file'>
            <FaFileMedicalAlt size='1.5rem' />
            <p>
                {contador < 1
                    ? buttonText
                    : contador === 1
                    ? `${contador} archivo adjunto`
                    : `${contador} archivos adjuntos`}
            </p>
            <input type='file' onChange={uploadImage} />
        </div>
}

export default AttachFile;