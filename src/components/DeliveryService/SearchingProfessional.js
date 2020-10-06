import React from 'react'
import hospital from "../../assets/img/hospital.png";

const SearchingProfessional = () => {
  return (
    <div className="laboratory__container">
      <h3 className="laboratory__header">Buscando un profesional para realizar el hisopado</h3>
      <div className="laboratory__description">
        <div className="laboratory__image">
          <img src={hospital} alt="hisopado" />
        </div>
        <div className="laboratory__text">
        Tu pedido ya fue aprobado y estamos buscando un profesional para realizar el hisopado, aguarda unos minutos...<br />
        El hisopado consistirá en la extracción de una muestra de secreción de la parte superior de la garganta y el interior de la nariz utilizando un hisopo. Es una práctica habitual que se utiliza para identificar la presencia de distintos organismos que puedan causar enfermedades, entre ellos el virus COVID-19.  
        </div>
      </div>
    </div>
  )
}

export default SearchingProfessional
