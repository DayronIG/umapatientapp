import React, {useState} from 'react';
import {FaAngleRight} from 'react-icons/fa';
import SendComplain from './actions/MakeComplain';
import CancelAppointment from './actions/CancelAppointment';

const GuardiaSupport = () =>{
    const [active, setActive] = useState('')

    return (<>
        {active === "cancel" && <CancelAppointment /> }
        {active === "complain" && <SendComplain />}
        <div className="issue__container" onClick={() => setActive("complain")}>
            <p className="issue__title">Deseo realizar un reclamo</p>
            <FaAngleRight  className="issue__icon" />
        </div>
        <div className="issue__container" onClick={() => setActive("cancel")}>
            <p className="issue__title">Deseo cancelar mi turno</p>
            <FaAngleRight  className="issue__icon" />
        </div>
    </>)
}

export default GuardiaSupport