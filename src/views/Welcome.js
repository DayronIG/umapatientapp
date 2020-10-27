import React, { useEffect } from "react";
import {useHistory, useParams, withRouter} from 'react-router-dom';
import "../styles/welcome.scss";
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


const Welcome = props => {
  const dispatch = useDispatch();
  const [install, setInstall] = React.useState(true)
  const [deferredPrompt, setDeferredPrompt] = React.useState()
  const { ws } = useParams();
  const history = useHistory();
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
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    })
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
    <div className="welcome-container">
    <section className="welcome">

      <div className="welcome__titleContainer">
        <h2 className="welcome__titleContainer--title mt-2">¡Te damos <br/> la bienvenida a UMA!</h2>
      </div>
      <div className="welcome__textContainer">
        {/* <p className="welcome__textContainer--paragraph">
          El registro fue exitoso. Ahora instala la aplicación para comenzar a utilizarla.
        </p>
        <br /> */}
        <span className="welcome__textContainer--message">
        Uma es nuestra plataforma de consultas online, para que puedas acceder a todos tus médicos sin moverte de tu casa.
        <span onClick={() => props.showInstallPrompt()} className="link"></span>
        </span>
        <br />
        <div className="welcome__textContainer--instalar mt-4">
 
          {install ?
            <button className="welcome__button--instalar" onClick={installAction}>Instalar</button>
            :            
            <button className="welcome__button--instalar" onClick={installAction}>Continuar</button>
          }
          <br/><br/>
          
        </div>
      </div>
      {/* <AddToHomescreen onAddToHomescreenClick={() => handleAddToHomescreenClick()} title="Instalar UMA" icon={logo} /> */}
    </section>
    </div>
  );
};

export default withRouter(Welcome);
