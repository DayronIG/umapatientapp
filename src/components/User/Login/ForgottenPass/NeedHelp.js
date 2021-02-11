import React from 'react';
import { GenericButton } from '../GenericComponents';
import BackButton  from '../../../GeneralComponents/Backbutton';
import '../../../../styles/user/forgottenPass/forgottenPass.scss';

const NeedHelp = () => {
    return (
        <section className='needHelp'>
            <BackButton inlineButton/>
            {/* customTarget por props para backbutton */}
            <section className='needHelp__forgottenPass'>
                <h1 className='title'>¿Tienes problemas para ingresar?</h1>
                <div className='needHelp__forgottenPass_btns'>
                    <GenericButton>Olvidé mi mail</GenericButton>
                    <GenericButton>Olvidé mi contraseña</GenericButton>
                </div>
            </section>
        </section>
    )
}

export default NeedHelp;
