import React from 'react';
import "../../styles/umaCare/umaCareTracking.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const NotifyFriends = () => {
    return (
    <div className = "search-footer">
        <button className="check-button" type="submit"> 
        <FontAwesomeIcon icon={faWhatsapp} className="logo"  />
        <a className="text" 
        href={`whatsapp://send?text=Hola, me han diagnosticado con sospecha de COVID. Realizá un seguimiento preventivo de tus síntomas en el siguiente link https://wa.me/5491123000066?text=[REF:covid_estrecho]Hola%20`}>
        Avisar a las personas con las que tuve contacto estrecho
        </a>
        </button>
    </div>
    );
};

export default NotifyFriends;