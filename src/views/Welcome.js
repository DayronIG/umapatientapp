import React, { useEffect } from "react";
import {withRouter} from 'react-router-dom';
import "../styles/welcome.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import * as DetectRTC from 'detectrtc';
// import { useAddToHomescreenPrompt } from "../components/Utils/addToHomeHook";
// import AddToHomescreen from 'react-add-to-homescreen';
import logo from '../assets/icon.png'


const Welcome = props => {
  const dispatch = useDispatch();
  const [install, setInstall] = React.useState(true)

  useEffect(() => {
    //console.log(DetectRTC.isWebsiteHasWebcamPermissions())
    DetectRTC.load(function () {
      // console.log(DetectRTC.osName)
      if (DetectRTC.osName === "iOS") {
        setInstall(false)
      }
    });
  }, []);

  function installAction() {
    try {
      props.showInstallPrompt()
    } catch (err) {
      props.history.push('/')
    } finally {
      setTimeout(() => props.history.push('/'), 1000)
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
          <span className="welcome__textContainer--messageAboveButton">Sigue las indicaciones para instalarla</span>        
          {install ?
            <button className="welcome__button--instalar" onClick={() => installAction()}>Instalar</button>
            :            
            <button className="btn btn-blue-lg" onClick={() => props.history.push('/')}>Continuar</button>
          }
          <br/><br/>
          <span className="welcome__textContainer--messageBelowButton">(Para una mejor experiencia, te sugerimos realizar este proceso a través del celular)</span>
        </div>
      </div>
      {/* <AddToHomescreen onAddToHomescreenClick={() => handleAddToHomescreenClick()} title="Instalar UMA" icon={logo} /> */}
    </section>
    </div>
  );
};

export default withRouter(Welcome);
