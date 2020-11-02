import React, { useState } from 'react';
import TrackingStepper from './Stepper';
import enfermero from "../../assets/img/enfermero_en_camino.svg";
import FrequentQuestions from './DeliveryPurchase/Components/FrequentQuestions';
import '../../styles/hisopado/frequentQuestions.scss';

const SearchingProfessional = () => {
  const activeStep = 0;
  const [frequentQuestions, setFrequentQuestions] = useState(false);

  const renderContent = () => {
    if(frequentQuestions) {
      return <FrequentQuestions goBack={() => setFrequentQuestions(false)}/>
    } else {
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
            <button className="tracking__btn-info" onClick={()=>setFrequentQuestions(true)}>Preguntas frecuentes</button>
            {/* <button className="tracking__btn tracking__btn-continue">Seguir hisopado</button>
            <button className="tracking__btn tracking__btn-cancel">Cancelar hisopado</button> */}
          </div>
    
          <div className="tracking__stepper">
            <h2 className="tracking__stepperTitle">Detalle del pedido</h2>
            <TrackingStepper active={activeStep} />
          </div>
        </section>
      )
    }
  }

  return renderContent();
}

export default SearchingProfessional;
