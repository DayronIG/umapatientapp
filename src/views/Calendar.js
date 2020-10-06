import React from 'react'
import FullCalendar from '../components/Appointments/Calendar/Calendar';
import { GenericHeader, BackButton } from '../components/GeneralComponents/Headers';

const Calendar = () => {
  return (
    <>
      <GenericHeader className='header' children='Turno en consultorio' />
      <BackButton />
      <FullCalendar />
    </>
  )
}

export default Calendar;