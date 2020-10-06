import React from 'react';
import hisopado from "../../../assets/img/hisopado.png";

const Laboratory = () => {
    return (
      <div className="laboratory__container">
        <h3 className="laboratory__header">El hisopado será llevado a un laboratorio</h3>
        <div className="laboratory__description">
          <div className="laboratory__image">
            <img src={hisopado} alt="hisopado" />
          </div>
          <div className="laboratory__text">
          La muestra extraída del hisopado es llevada a un laboratorio especializado para su análisis en el cual se aplica una técnica específica llamada PCR. Eln procedimiento consiste en amplificar una porción del virus COVID-19 para poder detectarlo. Al tratarse de una prueba compleja y debido a la alta demanda, el resultado puede demorar entre 48 y 72 horas.  <br />
          </div>
        </div>
      </div>
    )
}

export default Laboratory;