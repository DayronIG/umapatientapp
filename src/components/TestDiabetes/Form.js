import React, { useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios' 
import swal from 'sweetalert';
import {NODE_SERVER} from '../../config/endpoints'
import { useDispatch, useSelector } from 'react-redux'
import labsicon from '../../assets/labsicon.png'

const Form = ({step, setStep}) => {
    const dispatch = useDispatch();
    const ageRange = [...Array.from(new Array(100), (x, i) => i + 18)]
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
        if (values.age === ''){
            swal('Aviso', 'Debe seleccionar su edad', 'warning');
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
              setStep(2)

        }

    }, [values])



    return (
        <>
            {/* <img src={labsicon} style={{width:'50%'}}></img> */}
            <h2 style={{color:'black', fontWeight:'normal', fontSize:'1.1rem'}}>Responde unas sencillas preguntas para realizar el diagnóstico.</h2>
        <div className='diabetes'>

            <div className='question_diabetes'>
                    
                <div className='inputContainer'>
                    <label>Edad</label>
                    <select type="text" value={values.age} name='age' onChange={handleChange} >
                        <option selected ='selected'>Seleccione</option>
                        {ageRange.map(years => (<option>{years}</option>))}
                    </select>
                </div>
                    <div className='inputContainer'>
                        <label>Sexo:</label>
                        <select type="text" value={values.sexo} name='sex' onChange={handleChange}>
                            <option value='masculino'>Masculino</option>
                            <option value='femenino'>Femenino</option>
                            <option value='intersexual'>Intersexual</option>
                        </select>
                    </div>
                    <div className='inputContainer'>
                        <label>Fumas <br></br>actualmente? </label>
                        <select type="text" value={values.fumador} name='smoker' onChange={handleChange}>
                            <option value='no'>NO</option>
                            <option value='si'>SI</option>
                            <option value='ocasional'>Oscasional</option>
                        </select>
                    </div>
                    <div className='inputContainer'>
                        <label>Eres <br></br>diabético? </label>
                        <select type="text" value={values.diabetes} name='diabetic' onChange={handleChange}>
                            <option value='no'>NO</option>
                            <option value='si'>SI</option>
                            <option value='no lo sé'>NO LO SÉ</option>
                        </select>
                    </div>
                    <div className='inputContainer'>
                        <label className='questionDiabetes__label2'>Sufres<br></br> hipertensión? </label>
                        <select type="text" value={values.hipertension} name='hypertensive' onChange={handleChange}>
                            <option value='no'>NO</option>
                            <option value='si'>SI</option>
                        </select>
                    </div>
                    <div className='inputContainer'>
                        <label className='questionDiabetes__label2'>Algun familiar sufrió un infarto precoz?</label>
                        <select type="text" value={values.medical_records} name='medical_records' onChange={handleChange}>
                            <option value='no'>NO</option>
                            <option value='si'>SI</option>
                        </select>
                    </div>
                    {/* <button onClick={()=>createDatasetDocument()}> */}
                    <div className='diabetesForm__buttons'>
                        {/* <button className='button2' onClick={() => {setStep(0)}}>
                            Atrás
                        </button> */}
                        <button className='button1' onClick={() => {createDatasetDocument()}}>
                            Siguiente
                        </button>
                    </div>
            </div>
            
        </div>
    </>
    )
}

export default Form