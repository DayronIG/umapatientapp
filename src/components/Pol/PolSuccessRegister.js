import React from 'react';
import FooterBtn from '../GeneralComponents/FooterBtn';
import { GenericHeader } from '../GeneralComponents/Headers';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import '../../styles/pol/Pol.scss';


const PolSuccessRegister = () => {
    return (
        <div className='polRegister-container'>
            <GenericHeader />
            <div className="polText-container">
                <FontAwesomeIcon className='polIcon' icon={faCheckCircle} />
                <h1 className='text'>Pago Realizado</h1>
            </div>
            <FooterBtn color='polRegister-footer' />
            <button className="proof-button"><b>inicio</b></button>
            <button className="begin-button"><b>Realizar Fé de Vida</b></button>
        </div>
    )
}

export default PolSuccessRegister;