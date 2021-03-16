import React, { useState, useEffect } from 'react';
import BackButton from '../../../GeneralComponents/Backbutton';
import { TextAndLink, GoogleButton, FacebookButton, MicrosoftButton, EmailButton } from '../GenericComponents';
import { useParams, useHistory} from 'react-router-dom';
import { useSelector } from 'react-redux';
import ConfirmMail from '../../../../assets/illustrations/ConfirmMail.png';
import '../../../../styles/user/forgottenPass/forgottenPass.scss';

const ConfirmAcc = () => {
    const history = useHistory();
    const [passW, setPassW] = useState(false)
    const {method} = useParams();
    const { email } = useSelector(state => state.user);

    useEffect(() => {
        if(method) {
            if(method === 'sendEmail') {
                setPassW(false);
            }
            
            if(method === 'login') {
                setPassW(true);
            }
        }
    }, [method])
    
    return (
        <section className='needHelp'>
            <BackButton inlineButton/>
            <section className='needHelp__forgottenPass'>
                {passW ? null : <img src={ConfirmMail} alt='Mailbox' />}
                <h1 className='title'>{ passW ? '¿Olvidaste tu mail?' : 'Te hemos enviado un mail' }</h1>
                {/* Poner mail dinamico */}
                <p className='subtitle'>{passW ? `El documento ingresado está asociado a este email: ${email}` : 'Si el mail que ingresaste está registrado, te llegará un mail con un link para restablecer tu contraseña. ' }</p>
                <p className='subtitle'>{ passW ? 'Si reconoces estos datos, puedes ingresar con tu cuenta.' : 'PD: ¡No olvides revisar el Spam!' }</p>
            </section>
            <div className='needHelp--forgottenPass-actions'>
                {
                    passW ?
                    <>
                        <section className="login__buttonGroup column">
                            <GoogleButton />
                            <FacebookButton />
                            <MicrosoftButton />
                            <EmailButton />
                        </section>
                        <TextAndLink link='O registrate acá' action={() => history.push('/signup')} />
                    </>
                    :
                    <TextAndLink link='Ir al inicio' action={() => history.push('/')} />
                }
            </div>
        </section>
    )
}

export default ConfirmAcc;
