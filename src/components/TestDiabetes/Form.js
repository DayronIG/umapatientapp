import React, { useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios' 
import swal from 'sweetalert';
import {NODE_SERVER} from '../../config/endpoints'
import { useDispatch, useSelector } from 'react-redux'


const Form = () => {

    const [send, setSend] = useState(false)
    const { dni } = useSelector(state => state.user)    
    const [values, setValues] = useState({
        sexo: 'masculino',
        fumador: 'no',
        diabetes: 'no',
        hipertension: 'no',
        antecedentes: 'no',
        fechaNac: '',})

    const handleChange = e => {
        setValues({
            ...values,
            [e.target.name] : e.target.value
        })
    }



    const createDatasetDocument = useCallback(() => {
        if(!values.fechaNac){
            swal('Aviso', 'Debe completar los campos', 'warning');
        } else {
            let data = {
                "dni": `${dni}`,
                "researchId":"diabetes",
                "data": values
            }
            // let score = 0
            // if(EDAD >=60 && edad < 70) {score += 2}
            // if(EDAD >=70) {score += 3}
            // if(GENERO = "M") {score += 2}
            // if(FUMADOR = true) {score += 2}
            // if(DIABETES = true) {score += 3}
            // if(HIPERTENSION = true) {score += 2}
            // if(INFARTO_PRECOZ = true) {score += 1}
            // if(DIAB_PROB > 0.5 && DIAB_PROB < 0.75) {score += 1}
            // if(DIAB_PROB >= 0.75) {score += 1}
            // if(DIAB_PROB > 0.5 && DIAB_PROB < 0.75) {score += 2}
            // if(DIAB_PROB >= 0.75) {score += 3}

              axios.post(`${NODE_SERVER}/research`, data, {headers: {'Content-Type': 'application/json'}})
              .then(function (response) {
                console.log(JSON.stringify(response.data));
              })
              .catch(function (error) {
                console.log(error);
              });
              setSend(true)
        }
    }, [values])


    return (
        <div className='diabetes'>

                <div className='question_diabetes'>
                    <div className='inputContainer'>
                        <label>Fecha de Nacimiento:</label>
                        <input type="date" value={values.fechaNac} name='fechaNac' onChange={handleChange}/>
                    </div>
                    <div className='inputContainer'>
                        <label>Sexo:</label>
                        <select type="text" value={values.sexo} name='sexo' onChange={handleChange}>
                            <option value='masculino'>Masculino</option>
                            <option value='femenino'>Femenino</option>
                        </select>
                    </div>
                    <div className='inputContainer'>
                        <label>Eres fumador? </label>
                        <select type="text" value={values.fumador} name='fumador' onChange={handleChange}>
                            <option value='si'>SI</option>
                            <option value='no'>NO</option>
                            <option value='ocasional'>Oscasional</option>\
                        </select>
                    </div>
                    <div className='inputContainer'>
                        <label>Eres diabético? </label>
                        <select type="text" value={values.diabetes} name='diabetes' onChange={handleChange}>
                            <option value='si'>SI</option>
                            <option value='no'>NO</option>
                        </select>
                    </div>
                    <div className='inputContainer'>
                        <label>Sufres hipertensión? </label>
                        <select type="text" value={values.hipertension} name='hipertension' onChange={handleChange}>
                            <option value='si'>SI</option>
                            <option value='no'>NO</option>
                        </select>
                    </div>
                    <div className='inputContainer'>
                        <label>Antecedentes:</label>
                        <select type="text" value={values.antecedentes} name='antecedentes' onChange={handleChange}>
                            <option value='si'>SI</option>
                            <option value='no'>NO</option>
                        </select>
                    </div>
                    <button onClick={()=>createDatasetDocument()}>
                        Enviar
                    </button>
                </div>
            
        </div>
    )
}

export default Form