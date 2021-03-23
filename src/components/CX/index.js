import React from 'react'
import Loading from '../../components/GeneralComponents/Loading';
import Satisfy from './Actions/Satisfy'
import MakeAppointment from './Actions/MakeAppointment';
import PhoneCall from './Actions/PhoneCall';
import Autonomus from './Actions/Autonomus';
import Reassign from './Actions/Reassign';
import Derivate from './Actions/Derivate';
import Default from './Actions/Default';

const AnswerComplain = ({ responseAction: { response, action } }) => {

    const showActionComponent = () => {
        switch (action) {
            case 'satisfy':
                return <Satisfy />
            case 'make_appointment':
                return <MakeAppointment />
            case 'phone_call':
                return <PhoneCall />
            case 'autonomus':
                return <Autonomus />
            case 'reassign':
                return <Reassign />
            case 'derivate':
                return <Derivate />
            default:
                return <Default />
        }
    }

    return (
        <>
            <div className='detail-modal-content'>
                <p className="response">{response}</p>
                {showActionComponent()}
            </div>
        </>
    )
}

export default AnswerComplain
