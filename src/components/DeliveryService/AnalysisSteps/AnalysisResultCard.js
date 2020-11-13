import React from 'react';
import {Link} from 'react-router-dom';

const AnalysisResultCard = ({link}) => {
    return <div className="laboratory__container">
      <h3 className="laboratory__header">Ver estudio de laboratorio</h3>
      <Link to={link} target="_blank" download>
        <div className="laboratory__description">
            <button type="button">Descargar</button>
        </div>
      </Link>
    </div>
}

export default AnalysisResultCard;