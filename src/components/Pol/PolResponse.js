import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FooterBtn from '../GeneralComponents/FooterBtn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { searchActiveProviders } from '../../store/actions/firebaseQueries';
import StarRatings from 'react-star-ratings';
import { getFreeAppointments } from '../../store/actions/getAssignations';
import setAppointment from '../Utils/setAppointment';
import Loading from '../GeneralComponents/Loading';
import '../../styles/pol/Pol.scss';

export const PolProofSuccess = (props) => {
  const [ratingApp, setRatingApp] = useState(0)
  return (
    <div className='polResponseContainer'>
      <div className='polResponseContainer__container'>
        <FontAwesomeIcon
          className='polResponseContainer__container--icon success'
          icon={faCheckCircle}
        />
      </div>
      <div className='polResponseContainer__container'>
        <h4 className='polResponseContainer__container--title success'>
          {props.polRegister ?
            'Registro realizado'
            :
            'La prueba de vida se ha realizado con éxito!'
          }
        </h4>
      </div>
      {/* En caso de no ser el registro */}
      {!props.polRegister &&
        <div className='polResponseContainer__container'>
          <div className='ratings-container'>
            <label>¿Cómo evaluaría la experiencia?</label>
            <StarRatings
              rating={ratingApp}
              changeRating={setRatingApp}
              numberOfStars={5}
              name='rating'
              starDimension='35px'
              starRatedColor='#42A5F6'
              starHoverColor='#0071F2'
            />
          </div>
        </div>
      }
      <FooterBtn
        mode='single'
        text='inicio'
        callback={() => props.goHome()}
      />
    </div>
  )
}

export const PolErrorRegister = (props) => {
  return (
    <div className='polResponseContainer'>
      <div className='polResponseContainer__container'>
        <FontAwesomeIcon
          className='polResponseContainer__container--icon warning'
          icon={faTimesCircle}
        />
      </div>
      <div className='polResponseContainer__container'>
        <h4 className='polResponseContainer__container--title warning'>
          {props.polRegister ?
            'Registro Fallido'
            :
            'No se ha podido efectuar la comprobación'
          }
        </h4>
      </div>
      {/* 
          <div className='polResponseContainer__container'>
              <div className='polResponseContainer__container--text'>
                  Algunos consejos para volver a intentarlo:
                  <ul>
                      <li>No deje de realizar el movimiento indicado hasta llegar al 100% de la prueba</li>
                      <li>No realice movimientos bruscos</li>
                      <li>Realice la prueba en un lugar con buena iluminación</li>
                      <li>Coloque el celular en posición vertical y lo más frontal posible hacia su cara</li>
                      <li>Verifique que funcione su conexión a internet</li>
                      <li>Lea detenidamente las instrucciones</li>
                  </ul>
              </div>
          </div> 
      */}
      <div className='polResponseContainer__container'>
        <button
          className='polResponseContainer__container--retry'
          onClick={() => props.goToStep()}
        >
          <b>Volver a intentarlo</b>
        </button>
      </div>
      <FooterBtn
        mode='single'
        text='inicio'
        callback={() => props.goHome()}
      />
    </div>
  )
}

const Denied = (props) => {
  const user = useSelector(state => state.queries.patient)
  const coords = useSelector(state => state.queries.geolocation)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  // const user = useSelector(state => state.queries.patient);
  // const selectedAppointment = useSelector(state => state.assignations.selectedAppointment)
  async function setPolAppointment() {
    try {
      setLoading(true)
      // const availableDocs = await searchActiveProviders("online")
      //   .then(function (doctors) { return doctors })
      //   .catch(function (error) { return error })
      // const assigns = await getAssignationsFirebase('online_clinica_medica', availableDocs)
      //   .then(function (assignations) {
      //     dispatch({ type: 'GET_ASSIGNS', payload: assignations })
      //     return assignations
      //   })
      //   .catch(function (error) { throw error })
      // const firstAppoint = await getFirstAppointAvailable(assigns, user.dni)
      //   .then(function (firstApp) {
      //     dispatch({ type: "SET_FIRST_APPOINTMENT", payload: firstApp })
      //     return firstApp
      //   })
      //   .catch(function (error) { throw error })
      // const result = await setAppointment(user, firstAppoint, 'Fe de vida', coords)
      //   .then(function (response) { return response })
      //   .catch(function (error) { throw error })
      // setLoading(false)
      props.history.replace(`/${user.dni}/onlinedoctor/queue`)
    } catch (error) {
      setLoading(false)
      console.log(error)
      props.history.replace(`/${user.dni}`)
    }
  }

  return (
    <>
      {loading ?
        <Loading />
        :
        <div className='polResponseContainer'>
          <div className='polResponseContainer__container'>
            <FontAwesomeIcon
              className='polResponseContainer__container--icon warning'
              icon={faTimesCircle}
            />
          </div>
          <div className='polResponseContainer__container'>
            <h4 className='polResponseContainer__container--title warning'>
              {props.polRegister ?
                'Registro Denegado'
                :
                'No se ha podido efectuar la comprobación'
              }
            </h4>
          </div>
          {props.polRegister &&
            <div className='polResponseContainer__container'>
              <p className='polResponseContainer__container--text'>
                Diríjase a su Banco y realice su Fe de Vida por los medios tradicionales.
                  </p>
            </div>
          }
          {!props.polRegister &&
            <div className='polResponseContainer__container'>
              <button
                className='polResponseContainer__container--retry'
                onClick={() => setPolAppointment()}
              >
                Doctor en línea
              </button>
            </div>
          }
          <FooterBtn
            mode='single'
            text='inicio'
            callback={() => props.goHome()}
          />
        </div>
      }
    </>
  )
}
export const PolDeniedRegister = withRouter(Denied);