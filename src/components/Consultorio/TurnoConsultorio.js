
import React from 'react';
import waiting from '../../assets/icons/waiting.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import '../../styles/SoonContent.scss';

const TurnoConsultorio = (props) => {
  const [back, setback] = React.useState(false)
  return (
    <>
      <div className='container-appointment'>
        <div className='soon-content'>
          <div className="soon-info" onClick={() => setback(!back)}>
            <FontAwesomeIcon icon={faInfoCircle} className="tag-icon" />
          </div>
          {back ?
            <>
              <p className="mt-3 h32">Pronto tendremos disponibles la solicitud desde la pantalla de tu celular de turnos de consultorios para más de 20 especialidades, estudios y laboratorios eligiendo fecha, lugar y médico.</p>
            </>
            :
            <>
              <h1 className='h13'>Próximamente<br/>Turno en consultorio</h1>
              <h4 className='h33'>
                Lo ayudará a sacar un turno sin moverse de la comodidad de la casa
              </h4>
              <div className='img2'>
                <img src={waiting} alt="en construcción" />
              </div>
            </>
          }
        </div>
        <footer class="customFooterBtn">
          <div class="customFooterBtn__container">
            <button class="customFooterBtn__container--btn footer-primary" onClick={() => props.history.push(`/`)}>Volver a Inicio</button>
          </div>
        </footer>
      </div>
    </>
  )
}

export default TurnoConsultorio;
