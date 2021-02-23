import React, { useState } from 'react';
import BackButton from '../../../GeneralComponents/Backbutton';
import { LoginButtons } from '../GenericComponents';
import '../../../../styles/user/forgottenPass/forgottenPass.scss';

const ForgottenAccError = () => {
    const [typeError, setTypeError] = useState(false)
    // true DNI, false telefono

    return (
       <section className='needHelp'>
           <BackButton/>
           <article className='needHelp__forgottenPass'>
               <h1 className='title'>Lo sentimos</h1>
               <p className='subtitle'>No hemos encontrado ninguna cuenta {typeError ? 'con ese DNI.' : 'asociada a ese celular.'}</p> 
               <p className='subtitle'>¿Deseas crear una cuenta?</p>
           </article>
           <LoginButtons signUp/>
       </section>
    )
}

export default ForgottenAccError;
