import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmAppointment from './ConfirmAppointment';
import Assessment from './Assessment';

const ContainerAssessmentAppointment = ({ seti, setj, i, j, responseIA, coordinates, alerta, selectedAppointment }) => {
  const dispatch = useDispatch();
  const { assessment, assessment: { answersId, biomarkers, selectedSymptoms, selectedOtherSymptoms } } = useSelector(state => state);
  const { patient } = useSelector(state => state.queries);

  const propsConfirmAppointment = {
    selectedAppointment,
    selectedSymptoms,
    selectedOtherSymptoms,
    patient,
    biomarkers,
    responseIA,
    coordinates,
    alerta,
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
