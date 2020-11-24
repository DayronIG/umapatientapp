import React, { useRef } from 'react'
import { useSelector } from "react-redux"
import { uploadFileToFirebase } from '../../Utils/postBlobFirebase';
import moment from "moment";
import { FaUpload } from "react-icons/fa"

export default function RecipeInput({callback}) {
    const { datetime, cuit } = useSelector(state => state.assignations.selectedAppointment)
    const { corporate_norm, dni } = useSelector(state => state.user)
    const medPicRef = useRef();
    const corporateCarnetRef = useRef();

    const handleClickInputFile = (event, ref) => {
        ref.current.click();
      };

    const uploadImage = (e, reference) => {
		const dt = moment().format('DD-MM-YYYY_HH:mm:ss');
		const currentFile = e.target?.files[0];
        if(currentFile) {
            uploadFileToFirebase(currentFile, `${dni}/prescription/${datetime}_${cuit}/${reference}`)
			.then((imgLink) => {
				console.log(imgLink)
			})
			.catch(() => {
				console.log("ERROR")
			});
        }
	};


    return (
        <div className="recipe_input_container">
            <p className="title">Sube una foto del medicamento:</p>
            <input ref={medPicRef} type="file" className="file_input" onChange={(e) => uploadImage(e, "medicine")}/>
            <div className="file-selector" onClick={(e) => handleClickInputFile(e, medPicRef)}>Selecciona un archivo <FaUpload className="icon" /></div>
            <p className="title">Sube una foto del carnet:</p>
            <input ref={corporateCarnetRef} type="file" className="file_input" onChange={(e) => uploadImage(e, `${corporate_norm}-carnet`)} />
            <div className="file-selector" onClick={(e) => handleClickInputFile(e, corporateCarnetRef)}>Selecciona un archivo <FaUpload className="icon" /></div>
            <button className="btn btn-blue-lg button" onClick={callback}>Aceptar</button>
        </div>
    )
}
