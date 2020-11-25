import React, { useRef, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { uploadFileToFirebase } from '../../Utils/postBlobFirebase';
import moment from "moment";
import { FaUpload } from "react-icons/fa"

export default function RecipeInput({callback}) {
    const dispatch = useDispatch()
    const { path } = useSelector(state => state.assignations.selectedAppointment)
    const { corporate_norm, dni } = useSelector(state => state.user)
    const [medicine, setMedicine] = useState(false)
    const [carnet, setCarnet] = useState(false)
    const medPicRef = useRef();
    const corporateCarnetRef = useRef();
    const assignation_id = path?.split("/")[3]
    
    const handleClickInputFile = (event, ref) => {
        ref.current.click();
      };

    const uploadImage = (e, reference) => {
        const currentFile = e.target?.files[0];
        if(currentFile) {
            uploadFileToFirebase(currentFile, `${dni}/prescription/${assignation_id}/${reference}`)
			.then((imgLink) => {
                console.log(imgLink)
                if(reference === 'medicine') {
                    setMedicine(true)
                } else {
                    setCarnet(true)
                }
                dispatch({type: 'SET_BIOMARKER', payload: {[reference]: imgLink} })
			})
			.catch(() => {
				console.log("ERROR")
			});
        }
	};


    return (
        <div className="recipe_input_container">
            <p className="title">Sube una foto del medicamento:</p>
            {medicine && <small>Foto subida</small>}
            <input ref={medPicRef} type="file" className="file_input" onChange={(e) => uploadImage(e, "medicine")}/>
            <div className="file-selector" onClick={(e) => handleClickInputFile(e, medPicRef)}>Selecciona un archivo <FaUpload className="icon" /></div>
            <p className="title">Sube una foto del carnet:</p>
            {carnet && <small>Foto subida</small>}
            <input ref={corporateCarnetRef} type="file" className="file_input" onChange={(e) => uploadImage(e, `${corporate_norm}-carnet`)} />
            <div className="file-selector" onClick={(e) => handleClickInputFile(e, corporateCarnetRef)}>Selecciona un archivo <FaUpload className="icon" /></div>
            <button className="btn btn-blue-lg button" onClick={callback}>Aceptar</button>
        </div>
    )
}
