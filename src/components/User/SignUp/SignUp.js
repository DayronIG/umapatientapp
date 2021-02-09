import React from 'react';
import '../../../styles/user/signUp/signUp.scss';
import { LoginButtons, TextAndLink } from '../Login/GenericComponents';
import Logo from '../../../assets/logo.png';

const SignUp = () => {
    return (
        <section className='signUp'>
            <img className='signUp__logo' src={Logo} alt='UMA logo' />
            <section className='signUp__content'>
                <p>--------</p>
                <div>
                    <LoginButtons/>
                </div>
                <TextAndLink text='¿Tienes cuenta?' link='Ingresa' />
            </section>
        </section>
    )
}

export default SignUp;
