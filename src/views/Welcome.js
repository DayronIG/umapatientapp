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
      props.history.push('/home')
    } finally {
      setTimeout(() => props.history.push('/home'), 1000)
    }
  }

  return (
    <div className="welcome-container">
    <section className="welcome">
      <div className="welcome__iconContainer">
        <FontAwesomeIcon icon={faCheckCircle} />
      </div>
      <div className="welcome__titleContainer">
        <h2 className="welcome__titleContainer--title">Bienvenido a UMA</h2>
      </div>
      <div className="welcome__textContainer">
        {/* <p className="welcome__textContainer--paragraph">
          El registro fue exitoso. Ahora instala la aplicación para comenzar a utilizarla.
        </p>
        <br /> */}
        <span className="welcome__textContainer--message">
          Haga click en
          <span onClick={() => props.showInstallPrompt()} className="link">
            {" "}
            instalar
          </span>{" "}
          y luego "Agregar UMA a la pantalla principal" para instalar la aplicación.
        </span>
        {install ?
          <div className="btn btn-blue-lg" onClick={() => installAction()}>Instalar</div>
          :
          <div className="btn btn-blue-lg" onClick={() => props.history.push(`/home/${props.match.params.ws}`)}>Continuar</div>
        }
      </div>
      {/* <AddToHomescreen onAddToHomescreenClick={() => handleAddToHomescreenClick()} title="Instalar UMA" icon={logo} /> */}
    </section>
    </div>
  );
};

export default withRouter(Welcome);