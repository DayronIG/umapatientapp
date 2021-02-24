import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {FaAngleRight} from 'react-icons/fa';
import SendComplain from './actions/MakeComplain';
import CancelAppointment from './actions/CancelAppointment';
import Loading from '../../GeneralComponents/Loading';

const GuardiaSupport = () =>{
    const [active, setActive] = useState('')
    const {loading} = useSelector(state => state.front)
    
    return (<>
        {loading && <Loading />}
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