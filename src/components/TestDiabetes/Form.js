import React, { useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios' 
import swal from 'sweetalert';
import {NODE_SERVER} from '../../config/endpoints'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

const Form = ({step, setStep}) => {
    const dispatch = useDispatch();
    const [send, setSend] = useState(false)
    const { dni } = useSelector(state => state.user)   
    const [años, setAños] = useState('')
    const [values, setValues] = useState({
        sex: 'Masculino',
        smoker: 'no',
        diabetic: 'no',
        hypertensive: 'no',
        medical_records: 'no',
        dob: '',
        age:''})



        const handleChange = e => {
            setValues({
                ...values,
                [e.target.name] : e.target.value
            })
            setTimeout(2000)
            dispatch({ type: "DIABETIC_TEST_FILL", payload: values })

            if(values.dob){
                setAges()
                dispatch({ type: 'DIABETIC_TEST_FILL', payload: {... values, age: años}})
            }
            // else if(age){
            //     setScore()
            // }
        }


	const setAges = () => {
		let pAge = moment().diff(values.dob, 'years')
		setAños(pAge)   
    }



    const createDatasetDocument = useCallback(() => {
        if(!values.dob){
            swal('Aviso', 'Debe completar los campos', 'warning');
        } else {
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
                        <label>Fecha de Nacimiento:</label>
                        <input type="date" value={values.fechaNac} name='dob' onChange={handleChange}/>
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
                        <select type="text" value={values.antecedentes} name='medical_records' onChange={handleChange}>
                            <option value='si'>SI</option>
                            <option value='no'>NO</option>
                        </select>
                    </div>
                    {/* <button onClick={()=>createDatasetDocument()}> */}
                    <div className='diabetesForm__buttons'>
                        <button onClick={() => {setStep(0)}}>
                            Atrás
                        </button>
                        <button onClick={() => {setStep(2)}}>
                            Enviar
                        </button>
                    </div>
                </div>
            
        </div>
    )
}

export default Form