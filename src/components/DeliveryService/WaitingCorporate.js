import React from 'react';
import chronometer from '../../assets/img/chronometer.png'

const WaitingCorporate = () => {
  return (
    <div className="laboratory__container">
      <h3 className="laboratory__header">Esperando que la obra social valide el hisopado</h3>
      <div className="laboratory__description">
        <div className="laboratory__image">
          <img src={chronometer} alt="chronometer" />
        </div>
        <div className="laboratory__text">
        Antes de asistir a tu domicilio, es necesario que tu cobertura de salud autorice la extracción de la muestra y su posterior envío a un laboratorio para que pueda ser analizada y confirmar o descartar la presencia del virus COVID-19 en tu organismo. El pedido ya se ha generado y enviado a tu obra social. No es necesario que realices ninguna acción, nosotros te avisaremos y te acompañaremos desede la aplicación durante todo el proceso. <br />
        </div>
      </div>
    </div>
  )
}

export default WaitingCorporate
