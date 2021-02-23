import React from 'react';
import '../../../styles/user/signUp/signUp.scss';
import { LoginButtons, TextAndLink, Stepper } from '../Login/GenericComponents';
import Logo from '../../../assets/logo.png';

const SignUp = () => {
    return (
        <section className='signUp'>
            <img className='signUp__logo' src={Logo} alt='UMA logo' />
            <section className='signUp__content'>
                <Stepper complete={1}/>
                <div>
                    <LoginButtons signUp/>
                </div>
                <TextAndLink text='¿Tienes cuenta?' link='Ingresa' />
            </section>
        </section>
    )
}

export default SignUp;
