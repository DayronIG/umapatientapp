import React, { useEffect, useState } from 'react';
import { GenericHeader } from '../components/GeneralComponents/Headers';
import MobileLogin from '../assets/mobileLogin.svg';
import '../../src/styles/generalcomponents/RedirectWs.scss';

const RedirectWs = (props) => {
    const [state, setState] = useState('');

    useEffect(() => {
        if(window.innerWidth > 768){
            setState('desktop');
        }
    },[])

    return (
            <>
                <GenericHeader className='header' profileDisabled={true}>Registro</GenericHeader>
                    <section className='redirect__container'>
                        <div className='redirect__querycontainer'>
                            <div className='redirect__container--img'>
                                <img src={MobileLogin}></img>
                            </div>
                            <div className='redirect__container--text'>
                                {state === 'desktop' ? 
                                    <p>Te hemos enviado un link a tu celular. <br /> Sigue las instrucciones para ingresar a la plataforma</p> 
                                    :
                                    <p>Para finalizar el registro, abra el link que le enviamos a <b>Whatsapp</b></p>
                                }                   
                            </div>
                        </div>
                    </section>
            </>
    )
}

export default RedirectWs; 