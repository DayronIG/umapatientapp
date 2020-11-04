import React from 'react';
import { GenericHeader } from '../components/GeneralComponents/Headers';
import MobileLogin from '../assets/mobileLogin.svg';
import '../../src/styles/generalcomponents/RedirectWs.scss';

const RedirectWs = (props) => {


    return (
        <section className='redirect__container'>
             <GenericHeader profileDisabled={true}> Registro</GenericHeader>
             <div className='redirect__container--img'>
                 <img src={MobileLogin}></img>
             </div>
             <div className='redirect__container--text'>
                Para finalizar el registro, abra el link que le enviamos a<b>Whatsapp</b> 
             </div> 
        </section>
    )
}

export default RedirectWs;