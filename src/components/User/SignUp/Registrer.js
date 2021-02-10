import React from 'react';
import '../../../styles/user/signUp/signUp.scss';
import Logo from '../../../assets/logo.png';
import { ConditionButtons, GenericInputs, TextAndLink } from '../Login/GenericComponents';

const Registrer = () => {
    return (
        <section className='signUp'>
            <img className='signUp__logo' src={Logo} alt='UMA logo' />
            <section className='signUp__content'>
                <p className='signUp__content--Stepper'>--------</p>
                <article className='signUp__content__mainText'>
                    <h1 className='title'>¡Te damos la bienvenida a ÜMA!</h1>
                    <p className='subtitle'>Para crear tu cuenta, primero necesitamos que nos indiques un mail y una contraseña</p>
                </article>
                <form className='signUp__content__form'>
                    <GenericInputs label='¿Cual es tu mail?' />
                    <ConditionButtons/>
                    <GenericInputs label='Crea una contraseña' Password />
                </form>
                <section className='signUp__actions'>
                    <button>Atras</button>
                    <button>Siguiente</button>
                </section>
                <TextAndLink text='¿Tienes cuenta?' link='Ingresa'/>
            </section>
        </section>
    )
}

export default Registrer;
