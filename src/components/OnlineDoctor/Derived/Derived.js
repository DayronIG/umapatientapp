import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import BackButton from '../../GeneralComponents/Backbutton';
import MobileModal from '../../GeneralComponents/Modal/MobileModal';
import SendComplain from '../AttQueue/SendComplain';
import ImageFlow from '../../../assets/ambulance.svg';
import swal from 'sweetalert';
import moment from 'moment-timezone';
import axios from 'axios';
import { cx_action_create } from '../../../config/endpoints';
import 'moment/locale/es';
import '../../../styles/whoScreen.scss';

const WhenScreen = props => {
    const dispatch = useDispatch()
    const token = useSelector(state => state.userActive.token)
    const { patient = {} } = useSelector(state => state.queries)
    const { openDetails } = useSelector(state => state.front)

    function makeComplain(type, claim) {
        dispatch({ type: 'TOGGLE_DETAIL' })
        postComplain(type, claim)
        swal({
            title: `Se envió su reclamo`,
            text: '¿Desea continuar con una consulta médica? Sólo para consultas médicas',
            icon: 'success',
            buttons: { cancel: 'No', catch: { text: 'Si', value: true } },
            dangerMode: true,
        })
        .then((res) => {
            if (res === true) {
                props.history.push(`/${patient.dni}/onlinedoctor/when/`)
            } else {
                props.history.push('/')
            }
        })
    }

    function postComplain(type, claim) {
        let headers = { 'Content-Type': 'Application/Json', 'Authorization': token  }
        let data = {
            ws: patient.ws,
            dni: patient.dni,
            dt: moment().format('YYYY-MM-DD HH:mm:ss'),
            assignation_id: `derived_${patient.dni}`,
            appointment_path: '',
            type,
            complain: claim
        }
        axios.post(cx_action_create, data, {headers})
    }

    return (
        <div className='dinamic-template'>
            {openDetails &&
                <MobileModal title='Enviar un reclamo'>
                    <SendComplain sendComplain={claim => makeComplain('derived-complain', claim)} />
                </MobileModal>
                }
                <div className='dinamic-content-container whoAttention'>
                    <BackButton />
                    <div className='image-helper'>
                        <img src={ImageFlow} alt='medical' />
                    </div>
                    <div className="when-question"><br />
                        Según nuestro registro el servicio solicitado está pendiente de confirmación.
                        Por favor comuníquese con su obra social
                    </div>
                </div>
                <div className='dinamic-answer'>
                    <button className="btn btn-blue-lg btn-claim" onClick={() => dispatch({ type: 'TOGGLE_DETAIL' })}>Realizar un reclamo</button>
                </div>
        </div>
    )
}

export default withRouter(WhenScreen);
