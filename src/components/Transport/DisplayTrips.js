
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Axios from 'axios';
import MobileModal from '../GeneralComponents/Modal/MobileModal';
import Alert from '../GeneralComponents/Alert/Alerts';
import Backbutton from '../GeneralComponents/Backbutton';
import FooterBtn from '../GeneralComponents/FooterBtn';

import '../../styles/generalcomponents/TransportUserActive.scss';
import Cab from '../../assets/icons/taxi.png';

const TransportUserActive = (props) => {
  const toogleModal = useSelector((state) => state.front.openDetails);
  const getCancelComment = useSelector((state) => state.userActive.cancelTripComments);
  const [displayAlert, setDisplayAlert] = useState(false);
  const [displayLoading, setDisplayLoading] = useState(false);
  const [tripId, setTripId] = useState('');
  const [openTravel, setOpenTravel] = useState('');
  const [getInitialData, setInitialData] = useState([]);
  const dispatch = useDispatch();
  const getUserData = localStorage.getItem('userData');
  const userDataToJson = JSON.parse(getUserData);
  const token = useSelector(state => state.userActive.token)


  useEffect(() => {
    initialServiceCall()
  }, [])

  function initialServiceCall() {
    dispatch({ type: 'LOADING', payload: true })
    Axios.post('https://uma-v2.appspot.com/att_history', {
      'ws': userDataToJson.ws,
      'dni': userDataToJson.dni
    }, { headers: { 'Content-Type': 'application/json;charset=UTF-8'/* , 'Authorization': token */ } })
      .then(function (response) {
        var data = JSON.parse(response.data);
        setInitialData(data);
        console.log(data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function cancelTrip() {
    const date = tripId.item[2];
    const assignation = tripId.item[0];
    setDisplayLoading(true);
    Axios.post('https://uma-v2.appspot.com/cancel_tramo', {
      'dni': userDataToJson.dni,
      'fecha_viaje': date,
      'dt': '',
      'assignation_id': assignation,
      'motivo': getCancelComment
    }, { headers: { 'Content-Type': 'application/json;charset=UTF-8'/* , 'Authorization': token  */} })
      .then(function (response) {
        setDisplayAlert(true)
        setDisplayLoading(true)
        setTimeout(function () {
          setDisplayAlert(false)
        }, 14000)
        initialServiceCall()
        dispatch({ type: 'TOGGLE_DETAIL' })
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function displayModal(tripValue) {
    setTripId(tripValue);
    dispatch({ type: 'TOGGLE_DETAIL' })
  }

  return (
    <div className="transportList">
      {displayAlert &&
        <Alert alertType="success" titleMessage="Notificación" customMessage="El viaje ha sido cancelado"></Alert>
      }
      {toogleModal &&
        <MobileModal title="Cancelar viaje">
          <textarea
            className="form-control comments"
            placeholder="Ingrese el motivo de cancelación"
            onChange={(e) => dispatch({ type: 'CANCEL_TRIP_COMMENTS', payload: e.target.value })}
          >
          </textarea>
          <div className="buttonContainer">
            <button
              className="btn btn-active cancelReason"
              disabled={getCancelComment === '' ? true : false}
              onClick={() => cancelTrip()}>
              {displayLoading &&
                <div className="loading spinner-border text-primary" role="initial">
                  <span className="sr-only">Loading...</span>
                </div>
              }
              Cancelar viaje
            </button>
          </div>
        </MobileModal>
      }
      {(getInitialData.length > 0) ?
        <div>
          <Backbutton />
          <ul>
            {getInitialData.map((item, index) => {
              return <li key={index}>
                {item[1] === 'PREASSIGN' || item[1] === 'ASSIGN' ?
                  <div>
                    <div className="titleContainer d-flex">
                      <div className="transportTitle">
                        <div>{item[2]} - {item[3]} hs.</div>
                        <div><span>Conductor:</span></div>
                        <div>{item[5]}</div>
                      </div>
                      <div className="openContent">
                        {openTravel === index ?
                          <button onClick={() => setOpenTravel('')}>-</button>
                          :
                          <button onClick={() => setOpenTravel(index)}>+</button>
                        }
                      </div>
                    </div>
                    {openTravel === index &&
                      <div className="contentContainer">
                        <div className="origin"><span>Origen:</span> {item[6]}</div>
                        <div className="destiny"><span>Destino:</span> {item[7]}</div>
                        <button className="btn btn-active" onClick={() => displayModal({ item })}>Cancelar Viaje</button>
                      </div>
                    }
                  </div>
                  : ''}
              </li>
            })}
          </ul>
        </div>
        :
        <div className="noTransfers">
          <div className="noTransfers__container">
            <img src={Cab} alt="cab image"/>
          </div>
          <div className="noTransfers__container">
            <h3 className="trasladoTitle">Traslados</h3>
            <h4 className="noTransfers__container--title">
              Actualmente no tiene ningún traslado solicitado.
            </h4>
          </div>
          <FooterBtn
            text='Volver'
            callback={() => props.history.push(`/`)}
          />
        </div>
      }
    </div>
  )
}

export default withRouter(TransportUserActive);
