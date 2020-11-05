import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../../styles/dinamic.scss';

const LaboralMotive = ({ unsetScreen }) => {
    const dispatch = useDispatch()
    const selectedSymptoms = useSelector(state => state.assessment.selectedSymptoms)
    const [otherSymptoms, setOtherSymptoms] = useState('')


    function sumbitSymptoms() {
        const symptomsStr = selectedSymptoms.join('. ').concat('. ' + otherSymptoms)
        dispatch({ type: 'SET_SELECTED_SYMPTOMS_STR', payload: symptomsStr })
        unsetScreen()
    }

    return <>
    <div className='dinamic-template'>
      <div className='dinamic-content-container'>
        <div className='dinamic-question'>
          <span className='question-title text-white font-weight-bold'>Motivo de la consulta</span>
          <select className="form-mid-input" style={{ height: "65%" }}
                id="gender" required
                onChange={e => setOtherSymptoms(e.target.value)} >
                <option defaultValue>Motivo de la consulta</option>
                <option value="Primera revisión">Primera revisión</option>
                <option value="Seguimiento">Seguimiento</option>
                <option value="Renovación de licencia">Renovación de licencia</option>
                <option value="Justificación de ausencia">Justificación de ausencia</option>
              </select>
        </div>
        <button type='button' className='btn btn-blue-lg confirmConsultReason'
          onClick={sumbitSymptoms}>
          Confirmar
        </button>
      </div>
    </div>
  </>
}

export default LaboralMotive;