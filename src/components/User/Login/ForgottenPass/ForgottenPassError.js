import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { GenericButton, GoogleButton, FacebookButton, MicrosoftButton, EmailButton } from '../../Login/GenericComponents';
import Exclamation from '../../../../assets/illustrations/exclamation.png';
import '../../../../styles/user/signUp/signUp.scss';

const ForgottenPassError = () => {
    const history = useHistory()
    const { method } = useParams();

    const renderButton = (method) => {
        switch (method) {
            case 'google': return <GoogleButton />;
            case 'facebook': return <FacebookButton />;
            case 'microsoft': return <MicrosoftButton />;
            default: return;
        }
    }

    return (
        <section className='signUp'>
            <section className='signUp__content'>
                <img src={Exclamation} alt='exclamation mark' className='signUp__content--illustration exclamation' />
                <section className='signUp__content__mainText'>
                    <h1 className='title exists'>No es posible recuperar la contraseña</h1>
                    <p className='subtitle'>Este email está asociado al siguiente método de ingreso: <strong>{method === 'password' ? 'mail y contraseña' : method}</strong></p>
                    <p className='subtitle'>¿Deseas ingresar?</p>
                </section>
                <section>
                    <section className="login__buttonGroup column center">
                        {renderButton(method)}
                    </section>
                    <GenericButton action={() => history.push('/')}>
                        Volver al inicio
                    </GenericButton>
                </section>
            </section>
        </section>
    )
}

export default ForgottenPassError;
