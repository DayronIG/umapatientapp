import React, { useState } from 'react';
import '../../../../styles/user/forgottenPass/forgottenPass.scss';
import BackButton from '../../../GeneralComponents/Backbutton';
import LoginIllustation from '../../../../assets/illustrations/Login-Illustration.png'
import { GenericInputs, GenericButton } from '../GenericComponents';

const ResetPass = () => {

    return (
        <section className='needHelp'>
            <BackButton/>
            <section className='needHelp__forgottenPass'>
                <img src={LoginIllustation} alt='Ilustracion de médicos'/>
                <h1 className='title'>Restablecer mi contraseña</h1>
                <p className='subtitle'>Ingresa una nueva contraseña para poder iniciar sesión.</p>
            </section>
            <GenericInputs label='Ingresa tu nueva contraseña' Password />
            <section className='needHelp__forgottenPass__reestablish'>
                <div className='needHelp__forgottenPass__reestablish__conditions'>
                    <input type='radio'/> <label>Mínimo 8 caracteres</label>
                </div>
                <div className='needHelp__forgottenPass__reestablish__conditions'>
                    <input type='radio'/> <label>Mínimo 1 número</label>
                </div>
            </section>
            <GenericInputs label='Confirma tu contraseña' Password />
            <div className='needHelp__confirm'>
                <GenericButton color='blue'>Cambiar contraseña</GenericButton>
            </div>
        </section>
    )
}

export default ResetPass;
