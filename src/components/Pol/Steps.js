import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard, faSmile, faArchway, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faCreditCard } from '@fortawesome/free-regular-svg-icons';
// import { Link } from 'react-router-dom';
import FooterBtn from '../GeneralComponents/FooterBtn';

export default ({ step, goToStep }) => {
  return (
    <>
      <div className="polInstructions">
        <div className="polInstructions__container">
          <h3 className="polInstructions__container--title">
            {step === "1" ?
              "¿Cómo Registrarme?"
              : step === "2" &&
              "Recomendaciones para tomar las fotos de tu DNI"
            }
          </h3>
        </div>
        {step === "1" &&
          <div className="polInstructions__container">
            <p className="polInstructions__container--text">Sólo deberás tomar <br /> fotos de:</p>
          </div>
        }
        {step === "1" ?
          <ul>
            <li>
              <div className="instruction-number">1</div>
              <div className="instruction-name">Frente de tu DNI</div>
              <div className="instruction-image"><FontAwesomeIcon icon={faIdCard} /></div>
            </li>
            <li>
              <div className="instruction-number">2</div>
              <div className="instruction-name">Dorso de tu DNI</div>
              <div className="instruction-image"><FontAwesomeIcon icon={faCreditCard} /></div>
            </li>
            <li>
              <div className="instruction-number">3</div>
              <div className="instruction-name">Su rostro</div>
              <div className="instruction-image"><FontAwesomeIcon icon={faSmile} /></div>
            </li>
          </ul>
          : step === "2" &&
          <ul>
            <li>
              <div className="instruction-image"><FontAwesomeIcon icon={faArchway} /></div>
              <div className="instruction-name">Apoyelo sobre la mesa</div>
            </li>
            <li>
              <div className="instruction-image"><FontAwesomeIcon icon={faIdCard} /></div>
              <div className="instruction-name">Encuadralo para que coincida con el marco</div>
            </li>
            <li>
              <div className="instruction-image"><FontAwesomeIcon icon={faCheckCircle} /></div>
              <div className="instruction-name">La foto se tomará automáticamente</div>
            </li>
          </ul>
        }
      </div>
      {/* {step === "1" ?
                // <div className="instructions-next">
                //     <hr />
                //     <button className="btn btn-blue-lg" onClick={() => goToStep()}>Siguiente</button>
                // </div>
               // : step === "2" &&
                // <div className="instructions-next p-2">
                //     <hr />
                //     <div className="">
                  //       <Switch /> 
                   //      <Link to="">Acepto los términos y condiciones para registrarme</Link>
                   // </div>
                   // <button className="btn btn-blue-lg" onClick={() => goToStep()}>Empezar</button>
                //</div> 
            } */}
      {step === "1" ?
        <FooterBtn
          mode='single'
          text={'Siguiente'}
          callback={() => goToStep()}
        />
        : step === "2" &&
        <>
          <FooterBtn
            mode='single'
            text={'Empezar'}
            callback={() => goToStep()}
          />
        </>
      }
    </>
  )
}