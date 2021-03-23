import { currentDate } from './dateUtils';
import genAppointmentID from './genAppointmentID';
import { make_appointment } from '../../config/endpoints';
import Axios from 'axios';

export default function (user, firstAppointment, medicalConsultReason, coords) {
  return new Promise(function (resolve, rejected) {
    let date = currentDate()
    const token = localStorage.getItem('token')
    let userVerified
    const headers = { 'Content-type': 'application/json'/* , 'Authorization': token */ }
    if (localStorage.getItem('appointmentUserData')) {
      userVerified = JSON.parse(localStorage.getItem('appointmentUserData'))
    }
    const appointmentId = genAppointmentID(firstAppointment)
    let data = {
      ws: userVerified.ws || user.ws,
      dni: userVerified.dni || user.dni,
      msg: 'make_appointment',
      dt: date,
      ruta: appointmentId,
      specialty: 'online_clinica_medica',
      motivo_de_consulta: medicalConsultReason,
      sex: userVerified.sex || '',
      age: userVerified.age || '',
      lat: coords.lat || '-34.5633155',
      lon: coords.lng || '-58.4739184', // Coordenadas de Melian si no hay location
      uid: userVerified.core_id
    }
    localStorage.setItem('currentAppointment', JSON.stringify(data.ruta))
    Axios
      .post(make_appointment, data, { headers })
      .then(res => {
        resolve(true)
        localStorage.setItem('currentMr', JSON.stringify(res.data.assignation_id))
      })
      .catch(err => {
        rejected(err)
      })

  })
}