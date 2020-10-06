import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import ConfirmContent from './ConfirmContent';
import FooterBtn from '../../GeneralComponents/FooterBtn';
import SelectSymptoms from '../SelectSymptoms';
import '../../../styles/appointmentsonline/listAppointments.scss';

export default function ({ appoints, filterDt, unsetDate }) {
  const [selectedAppoint, setSelectedAppoint] = useState('')
  const [symptomsScreen, setSymptomsScreen] = useState(true)
  moment.locale('es')

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
          <SelectSymptoms unsetScreen={() => setSymptomsScreen(false)} />
          :
          <ConfirmContent unsetSelected={() => setSelectedAppoint('')} appoint={selectedAppoint} />
      }
    </>
  )
}