import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reassign_portal } from '../../../config/endpoints';
import axios from 'axios';
import swal from 'sweetalert';

const Reassign = () => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.userActive.token)
    const { path, cuil } = useSelector(state => state.queries.assignedAppointment);
    const [ enabled, setEnabled] = useState(true)

    async function confirmReassign() {
        if(enabled) {
            dispatch({ type: 'TOGGLE_MODAL_ACTION', payload: false })
            let data = {
                assignations_origen: path.split('assignations/')[1],
                assignations_destino: '',
            }
            setEnabled(false)
            let headers = { 'Content-Type': 'Application/Json', 'Authorization': token  }
            const res = await axios.post(reassign_portal, data, headers)
                if (res.data.done === 'ok') {
                    swal('Éxito', 'Se ha reasignado el turno', 'success')
                    window.location.reload()
                } else {
                    console.log(path, data)
                    swal('Aviso', 'No se puede reasignar este turno', 'warning')
                }
        }
    }

    if(cuil === "bag") {
        return (
            <div>
                <button onClick={() => dispatch({ type: 'TOGGLE_MODAL_ACTION', payload: false })}
                    className="btnNO">Continuar</button>
            </div>  
        )
    } else {
    return (
        <>
            <p className="question">¿Desea reasignar la consulta?</p>
            <div>
                <button onClick={() => confirmReassign()} className="btnSI">Si</button>
                <button onClick={() => dispatch({ type: 'TOGGLE_MODAL_ACTION', payload: false })}
                    className="btnNO">No</button>
            </div>
        </>
    )
    }
}

export default Reassign
