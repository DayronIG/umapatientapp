import React from 'react';

export function GoogleButton({ buttonText, action }) {
    return <div className="btn" onClick={action}>
        <img src={require('../../assets/google.png')} alt="google" />
        <div className="">
            {buttonText || "Ingresar con windows"}
        </div>
    </div>
}

export function MicrosoftButton({ buttonText, action }) {
    return <div className="btn"  onClick={action}>
        <img src={require('../../assets/microsoft.png')} alt="google" />
        <div className="">
            {buttonText || "Ingresar con windows"}
        </div>
    </div>
}

export function EmailButton({ buttonText, action }) {
    return <div className="btn" onClick={action}>
        <img src={require('../../assets/email.png')} alt="google" />
        <div className="">
            {buttonText || "Ingresar con windows"}
        </div>
    </div>
}