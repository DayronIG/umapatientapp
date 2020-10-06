import React from 'react';
import { useSelector } from 'react-redux';
import FooterBtn from '../GeneralComponents/FooterBtn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import umacare from '../../assets/umacare.png';
import Switch from 'react-switch';
import NotifyFriends from './NotifyFriends';

export const SymptomsOk = ({ history }) => {
    return (
        <>
            <div className='symptomsStatus'>
                <div className='symptomsStatus__container'>
                    <span className='symptomsStatus__container--icon success'>
                        <FontAwesomeIcon icon={faCheckCircle} />
                    </span>
                </div>
                <div className='symptomsStatus__container'>
                    <p className='symptomsStatus__container--text'>
                        Sus síntomas evolucionan correctamente.
                        {' '}<span>Mañana volveremos a preguntarle.</span>
                    </p>
                </div>
            <NotifyFriends />
            </div>
            <FooterBtn text='Volver a inicio' callback={() => history.replace('/home')} />
        </>
    )
}

export const SymptomsEnd = ({ history }) => {
    return (
        <>
            <div className='symptomsStatus'>
                <div className='symptomsStatus__container'>
                    <img src={umacare} alt='' className='symptomsStatus__container--img' />
                </div>
                <div className='symptomsStatus__container'>
                    <p className='symptomsStatus__container--text'>
                        Su ciclo evolutivo de 15 días se ha completado satisfactoriamente. <br />
                        {' '}Si sus síntomas vuelven, no dude en realizar una consulta autónoma.
                    </p>
                </div>
            <NotifyFriends />
            </div>
            <FooterBtn text='Volver a inicio' callback={() => history.replace('/home')} />
        </>
    )
}

export const Disclaimer = ({ history }) => {
  return (
    <>
      <div className="symptomsStatus">
        <div className="symptomsStatus__container">
          <img src={umacare} alt="" className="symptomsStatus__container--img" />
        </div>
        <div className="symptomsStatus__container">
          <p className="symptomsStatus__container--text">
            Disclaimer de ejemplo. <br />
            {" "}El presente formulario tiene caracter de declaración jurada.
            En el marco del aislamiento social, preventivo y obligatorio por la pandemia de coronavirus COVID-19...
          </p>
          <b>¿Estás de acuerdo con las condiciones?</b><br />
          <Switch />
        </div>
      </div>
      <FooterBtn text="Volver a inicio" callback={() => history.replace('/home')} />
    </>
  )
}

export const SymptomsWarning = ({ history }) => {
    const { patient } = useSelector(state => state.queries)
    return (
        <>
            <div className='symptomsStatus'>
                <div className='symptomsStatus__container'>
                    <span className='symptomsStatus__container--icon danger'>
                        <FontAwesomeIcon icon={faTimesCircle} />
                    </span>
                </div>
                <div className='symptomsStatus__container'>
                    <p className='symptomsStatus__container--text'>
                        El cuadro podría estar empeorando, por favor realice una consulta online a la brevedad.
                    </p>
                </div>
                <div className='symptomsStatus__container'>
                    <button className='symptomsStatus__container--btn'
                        onClick={() => history.replace(`/${patient.dni}/onlinedoctor/when`)}
                    >
                        realizar consulta online
                    </button>
                </div>
                <NotifyFriends />
            </div>
            <FooterBtn text='Volver a inicio'
                callback={() => history.push(`/${patient.dni}/core/${patient.core_id}`)} />
        </>
    )
}
