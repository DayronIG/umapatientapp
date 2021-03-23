import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FooterBtn from '../../GeneralComponents/FooterBtn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { make_appointment } from '../../../config/endpoints';
import axios from 'axios';
import umacare from '../../../assets/umacare.png';
import Switch from 'react-switch';
import NotifyFriends from './NotifyFriends';
import moment from 'moment';
import swal from 'sweetalert';

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
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()

    async function _getOnlineAppointment() {
        dispatch({ type: 'LOADING', payload: true });
		try {
			let dt = moment().tz('America/Argentina/Buenos_Aires').format('YYYY-MM-DD HH:mm:ss');
			let data = {
				age: user.dob || '',
				biomarker: [],
				destino_final: '',
				diagnostico: '',
				dt,
				dni: user.dni,
				epicrisis: '',
				lat: user.lat || '', // Coordenadas de Melian si no hay location
				lon: user.lon || '',
				msg: 'make_appointment',
				motivo_de_consulta: 'Empeoramiento de síntomas en Umacare (seguimiento de COVID)',
				alertas: '',
				ruta: '',
				sex: user.sex || '',
				specialty: 'online_clinica_medica',
                ws: user.ws,
                uid: user.core_id,
                uid_dependant: false,
                category: 'GUARDIA_UMACARE'
			};
			const headers = { 'Content-type': 'application/json' };
            const res = await axios.post(make_appointment, data, headers);
			dispatch({ type: 'LOADING', payload: false });
            localStorage.setItem('currentAppointment', JSON.stringify(data.ruta));
            localStorage.setItem('currentMr', JSON.stringify(res.data.assignation_id));
            return history.replace(`/onlinedoctor/queue/${user.uid}?dependant=false`);
		} catch (err) {
			console.log(err)
			swal('Error', 'Hubo un error al agendar el turno, intente nuevamente.', 'error');
			dispatch({ type: 'LOADING', payload: false });
		}
    }

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
                        onClick={() => _getOnlineAppointment()}
                    >
                        realizar consulta online
                    </button>
                </div>
                <NotifyFriends />
            </div>
            <FooterBtn text='Volver a inicio'
                callback={() => history.push(`/${user.dni}/core/${user.core_id}`)} />
        </>
    )
}
