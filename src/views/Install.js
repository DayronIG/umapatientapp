import React, { useEffect, useState } from 'react';
import InformationPage from '../components/GeneralComponents/InformationPage.js';
import image from '../assets/icons/waiting.png';
import imageFelicitaciones from '../assets/doctor-online.svg';
import { installPrompt } from '../components/Utils/installPrompt.js';
import { useHistory, useParams } from 'react-router-dom';
import "../styles/generalcomponents/install.scss";
import { GenericHeader } from '../components/GeneralComponents/Headers';

const Install = (props) => {
    const [deferredPrompt, setDeferredPrompt] = useState();
    const [showInstall, setShowInstall] = useState(true)
    const { ws, ref } = useParams();
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

    useEffect(() => {
        if(showInstall === true) {
                window.gtag('event', 'register', {
                    'register_step': 'install',
                    'action': 'page_view',
                });
        } else {
            window.gtag('event', 'register', {
                'register_step': 'go_to_register',
                'action': 'page_view',
            });
        }
    }, [showInstall])

    async function redirect() {
        window.gtag('event', 'select_content', {
            'content_type': 'button_install_app',
          });
        await installPrompt(deferredPrompt, ws);
        setShowInstall(false);
    }

    const redirectToRegister = async () => {
        await installPrompt(deferredPrompt, ws);
        history.push(`/newregister/${ref}`);
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
                        imgProps={{
                            styles: {},
                            img: image
                        }}
                        button='Instalar'
                    />
                </div>
                :
                <div className="welcome-container">
                    <InformationPage
                        callback={redirectToRegister}
                        title='¡Felicitaciones!'                    
                        texts={[
                            'Has instalado correctamente UMA en tu celular.',
                            'Puedes ingresar y registrarte en la plataforma.'
                        ]}
                        imgProps={{
                            styles: {},
                            img: imageFelicitaciones
                        }}
                        button='Continuar'
                    />
                    <span className='text__install'>¿Ya tienes un usuario? Ingresá.</span>
                </div>
            }
        </div>
    )
}

export default Install;