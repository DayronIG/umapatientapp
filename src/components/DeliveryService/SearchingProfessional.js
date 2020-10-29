import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Check from '@material-ui/icons/Check';
import enfermero from "../../assets/img/enfermero_en_camino.svg";

const SearchingProfessional = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="tracking__container">
      <img src={enfermero} alt="Enfermero en camino" className="tracking__photo"/>

      <div className="tracking__titleContainer">
        <h1 className="tracking__title">¡Tu enfemero es Juan Rodríguez!</h1>
        <p className="tracking__subtitle">Llegará a tu casa en aproximadamente <span className="tracking__subtitle-bold">4 horas</span></p>
      </div>

      <article className="tracking__indicaciones">
        <h2 className="tracking__indicacionesTitle">Indicaciones para esperar en tu domicilio:</h2>

        <ul className="tracking__indicacionesList">
          <li className="tracking__indicacionesListItem"><span>No te automediques.</span></li>
          <li className="tracking__indicacionesListItem"><span>Recuerda colocarte el barbijo para recibir al enfermero.</span></li>
          <li className="tracking__indicacionesListItem"><span>Lávate las manos y evita el contacto con la cara.</span></li>
        </ul>
      </article>

      <div className="tracking_buttons">
        <button className="tracking__btn-info">Preguntas frecuentes</button>
        {/* <button className="tracking__btn tracking__btn-continue">Seguir hisopado</button>
        <button className="tracking__btn tracking__btn-cancel">Cancelar hisopado</button> */}
      </div>

      <div className="tracking__stepper">
        <h2 className="tracking__stepperTitle">Detalle del pedido</h2>
        <Stepper activeStep={activeStep} orientation="vertical" className="tracking__stepperBar">
          <Step className="tracking__step">
            <StepLabel className="tracking__stepLabel" StepIconComponent={Check}>En preparación</StepLabel>
            <StepContent className="tracking__stepContent">
              El personal de salud  está preparando su equipo
            </StepContent>
          </Step>
          <Step className="tracking__step">
            <StepLabel className="tracking__stepLabel" StepIconComponent={Check}>En camino</StepLabel>
            <StepContent className="tracking__stepContent">
              El enfermero está en camino
            </StepContent>
          </Step>
          <Step className="tracking__step">
            <StepLabel className="tracking__stepLabel" StepIconComponent={Check}>En domicilio</StepLabel>
            <StepContent className="tracking__stepContent">
              El enfermero ha llegado al domicilio
            </StepContent>
          </Step>
          <Step className="tracking__step">
            <StepLabel className="tracking__stepLabel" StepIconComponent={Check}>Hisopado</StepLabel>
            <StepContent className="tracking__stepContent">
              Se ha realizado el hisopado 
            </StepContent>
          </Step>
          <Step className="tracking__step">
            <StepLabel className="tracking__stepLabel" StepIconComponent={Check}>Resultado</StepLabel>
            <StepContent className="tracking__stepContent">
              Se ha cargado el resultado 
            </StepContent>
          </Step>
      </Stepper>
      </div>
    </section>
  )
}

export default SearchingProfessional
