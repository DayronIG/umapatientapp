import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { GenericButton, GoogleButton, FacebookButton, MicrosoftButton, EmailButton } from '../Login/GenericComponents';
import Exclamation from '../../../assets/illustrations/exclamation.png';
import '../../../styles/user/signUp/signUp.scss';

const AlreadyExists = () =>  {
    const history = useHistory()
    const {method} = useParams();

    const handleSignIn = () => {
        history.push('/')
    }

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
                    <h1 className='title exists'>Este mail se encuentra en uso</h1>
                    {
                        method ?
                            <p className='subtitle'>Ya existe un usuario registrado con el  método <strong>{method === 'password' ? 'mail y contraseña' : method}</strong></p> :
                            <p className='subtitle'>Ya existe un usuario registrado con el mail seleccionado</p>
                    }
                    <p className='subtitle'>¿Deseas ingresar?</p>
                </section>
                <section>
                    {
                        method && method !== 'password' ?
                        <section className="login__buttonGroup column center">
                            {renderButton(method)}
                        </section> :
                        <GenericButton action={handleSignIn} >
                            Ingresar
                        </GenericButton>
                    }
                    <GenericButton action={()=> history.push('/signup')}>
                        Registrar otro mail
                    </GenericButton>
                </section>
            </section>
        </section>
    )
}

export default AlreadyExists;
