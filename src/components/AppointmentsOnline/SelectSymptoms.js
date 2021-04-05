
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../../styles/dinamic.scss';

const SelectSymptom = ({ unsetScreen }) => {
  const dispatch = useDispatch()
  const selectedSymptoms = useSelector(state => state.assessment.selectedSymptoms)
  const [otherSymptoms, setOtherSymptoms] = useState('')

  function sumbitSymptoms() {
    const symptomsStr = selectedSymptoms.join('. ').concat('. ' + otherSymptoms)
    dispatch({ type: 'SET_SELECTED_SYMPTOMS_STR', payload: symptomsStr })
    unsetScreen()
  }


  return (
    <>
      <div className='dinamic-template'>
        <div className='dinamic-content-container'>
          <div className='dinamic-question'>
            <span className='question-title text-white font-weight-bold'>Motivo de la consulta</span>
            <textarea
              type='text'
              onChange={e => setOtherSymptoms(e.target.value)}
              value={otherSymptoms}
              placeholder='Describa el motivo de la consulta y/o sus síntomas'
              style={{ margin: '20px', height: '50vh', border: 'none', borderRadius: '5px', padding: '10px' }}
            />
          </div>
          <button type='button' className='btn btn-blue-lg confirmConsultReason'
            onClick={sumbitSymptoms}>
            Confirmar
          </button>
        </div>
      </div>
    </>
  )
}

export default SelectSymptom
