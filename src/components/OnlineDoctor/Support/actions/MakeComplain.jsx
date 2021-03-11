import React, { useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useLocation, useHistory} from 'react-router-dom';
import swalReact from '@sweetalert/with-react';
import swal from 'sweetalert';
import { cx_action_create } from '../../../../config/endpoints';
import axios from 'axios';
import moment from 'moment';
import queryString from 'query-string';


const SendComplain = ({ sendComplain }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [claim, setClaim] = useState('');
    const patient = useSelector(state => state.user)
	const { currentUser } = useSelector((state) => state.userActive)
    const location = useLocation();
    const {id} = queryString.parse(location.search)

    const onSubmitButton = () => {
        if (!claim.trim()) {
        swalReact(
            <div className="text-center">
            <h5>No puede enviar un reclamo vacío</h5>   
            </div>
        )
        return;
        }
        handleComplain(claim);
    }

    async function handleComplain(claim) {
        dispatch({type: 'LOADING', payload: true})
        let data = {
            ws: patient.ws,
            dni: patient.dni,
            dt: moment().format('YYYY-MM-DD HH:mm:ss'),
            assignation_id: id,
            appointment_path: '',
            type: 'complain',
            complain: claim
        }
        currentUser.getIdToken().then(async token => {
            let headers = { 'Content-Type': 'Application/Json', 'Authorization': token }
            await axios.post(cx_action_create, data, headers)
                .then(() => {
                    dispatch({type: 'LOADING', payload: false})
                    swal('Enviado', 'El reclamo fué enviado con éxito. Será evaluado por nuestro equipo.', 'success')
                    return history.push(`/onlinedoctor/queue/${patient.uid}?dependant=false`)
                })
                .catch(()=> {
                    dispatch({type: 'LOADING', payload: false})
                    swal('Error', 'Hubo un error al enviar el reclamo, intenta nuevamente.', 'error')
                })
        })
    }

    return (
        <div className="action__container">
            <div className='detail-modal-content'>
            <h2>Por favor detalla lo mejor posible el problema</h2>
                <textarea placeholder='Escriba aquí el motivo de su reclamo' onChange={(e) => setClaim(e.target.value)}></textarea>
                <button className='btn btn-blue-lg' onClick={onSubmitButton}>Enviar reclamo</button>
            </div>
        </div>
    )
}

export default SendComplain;