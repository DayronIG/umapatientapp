/* eslint-disable array-callback-return */
import React, { useState } from 'react';
import moment from 'moment-timezone';
import ConfirmContent from './ConfirmContent';
import FooterBtn from '../../GeneralComponents/FooterBtn';
import SelectSymptoms from '../SelectSymptoms';
import LaboralMotive from '../LaboralMotive';
import '../../../styles/appointmentsonline/listAppointments.scss';

export default function ({ appoints, filterDt, unsetDate }) {
  const [selectedAppoint, setSelectedAppoint] = useState('')
  const [symptomsScreen, setSymptomsScreen] = useState(true)
  moment.locale('es')

  function getSymptomScreen(){
    if(appoints[0].especialidad === 'medicinalaboral') {
      return <LaboralMotive unsetScreen={() => setSymptomsScreen(false)} />
    } else {
      return <SelectSymptoms unsetScreen={() => setSymptomsScreen(false)} />
    }
  }

  return (
    <>
      {!selectedAppoint ?
        <>
          <section className='listAppointmentsOnline'>
            <ul className='listAppointmentsOnline__list'>
              {appoints.map((appoint, index) => {
                if (appoint.date === filterDt) {
                  return (
                    <li key={index} className='listAppointmentsOnline__list--item' onClick={() => setSelectedAppoint(appoint)}>
                      <span className='name'>Doctor: <b>{appoint.fullname}</b></span>
                      <br />
                      <span className='date'>Fecha: {appoint.date}</span>
                      <span className='time'>hora: {appoint.time}</span>
                    </li>
                  )
                }
              })}
            </ul>
            <FooterBtn text='Volver' callback={() => unsetDate()} />
          </section>
        </>
        : symptomsScreen ?
          getSymptomScreen()
          :
          <ConfirmContent unsetSelected={() => setSelectedAppoint('')} appoint={selectedAppoint} specialty={appoints[0].especialidad} />
      }
    </>
  )
}