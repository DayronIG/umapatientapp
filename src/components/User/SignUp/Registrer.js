import React from 'react';
import '../../../styles/user/signUp/signUp.scss';
import Logo from '../../../assets/logo.png';
import { GenericInputs } from '../Login/GenericComponents';

const Registrer = () => {
    return (
        <section className='signUp'>
            <img className='signUp__logo' src={Logo} alt='UMA logo' />
            <section className='signUp__content'>
                <p>--------</p>
                <article>
                    <h1>¡Te damos la bienvenida a Uma!</h1>
                    <p>Para crear tu cuenta, primero necesitamos que nos indiques un mail y una contraseña</p>
                </article>
                <form>
                    <GenericInputs/>
                </form>
                <section className='signUp__actions'>
                    <button>Atras</button>
                    <button>Siguiente</button>
                </section>
            </section>
        </section>
    )
}

export default Registrer;
