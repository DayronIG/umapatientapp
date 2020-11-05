import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Camera, { FACING_MODES } from 'react-html5-camera-photo';
import { withRouter } from 'react-router-dom'
import Axios from 'axios';
import b64ToBlob from '../Utils/base64ToBlob';
import Loading from '../GeneralComponents/Loading';
import { putFileFB } from '../Utils/firebaseUtils';
import moment from 'moment-timezone';
import { pol_dni_back, pol_dni_front } from '../../config/endpoints';
import 'react-html5-camera-photo/build/css/index.css';

const PolRegisterDni = ({ goToStep }) => {
  const [docSide, setDocName] = useState('FRENTE')
  const [loading, setloading] = useState(false)
  const patient = useSelector(state => state.queries.patient)
  const token = useSelector(state => state.userActive.token)
  const dt = moment().tz('America/Argentina/Buenos_Aires').format('YYYYMMDDHHmmss')

  const handleDni = async (dniData) => {
    setloading(true)
    let fileName = "", dniImgUrl = "", url = "";
    const image = await b64ToBlob(dniData)
    if (docSide === 'FRENTE') {
      fileName = `${patient.dni}/dniImages/${dt}_dniFront`
      dniImgUrl = await putFileFB(image, fileName)
      url = pol_dni_front
    }
    else {
      fileName = `${patient.dni}/dniImages/${dt}_dniBack`
      dniImgUrl = await putFileFB(image, fileName)
      url = pol_dni_back
    }
    const data = {
      ws: patient.ws,
      dni: patient.dni,
      dt: dt,
      sex: patient.sex,
      url_dni: dniImgUrl
    }
    Axios.post(url, data, { 'content': 'application/json'/* , 'Authorization': token */})
      .then(function (r) {
        setloading(false)
        if (docSide === 'DORSO') goToStep()
        else if (docSide === 'FRENTE') setDocName('DORSO')
      })
      .catch(function (e) {
        alert('Error al subir imagen!')
        setloading(false)
      })
  }

  return (
    <>
      {loading ?
        <Loading />
        :
        <>
          <div className='dni-framework'>
            <div className='dni-camera'>
              <Camera
                idealFacingMode={FACING_MODES.ENVIRONMENT}
                isImageMirror={false}
              />
            </div>
          </div>
          <div className='dni-instruction'>
            <span>
              {docSide === "FRENTE" ?
                'Ubica el FRENTE del DNI en el recuadro.'
                : docSide === 'DORSO' &&
                'Tome una foto del DORSO del DNI.'
              }
            </span>
          </div>
          <Camera
            onTakePhoto={function (dataUri) { handleDni(dataUri) }}
            isFullscreen={true}
            idealFacingMode={FACING_MODES.ENVIRONMENT}
            isImageMirror={false}
          />
        </>
      }
    </>
  )
}

export default withRouter(PolRegisterDni)