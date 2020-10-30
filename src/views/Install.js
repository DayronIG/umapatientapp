import React, { useEffect, useState } from 'react';
import InformationPage from '../components/GeneralComponents/InformationPage.js';
import image from '../assets/icons/waiting.png';
import imageFelicitaciones from '../assets/doctor-online.svg';
import { installPrompt } from '../components/Utils/installPrompt.js';
import { useHistory, useParams } from 'react-router-dom';
import "../styles/generalcomponents/Install.scss";
import { GenericHeader } from '../components/GeneralComponents/Headers';

const Install = (props) => {
    const [deferredPrompt, setDeferredPrompt] = useState();
    const [showInstall, setShowInstall] = useState(true)
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


    async function redirect() {
        // await installPrompt(deferredPrompt, ws);
        setShowInstall(false);
    }

    const redirectToRegister = async () => {
        await installPrompt(deferredPrompt, ws);
        history.push(`/${ws}/register`);
    }

    return (
        <div>
            {showInstall ?
                <div className="welcome-container"> 
                    <InformationPage
                        callback={redirect}
                        title='¡Instalemos UMA!'                    
                        texts={[
                            'Para acceder a todos los beneficios de nuestra plataforma, te invitamos a instalar UMA en tu pantalla principal.',
                            'No te preocupes, ¡UMA no ocupa espacio en tu celular!'
                        ]}
                        img={image}
                        button='Instalar'
                    />
                </div>
                :
                <div className="welcome-container">
                    <GenericHeader profileDisabled={true}>Registro</GenericHeader> 
                    <InformationPage
                        callback={redirectToRegister}
                        title='¡Felicitaciones!'                    
                        texts={[
                            'Has instalado correctamente UMA en tu celular.',
                            'Puedes ingresar y registrarte en la plataforma.'
                        ]}
                        img={imageFelicitaciones}
                        button='Continuar'
                    />
                    <span className='text__install'>¿Ya tienes un usuario? Ingresá.</span>
                </div>
            }
        </div>
    )
}

export default Install;