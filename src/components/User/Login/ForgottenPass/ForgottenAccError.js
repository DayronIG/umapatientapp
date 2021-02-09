import React from 'react';
import '../../../../styles/user/forgottenPass/forgottenPass.scss';
import BackButton from '../../../GeneralComponents/Backbutton';
import { LoginButtons } from '../GenericComponents';

const ForgottenAccError = () => {
    return (
       <section className='needHelp'>
           <BackButton/>
           <section className='needHelp__forgottenPass'>
               <h1 className='title'>Lo sentimos</h1>
               {/* Hacer dinamico para pantalla error con numero  */}
               <p className='subtitle'>No hemos encontrado ninguna cuenta con ese DNI.</p> 
               <p className='subtitle'>¿Deseas crear una cuenta?</p>
           </section>
           <LoginButtons/>
       </section>
    )
}

export default ForgottenAccError;
