import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useLocation, useHistory, useParams} from 'react-router-dom';
import { getAppointmentByUid } from '../../../../store/actions/firebaseQueries';
import moment from 'moment';
import { user_cancel } from '../../../../config/endpoints';
import swal from 'sweetalert';
import queryString from 'query-string';
import axios from 'axios';
import { mp_payment_url_refunds } from "../../../../config/endpoints";


const CancelAppointment = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const patient = useSelector(state => state.user)
    const { assignedAppointment } = useSelector(state => state.queries)
    const [cancelOptions, setCancelOptions] = useState('')
    const [cancelDescription, setCancelDescription] = useState('');
    const { id, dependant, activeUid } = queryString.parse(location.search)
    const { currentUser, token } = useSelector((state) => state.userActive)
    const payments = useSelector((state) => state.payments)

    async function cancelAppointment() {
        dispatch({ type: 'LOADING', payload: true })
        let date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        let path = localStorage.getItem('currentAppointment')?.slice(1,-1)
        let documentBuild = `assignations/${path}`
        if(assignedAppointment.path) {
            documentBuild = assignedAppointment.path
        } else if (path === "" || path === undefined) {
            const appointment = await getAppointmentByUid(currentUser.uid, 'bag')
            documentBuild = appointment && `assignations/online_clinica_medica/bag/${appointment.appointments[0][14]}`
        } else if(path === "" || path === undefined) {
            return history.push('/home')
        }
        if(verifyIfCanCancel()) return;
        try {
            let data = {
                ws: patient.ws,
                dni: patient.dni || '',
                dt: date || '',
                assignation_id: id,
                appointment_path: documentBuild || '',
                type: 'cancel',
                complain: '',
                uid: currentUser.uid,
                uid_dependant: dependant === 'true' ? activeUid : false 
            }
            // Verify if the attention is not canceled or closed
            await currentUser.getIdToken().then(async token => {
                let headers = { 'Content-Type': 'Application/Json', 'Authorization': token }
                await axios.post(user_cancel, data, {headers})
            })
            dispatch({ type: 'RESET_ALL' })
            if (payments.price) {
                refund()
            } else {
                await swal(`Consulta cancelada`, 
                `Será redireccionado/a al inicio`, 
                'success')
                history.push('/home')
            }
            dispatch({ type: 'LOADING', payload: false })
        } catch (err) {
            console.error(err)
            await swal(`Ocurrió un error`, 
                `No se pudo cancelar la consulta`, 
                'error')
            dispatch({ type: 'LOADING', payload: false })
        }
    }

    useEffect(() => {
        const paymentDataLocal = JSON.parse(localStorage.getItem('paymentData'))
        if (!payments.price && paymentDataLocal) {
            dispatch({
                type: 'SET_PAYMENT',
                payload: paymentDataLocal
              })
        }
    },[])

    const refund = async () => {
        swal("Como quieres que te reintegremos el monto de la consulta?", {
            buttons: {
              UmaCreditos: "UmaCreditos",
              MercadoPago: "MercadoPago"
            },
          })
          .then(async (value) => {
            let headers = { 'Content-Type': 'Application/Json', 'Authorization': token }
            const response = await axios.post(mp_payment_url_refunds, {
                cashback: value === 'MercadoPago' ? true : false,
                uid: currentUser.uid,
                paymentId: payments.id,
                transactionAmount: payments.price 
            }, { headers })
            console.log(response)
            if (value === 'MercadoPago') {
                if (response.data === 'refunded') {
                    await swal("Reintegro confirmado", "El monto fue reintegrado a tu cuenta de Mercadopago", "success");
                    dispatch({ type: 'RESET_PAYMENT' })
                    localStorage.removeItem('paymentData')
                } else {
                    await swal("Lo sentimos", "Ocurrio un problema interno y no se pudo realizar el reintegro", "error");
                }
            } else if(value === 'UmaCreditos') {
                if (response.data === 'umaCredits') {
                    await swal("Reintegro confirmado", `Te sumamos ${payments.price} umaCreditos a tu cuenta`, "success");
                    dispatch({ type: 'RESET_PAYMENT' })
                    localStorage.removeItem('paymentData')
                } else {
                    await swal("Lo sentimos", "Ocurrio un problema interno y no se pudo realizar el reintegro", "error");
                }
            }
            history.push('/home')
        });
    }

    const verifyIfCanCancel = () => {
        if(assignedAppointment && (assignedAppointment.status === "ATT" || assignedAppointment.status === "DONE")) {
            swal(`No se puede cancelar esta atención`, 
                `La atención ya fue iniciada por el médico.`, 
                'warning')
            return true
        }
        return false
    }

    return(
        <div className="action__container">
            <div className='action__bullets'>
            <h2>Por favor selecciona el motivo de la cancelación</h2>
                <div className='custom-control custom-radio'>
                    <input onChange={() => setCancelOptions('Me arrepentí')}
                        type='radio' id='customRadio1' name='customRadio' className='custom-control-input'
                    />
                    <label className='custom-control-label' htmlFor='customRadio1'>Me arrepentí</label>
                </div>
                <div className='custom-control custom-radio'>
                    <input onChange={() => setCancelOptions('Demasiada espera')}
                        type='radio' id='customRadio2' name='customRadio' className='custom-control-input'
                    />
                    <label className='custom-control-label' htmlFor='customRadio2'>Demasiada espera</label>
                </div>
                <div className='custom-control custom-radio'>
                    <input onChange={() => setCancelOptions('Error en la consulta anterior')}
                        type='radio' id='customRadio3' name='customRadio' className='custom-control-input'
                    />
                    <label className='custom-control-label' htmlFor='customRadio3'>Error en la consulta anterior</label>
                </div>
                <div className='custom-control custom-radio'>
                    <input onChange={() => setCancelOptions('otro')}
                        type='radio' id='customRadio4' name='customRadio' className='custom-control-input'
                    />
                    <label className='custom-control-label' htmlFor='customRadio4'>Otro</label>
                </div>
                {cancelOptions === 'otro' &&
                    <textarea onChange={e => setCancelDescription(e.target.value)} value={cancelDescription}></textarea>
                }
            </div>
            <button className='umaBtn' onClick={() => cancelAppointment()}>
                Confirmar
            </button>
        </div>
    )
}

export default CancelAppointment;