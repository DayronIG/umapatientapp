import React, { useEffect, useState } from "react";
import {useHistory, useParams, withRouter} from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import * as DetectRTC from 'detectrtc';
import { getDocumentFB } from "../components/Utils/firebaseUtils";
import logo from '../assets/icon.png'
import { checkNum } from "../components/Utils/stringUtils";
import Axios from "axios";
import { node_patient } from "../config/endpoints";
import swal from "sweetalert";
import { installPrompt } from "../components/Utils/installPrompt";
// import { useAddToHomescreenPrompt } from "../components/Utils/addToHomeHook";
// import AddToHomescreen from 'react-add-to-homescreen';
import InformationPage from '../components/GeneralComponents/InformationPage.js';
import "../styles/welcome.scss";

const Welcome = props => {
  const dispatch = useDispatch();
  const [install, setInstall] = React.useState(true)
  const [deferredPrompt, setDeferredPrompt] = React.useState()
  const { ws } = useParams();
  const history = useHistory();
  const [state, setState] = useState('');

    useEffect(() => {
        if(window.innerWidth > 768){
            setState('desktop');
        }
    },[])

  useEffect(() => {
    //console.log(DetectRTC.isWebsiteHasWebcamPermissions())
    DetectRTC.load(function () {
      // console.log(DetectRTC.osName)
      if (DetectRTC.osName === "iOS") {
        setInstall(false)
      }
    });
  }, []);

  useEffect(() => {
    const promptListener = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', promptListener)
    return () => {
      window.removeEventListener('beforeinstallprompt', promptListener);
    }
  }, [])

  async function installAction() {
    try {
      if (ws) {
        dispatch({ type: 'LOADING', payload: true })
        try {
          const validPhone = checkNum(ws);
          const res = await Axios.get(`${node_patient}/exists/${validPhone}`);
          if(res.data.redirect === 'register') {
             history.replace(`/${validPhone}/register`)
          } else {
            await installPrompt(deferredPrompt, ws);
            history.replace(`/${validPhone}/login`);
          }
        } catch (error) {
          swal('Ocurrió un error en el Login', `${error}`, 'warning')
        } finally {
          dispatch({ type: 'LOADING', payload: false })
        }
     }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
        <InformationPage
            callback={installAction}
            title='¡Te damos la bienvenida a UMA! '                   
            texts={[
              'Uma es nuestra plataforma de consultas online, para que puedas acceder a todos tus médicos sin moverte de tu casa.'
            ]}
            button='Continuar'
            optionalText={{
              class: 'welcomeOptionsText',
              text: state === 'desktop' ? '(Para una mejor experiencia, te sugerimos realizar este proceso a través del celular)' : ''
            }}
        />
          
    </>
  );
};

export default withRouter(Welcome);
