import React, {useEffect} from 'react';
import '../../../styles/user/signUp/signUp.scss';
import { GoogleButton, FacebookButton, MicrosoftButton, EmailButton, TextAndLink, Stepper } from '../Login/GenericComponents';
import { useHistory, useLocation } from 'react-router-dom';
import Logo from '../../../assets/logo.png';
import queryString from 'query-string'

const SignUp = () => {
    const history = useHistory();
    const location = useLocation();
    const params = queryString.parse(location.search)

    useEffect(() => {
        if(params?.deferred) {
            localStorage.setItem('deferred', params.deferred)
        }
    }, [])


    return (
        <section className='signUp'>
            <img className='signUp__logo' src={Logo} alt='UMA logo' onClick={() => history.push('/')} />
            <section className='signUp__content'>
                <Stepper complete={1}/>
                <div>
                    <section className="login__buttonGroup column">
                        <GoogleButton signUp />
                        <FacebookButton signUp />
                        {/* <MicrosoftButton signUp /> */}
                        <EmailButton signUp />
                    </section>
                </div>
                <TextAndLink text='¿Tienes cuenta?' link='Ingresa' action={() => history.push('/')} />
            </section>
        </section>
    )
}

export default SignUp;
