import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import pol from '../../assets/icons/pol.png';
import FooterBtn from '../GeneralComponents/FooterBtn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Alert from '../GeneralComponents/Alert/Alerts';
import Loading from '../GeneralComponents/Loading';
import { cobertura } from '../../config/endpoints';

const PolWelcome = (props) => {
  const dispatch = useDispatch()
  const token = useSelector(state => state.userActive.token)
  const patient = useSelector(state => state.queries.patient)
  const front = useSelector(state => state.front)
  const [back, setBack] = useState(false)
  const [alert, setAlert] = useState({ display: true, type: '', title: '', customMessage: '' })
  const [coords, setCoords] = useState({ latitude: '', longitude: '' })

  useEffect(() => {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    navigator.geolocation.getCurrentPosition((pos) => { setCoords(pos.coords) }, (err) => console.log(err), options);
  }, [])

  const warnUser = () => {
    dispatch({ type: 'LOADING', payload: true })
    let user
    if (patient.ws) {
      user = patient
    } else {
      user = JSON.parse(localStorage.getItem('userData'))
    }
    let data = {
      'ws': `${user.ws}`,
      'dni': `${user.dni}`,
      'address': ``,
      'formatted_address': ``, // formatted address retordeb by google API
      'dob': `${user.dob}`,
      'sex': `${user.sex}`,
      'fullname': `${user.fullname}`,
      'lat': `${coords.latitude}`,
      'lon': `${coords.longitude}`,
      'service': 'POL'
    }
    let headers = { 'Content-Type': 'Application/Json'/*, 'Authorization': token */ }
    axios.post(cobertura, data, headers)
      .then(res => {
        dispatch({ type: 'LOADING', payload: false })
        setAlert({ display: true, type: 'success', title: 'Aviso registrado!', customMessage: 'Te notificaremos cuando tu banco incluya el servicio' })
      })
      .catch(err => {
        dispatch({ type: 'LOADING', payload: false })
        setAlert({ display: true, type: 'danger', title: 'No pudimos registrar su pedido', customMessage: 'Ocurrió un error inesperado. Intentelo más tarde.' })
      })
  }

  return (
    <div className="polWelcomeWrapper">
      {front.loading && <Loading />}
      {alert.display && <Alert alertType={alert.type} titleMessage={alert.title} customMessage={alert.customMessage} customAction={() => setAlert({ display: false })} />}
      <div className='polWelcome'>
        <div className='polWelcome__info' onClick={() => setBack(!back)}>
          <FontAwesomeIcon icon={faInfoCircle} className='tag-icon' />
        </div>
        {back ?
          <div className='polWelcome__container'>
            <p className='polWelcome__container--textBack'>
              Este servicio va dirigido a los jubilados y permite realizar
              la Fe de Vida de una manera digital a traves del celular.
              Estamos trabajando para realizar acuerdos con las entidades
              bancarias para facilitar este tramite a personas mayores.
            </p>
            <button className="btn btn-blue-lg text-center" onClick={() => warnUser()}>¿Le gustaria que su banco tuviera este servicio?</button>
          </div>
          :
          <div className='polWelcome__container'>
            <div className='polWelcome__container'>
              <img src={pol} alt='polWelcome__container--img' />
            </div>
            <p className='polWelcome__container--text p-5'>
              Realiza la Fe de vida sin moverte de casa
            </p>
          </div>
        }
      </div>
      <FooterBtn
        mode='single'
        text='Volver'
        callback={() => props.history.push('/')}
      />
    </div>
  )
}


export default withRouter(PolWelcome);