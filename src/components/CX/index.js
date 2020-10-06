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
            {!response ? <Loading /> :
                <div className='detail-modal-content'>
                    {/* Respuesta harcodeada comentada */}
                    {/* <p className="response">¡Gracias por comunicarte con ÜMA! Nuestro equipo revisará tu reclamo y nos pondremos en contacto contigo en caso de ser necesario.</p>  */}
                    <p className="response">{response}</p>
                    {showActionComponent()}
                </div>
            }
        </>
    )
}

export default AnswerComplain
