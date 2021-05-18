import React, { useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios' 
import swal from 'sweetalert';
import {NODE_SERVER} from '../../config/endpoints'
import { useDispatch, useSelector } from 'react-redux'

const Form = ({step, setStep}) => {
    const dispatch = useDispatch();
    const [send, setSend] = useState(false)
    const { dni } = useSelector(state => state.user)   
    const [values, setValues] = useState({
        sex: 'Masculino',
        smoker: 'no',
        diabetic: 'no',
        hypertensive: 'no',
        medical_records: 'no',
        age:''})



        const handleChange = e => {
            setValues({
                ...values,
                [e.target.name] : e.target.value
            })
            }


    const createDatasetDocument = useCallback(() => {
        if(!values.age){
            swal('Aviso', 'Debe completar los campos', 'warning');
        } else {
            dispatch({ type: "DIABETIC_TEST_FILL", payload: values })
            let data = {
                "dni": `${dni}`,
                "researchId":"diabetes",
                "data": values
            }
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
                        <label>Edad</label>
                        <input type="text" value={values.age} name='age' onChange={handleChange}/>
                    </div>
                    <div className='inputContainer'>
                        <label>Sexo:</label>
                        <select type="text" value={values.sexo} name='sex' onChange={handleChange}>
                            <option value='masculino'>Masculino</option>
                            <option value='femenino'>Femenino</option>
                        </select>
                    </div>
                    <div className='inputContainer'>
                        <label>Eres fumador? </label>
                        <select type="text" value={values.fumador} name='smoker' onChange={handleChange}>
                            <option value='si'>SI</option>
                            <option value='no'>NO</option>
                            <option value='ocasional'>Oscasional</option>\
                        </select>
                    </div>
                    <div className='inputContainer'>
                        <label>Eres diabético? </label>
                        <select type="text" value={values.diabetes} name='diabetic' onChange={handleChange}>
                            <option value='si'>SI</option>
                            <option value='no'>NO</option>
                        </select>
                    </div>
                    <div className='inputContainer'>
                        <label>Sufres hipertensión? </label>
                        <select type="text" value={values.hipertension} name='hypertensive' onChange={handleChange}>
                            <option value='si'>SI</option>
                            <option value='no'>NO</option>
                        </select>
                    </div>
                    <div className='inputContainer'>
                        <label>Antecedentes:</label>
                        <select type="text" value={values.medical_records} name='medical_records' onChange={handleChange}>
                            <option value='si'>SI</option>
                            <option value='no'>NO</option>
                        </select>
                    </div>
                    {/* <button onClick={()=>createDatasetDocument()}> */}
                    <div className='diabetesForm__buttons'>
                        <button onClick={() => {setStep(0)}}>
                            Atrás
                        </button>
                    <button className='button1' onClick={() => {createDatasetDocument(); setStep(2)}}>
                            Enviar
                        </button>
                    </div>
                </div>
            
        </div>
    )
}

export default Form