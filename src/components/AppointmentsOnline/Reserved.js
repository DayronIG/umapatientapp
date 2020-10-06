import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Moment from 'react-moment';
import {GenericHeader} from '../GeneralComponents/Headers';

const Reserved = (props) => {
    const dispatch = useDispatch()
    const cart = useSelector(state => state.assignations.appointments)

    const removeAppointment = (index) => {
        let newList = cart
        newList.splice(index, 1)
        dispatch({type: 'REMOVE_APPOINT', payload: newList})
    }

    return (
    <div>
        <GenericHeader>Turnos</GenericHeader>
        {cart.length >= 3 ? <div className="text-center"><b>Ya solicitaste demasiados turnos</b></div> : <></>}
        <ul className="text-center">
            {
                cart.length >= 1 ? cart.map((appoint, index) => {
                return <li className="specialty-list  d-flex justify-content-between" key={index}>
                    <div className="appoint-detail">
                        <p className="m-0"><Moment locale="es" format="DD-MM-YYYY">{appoint.dt}</Moment></p>
                        <p className="m-0">{appoint.specialty.replace(/_/g, " ")}</p>
                        <p className="m-0">{appoint.cm}</p>
                    </div>
                    <div className="appoint-remove"
                            onClick={() => removeAppointment(index)}>
                        X
                    </div>
                </li>
            }) : <p className="m-3">No hay ningún turno seleccionado</p>}
            {cart.length >= 3 ? <>
            <button type="button" className="btn btn-info mt-3 mr-1" disabled>Seguir seleccionando</button>
            <button type="button" className="btn btn-info confirm-appointment mt-3 ml-1"
                onClick={() => props.history.push('./success')}>Confirmar</button></>
            : <>
            <button  type="button" className="btn btn-info confirm-appointment mt-3"
                    onClick={() => props.history.push(`./calendar`)}>Seguir seleccionando</button>
            </> }
        </ul>
    </div> )
}

export default Reserved