/* eslint-disable no-loop-func */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Camera, { FACING_MODES } from 'react-html5-camera-photo';
import { Link, withRouter } from 'react-router-dom';
import moment from 'moment-timezone';
import Axios from 'axios';
import Loading from '../GeneralComponents/Loading';
import b64ToBlob from '../Utils/base64ToBlob';
import { putFileFB } from '../Utils/firebaseUtils';
import { pol_selfie } from '../../config/endpoints';

import 'react-html5-camera-photo/build/css/index.css';

const PolRegisterDni = ({ goToStep }) => {
  const dispatch = useDispatch()
  const token = useSelector(state => state.userActive.token)
  const [loading, setLoading] = useState(false)
  const { attempts } = useSelector(state => state.queries)
  const patient = useSelector(state => state.queries.patient)
  const dt = moment().tz('America/Argentina/Buenos_Aires').format('YYYYMMDDHHmmss')

  async function postSelfie(selfieImg) {
    setLoading(true)
    const fileName = `${patient.dni}/dniImages/${dt}_selfie`
    const image = await b64ToBlob(selfieImg)
    const selfieURL = await putFileFB(image, fileName)
    const data = {
      ws: patient.ws,
      dni: patient.dni,
      dt: dt,
      sex: patient.sex,
      url_selfie: selfieURL,
      selfie0: 'ok'
    }
    let headers = { 'Content-Type': 'Application/Json'/*, 'Authorization': token */ }
    await Axios.post(pol_selfie, JSON.stringify(data), headers)
      .then(function (r) {
        setLoading(false)
        goToStep('success')
      })
      .catch(function (e) {
        setLoading(false)
        if (attempts === 1) {
          dispatch({ type: 'POL_ATTEMPTS_COUNT', payload: 2 })
          goToStep('failure')
        } else {
          dispatch({ type: 'POL_ATTEMPTS_COUNT', payload: 1 })
          goToStep('denied')
        }
      })
  }



  return (
    <>
      {loading ?
        <Loading />
        :
        <>
          <div className='selfie-framework'>
            <div className='selfie-camera'>
              <Camera
                idealFacingMode={FACING_MODES.USER}
              />
            </div>
          </div>
          <div className='selfie-instruction'>
            <span>
              Por último, tome una foto de su rostro.
            </span>
          </div>
          <Camera
            onTakePhoto={function (data) { postSelfie(data) }}
            idealFacingMode={FACING_MODES.USER}
            isFullscreen={true}
          />
        </>
      }
    </>
  )
}

export default withRouter(PolRegisterDni)