import React, { useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import swalReact from '@sweetalert/with-react';
import swal from 'sweetalert';
import AnswerComplain from '../../../CX';
import MobileModal from '../../../GeneralComponents/Modal/MobileModal';
import { cx_action_create } from '../../../../config/endpoints';
import axios from 'axios';
import moment from 'moment';
import Satisfy from './Actions/Satisfy'
import MakeAppointment from './Actions/MakeAppointment';
import PhoneCall from './Actions/PhoneCall';
import Autonomus from './Actions/Autonomus';
import Reassign from './Actions/Reassign';
import Derivate from './Actions/Derivate';
import Default from './Actions/Default';

const SendComplain = ({ sendComplain }) => {
    const dispatch = useDispatch()
    const [claim, setClaim] = useState('');
    const patient = useSelector(state => state.user)
    const [responseAction, setResponseAction] = useState({ response: '', action: '' })
	const { currentUser } = useSelector((state) => state.userActive)
    const { assignedAppointment } = useSelector(state => state.queries)

    const onSubmitButton = () => {
        if (!claim.trim()) {
        swalReact(
            <div className="text-center">
            <h5>No puede enviar un reclamo vacío</h5>   
            </div>
        )
        return;
        }
        sendComplain(claim);
    }

    async function handleComplain(type, claim) {
        dispatch({ type: 'TOGGLE_MODAL_ACTION', payload: true })
        dispatch({ type: 'TOGGLE_DETAIL' });
        let data = {
            ws: patient.ws,
            dni: patient.dni,
            dt: moment().format('YYYY-MM-DD HH:mm:ss'),
            assignation_id: assignedAppointment.appointments[0][14] || patient.incidente_id,
            appointment_path: '',
            type: 'complain',
            complain: claim
        }
        try {
            currentUser.getIdToken().then(async token => {
                let headers = { 'Content-Type': 'Application/Json', 'Authorization': token }
                const res = await axios.post(cx_action_create, data, headers)
                setResponseAction({ response: res.data.ai_response, action: res.data.ai_action })
                dispatch({type: 'SET_CX_RESPONSE', payload: res.data})
            })
        } catch (error) {
            dispatch({ type: 'TOGGLE_MODAL_ACTION', payload: false })
            swal('Error', 'Hubo un error al enviar el reclamo, intenta nuevamente.', 'error')
        }
    }


    return (
        <>
        <AnswerComplain responseAction={responseAction} />
        <div className='detail-modal-content'>
            <textarea placeholder='Escriba aquí el motivo de su reclamo' onChange={(e) => setClaim(e.target.value)}></textarea>
            <button className='btn btn-blue-lg' onClick={handleComplain}>Enviar reclamo</button>
        </div>
        </>
    )
}

export default SendComplain;