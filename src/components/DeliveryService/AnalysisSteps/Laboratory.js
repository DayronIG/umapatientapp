import React from 'react';
import muestra from "../../../assets/img/muestra.png";

const Laboratory = () => {
    return (
      <div className="laboratory__container">
        <h3 className="laboratory__header">Analizando en laboratorio</h3>
        <div className="laboratory__description">
          <div className="laboratory__image">
            <img src={muestra} alt="muestra" />
          </div>
          <div className="laboratory__text">
            La muestra del hisopado ya está en un laboratorio especializado para su análisis. En el mismo se realiza una técnica específica llamada PCR. La misma consiste en amplificar una porción del virus COVID-19, para así poder detectarlo. Dado que es una técnica compleja y con gran demanda los resultados pueden demorar entre 48 y 72hs. <br />
          </div>
        </div>
      </div>
    ) 
}

export default Laboratory;