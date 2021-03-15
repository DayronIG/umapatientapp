import React from 'react';
import { GenericButton } from '../GenericComponents';
import BackButton  from '../../../GeneralComponents/Backbutton';
import {useHistory} from 'react-router-dom';
import '../../../../styles/user/forgottenPass/forgottenPass.scss';

const NeedHelp = () => {
    const history = useHistory();

    return (
        <section className='needHelp'>
            <BackButton inlineButton/>
            <section className='needHelp__forgottenPass'>
                <h1 className='title'>¿Tienes problemas para ingresar?</h1>
                <div className='needHelp__forgottenPass_btns'>
                    <GenericButton 
                        action={() => {
                            window.gtag('event', 'forgot_email')
                            history.push('/forgot/email')
                        }}
                    >
                        Olvidé mi mail
                    </GenericButton>
                    <GenericButton 
                        action={() => {
                            window.gtag('event', 'forgot_password')
                            history.push('/forgot/password')
                        }}
                    >
                        Olvidé mi contraseña
                    </GenericButton>
                </div>
            </section>
        </section>
    )
}

export default NeedHelp;
