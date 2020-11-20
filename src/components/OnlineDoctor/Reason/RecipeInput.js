import React from 'react'
import { useSelector } from "react-redux"
import { uploadFileToFirebase } from '../../Utils/postBlobFirebase';
import moment from "moment";

export default function RecipeInput({callback}) {
    const { datetime, cuit } = useSelector(state => state.assignations.selectedAppointment)
    const { corporate_norm, dni } = useSelector(state => state.user)

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
            <p className="title">Cargar foto del medicamento:</p>
            <input type="file" className="file_input" onChange={(e) => uploadImage(e, "medicine")}/>
            <p className="title">Cargar foto del carnet:</p>
            <input type="file" className="file_input" onChange={(e) => uploadImage(e, `${corporate_norm}-carnet`)} />
            <button className="btn btn-blue-lg button" onClick={callback}>Continuar</button>
        </div>
    )
}
