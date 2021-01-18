import React from 'react';

export function GoogleButton({ buttonText, action }) {
    return <div className="btn social" onClick={action}>
        <div className="btn__socialImg">
            <img src={require('../../assets/google.png')} alt="google" />
        </div>
        <div className="btn__socialText">
            {buttonText || "Ingresar con windows"}
        </div>
    </div>
}

export function MicrosoftButton({ buttonText, action }) {
    return <div className="btn social"  onClick={action}>
        <div className="btn__socialImg">
             <img src={require('../../assets/microsoft.png')} alt="google" />
        </div>
        <div className="btn__socialText">
            {buttonText || "Ingresar con windows"}
        </div>
    </div>
}

export function EmailButton({ buttonText, action }) {
    return <div className="btn social" onClick={action}>
        <div className="btn__socialImg">
            <img src={require('../../assets/email.png')} alt="google" />
        </div>
        <div className="btn__socialText">
            {buttonText || "Ingresar con windows"}
        </div>
    </div>
}