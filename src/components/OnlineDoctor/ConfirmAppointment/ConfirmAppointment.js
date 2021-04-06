import React from 'react';
import {useSelector} from 'react-redux';
import {useHistory, useParams} from 'react-router-dom';
import {BackButton} from '../../../components/GeneralComponents/Headers'
import Loading from '../../../components/GeneralComponents/Loading';
import welcomeImg from '../../../assets/icons/doctors.png';
import { appointments_confirm, user_cancel, config } from '../../../config/endpoints';
import { getAppointmentByUid } from '../../../store/actions/firebaseQueries';
import axios from 'axios';
import moment from 'moment-timezone';
import swal from 'sweetalert';

const ConfirmAppointment = () => {
    const history = useHistory();
    const {currentUser} = useSelector(state => state.userActive) 
    const {uid} = useParams()
    const patient = useSelector(state => state.user)
    const { loading } = useSelector((state) => state.front);

    const _handleConfirm = async (e) => {
        try {
            const appointment = await getAppointmentByUid(uid || currentUser.uid, 'bag')
            if(!appointment) {
                swal("No se pudo confirmar", "Este turno ya fue confirmado, cancelado o finalizado", "warning")
                history.push('/home')
            } else {
                let data = {
                    path: appointment.path
                }
                await axios.post(appointments_confirm, data, config)
                swal("Confirmado", "Tu turno fue confirmado. En los próximos minútos un médico se contactará contigo", "success")
                history.push(`/onlinedoctor/queue/${uid}`)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const _handleCancel = async (comment, type, id) => {
        let date = moment().format('YYYY-MM-DD HH:mm:ss')
        const appointment = await getAppointmentByUid(uid || currentUser.uid, 'bag')
        if(!appointment) {
            swal("No se pudo confirmar", "Este turno ya fue confirmado, cancelado o finalizado", "warning")
        } else {
            let data = {
                ws: patient.ws || appointment.patient.ws,
                dni: patient.dni || appointment.patient.dni,
                dt: date || '',
                assignation_id: appointment.assignation_id || '',
                appointment_path: appointment.path || '',
                type: 'cancel',
                complain: '',
                uid: currentUser.uid || appointment.patient.uid,
                uid_dependant: appointment.patient.uid_dependant
            }
            await axios.post(user_cancel, data, config)
            await swal("Turno cancelado", "Tu turno fue cancelado. Si lo deseas puedes tomar una nueva consulta más tarde", "success")
            return history.push('/home')
        }
    }

    return <div className="confirmAppointment__container">
            <BackButton />
            <div className="vaccine">
            {loading && <Loading />}
                <div className="vaccineContainer">
                <>
                    <img src={welcomeImg} alt="Vacunación" className="vaccineIllustration" />
                    <h1 className="vaccineTitle">Confirma tu turno</h1>
                    <p className="vaccineText"><b>¿Deseas confirmar tu turno en ÜMA?</b></p>
                    <p className="vaccineText">Por favor, confirma tu turno para que un médico inicie la llamada en los próximos minutos.
                    </p>
                    <div className="vaccineBtns">
                        <button
                            className="vaccineBtn vaccineReject"
                            onClick={() => _handleCancel()}>
                            No
                        </button>
                        <button
                            className="vaccineBtn vaccineConfirm"
                            onClick={() => _handleConfirm()}>
                            Si
                        </button>
                    </div>
                </>
                </div>
        </div>
    </div>
}


export default ConfirmAppointment