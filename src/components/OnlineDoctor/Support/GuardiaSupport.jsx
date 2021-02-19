import React from 'react';
import {FaAngleRight} from 'react-icons/fa';
import SendComplain from './actions/MakeComplain';
import CancelAppointment from './actions/CancelAppointment';

const GuardiaSupport = () =>{
    return (<>
        {<SendComplain />}
        {/* <CancelAppointment /> */}
        <div className="issue__container">
            <p className="issue__title">Deseo realizar un reclamo</p>
            <FaAngleRight  className="issue__icon" />
        </div>
        <div className="issue__container">
            <p className="issue__title">Deseo cancelar mi turno</p>
            <FaAngleRight  className="issue__icon" />
        </div>
    </>)
}

export default GuardiaSupport