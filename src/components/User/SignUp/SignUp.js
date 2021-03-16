import React from 'react';
import '../../../styles/user/signUp/signUp.scss';
import { GoogleButton, FacebookButton, MicrosoftButton, EmailButton, TextAndLink, Stepper } from '../Login/GenericComponents';
import { useHistory } from 'react-router-dom';
import Logo from '../../../assets/logo.png';

const SignUp = () => {
    const history = useHistory();

    return (
        <section className='signUp'>
            <img className='signUp__logo' src={Logo} alt='UMA logo' onClick={() => history.push('/')} />
            <section className='signUp__content'>
                <Stepper complete={1}/>
                <div>
                    <section className="login__buttonGroup column">
                        <GoogleButton signUp />
                        <FacebookButton signUp />
                        <MicrosoftButton signUp />
                        <EmailButton signUp />
                    </section>
                </div>
                <TextAndLink text='¿Tienes cuenta?' link='Ingresa' action={() => history.push('/')} />
            </section>
        </section>
    )
}

export default SignUp;
