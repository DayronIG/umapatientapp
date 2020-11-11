import React, { useEffect, useState } from 'react';
import InformationPage from '../components/GeneralComponents/InformationPage.js';
import imageFelicitaciones from '../assets/doctor-online.svg';
import { installPrompt } from '../components/Utils/installPrompt.js';
import { useHistory, useParams } from 'react-router-dom';
import "../styles/generalcomponents/Install.scss";
import { GenericHeader } from '../components/GeneralComponents/Headers';

const RegisterSuccess = (props) => {
    const [deferredPrompt, setDeferredPrompt] = useState();
    const { ws } = useParams();
    const history = useHistory();
    
    useEffect(() => {
        const promptListener = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        }
        window.addEventListener('beforeinstallprompt', promptListener)
        return () => {
          window.removeEventListener('beforeinstallprompt', promptListener);
        }
    }, [])

    const redirect = async () => {
        await installPrompt(deferredPrompt, ws);
        history.push(`/${ws}`);
    }

    return (
                <div>
                    <GenericHeader profileDisabled={true}></GenericHeader>
                    <div className='information__container'>
                    <InformationPage
                        callback={redirect}
                        title='¡Felicitaciones!'                    
                        texts={[
                            'Ya eres parte de UMA. Puedes ingresar a la plataforma.'
                        ]}
                        imgProps={{
                            styles: {},
                            img: imageFelicitaciones
                        }}
                        button='Ingresar'
                    />
                    </div> 
                </div>
    )
}

export default RegisterSuccess;