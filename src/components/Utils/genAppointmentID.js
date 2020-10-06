import { yearAndMonth } from './dateUtils';
export default function (firstAppointment) {
  const { cuil } = firstAppointment
  let appointment
  try {
    appointment = firstAppointment.date
      .replace(/-/g, '')
      .concat(firstAppointment.time.replace(/:/g, ''))
    const id = `online_clinica_medica/${yearAndMonth()}/${appointment}_${cuil}`
    console.log(firstAppointment, id)
    return id
  } catch (err) {
    return false
  }
}