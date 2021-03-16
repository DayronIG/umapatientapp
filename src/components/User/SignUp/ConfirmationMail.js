import React from 'react';
import {useHistory} from 'react-router-dom';
import Logo from '../../../assets/logo.png';
import { GenericInputs, GenericButton, Stepper } from '../Login/GenericComponents';


const ConfirmationMail = () => {
    const history = useHistory();
    
    return (
        <section className='signUp'>
            <img className='signUp__logo' src={Logo} alt="uma" onClick={() => history.push('/')}/>
            <section className='signUp__content'>
                <Stepper complete={4}/>
                <article className='signUp__content__mainText'>
                    <h1 className='title'>¿No te llegó el mail?</h1>
                    <p className='subtitle'>Ingresa tu número de teléfono celular para enviarte el código por SMS.</p>
                </article>
               <GenericInputs type='text' label='Ingresa tu teléfono celular'/>
               <GenericButton>Enviar código</GenericButton>
            </section>
        </section>
    )
}

export default ConfirmationMail;
