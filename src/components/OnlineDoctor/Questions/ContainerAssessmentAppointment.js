import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmAppointment from './ConfirmAppointment';
import Assessment from './Assessment';

const ContainerAssessmentAppointment = ({ seti, setj, i, j, responseIA, coordinates, alerta, selectedAppointment }) => {
  const dispatch = useDispatch();
  const { assessment, assessment: { answersId, biomarkers, selectedSymptoms, answers, symptomsForDoc, selectedOtherSymptoms } } = useSelector(state => state);
  const { patient } = useSelector(state => state.queries);

  const propsConfirmAppointment = {
    selectedAppointment,
    selectedSymptoms,
    selectedOtherSymptoms,
    symptomsForDoc,
    patient,
    biomarkers,
    responseIA,
    coordinates,
    alerta,
    answers,
    dispatch,
    answersId,
    assessment,
    seti, 
    setj, 
    i, 
    j
  }

  return (
    <div className='mt-4'>
      {
        assessment.currentQuestion.title ?
        <Assessment  {...propsConfirmAppointment} />
        :
        <ConfirmAppointment {...propsConfirmAppointment} />
      }
    </div>
  )
}

export default ContainerAssessmentAppointment
