import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import Camera, { FACING_MODES } from 'react-html5-camera-photo';
import Camera from '../GeneralComponents/Camera';
import { Link, withRouter } from 'react-router-dom';

import Axios from 'axios';
import b64ToBlob from '../Utils/base64ToBlob';
import Loading from '../GeneralComponents/Loading';
import { putFileFB } from '../Utils/firebaseUtils';
import moment from 'moment';
import { pol_dni_back, pol_dni_front, pol_selfie } from '../../config/endpoints';
import 'moment-timezone';
import 'react-html5-camera-photo/build/css/index.css';

const PolRegisterDni = ({ goToStep }) => {
    const [docSide, setDoc] = useState('FRENTE')
    const token = useSelector(state => state.userActive.token)
    const [loading, setloading] = useState(false)
    const patient = useSelector(state => state.queries.patient)
    const dt = moment().tz('America/Argentina/Buenos_Aires').format('YYYYMMDDHHmmss')
    const { attempts } = useSelector(state => state.queries)
    const dispatch = useDispatch()

    async function handleDniFront(dniData) {
        setloading(true)
        const image = await b64ToBlob(dniData)
        const fileName = `${patient.dni}/dniImages/${dt}_dniFront`
        const dniImgUrl = await putFileFB(image, fileName)
        const url = pol_dni_front
        const data = {
            ws: patient.ws,
            dni: patient.dni,
            dt: dt,
            sex: patient.sex,
            url_dni: dniImgUrl
        }
        Axios.post(url, data, { 'content': 'application/json'/*, 'Authorization': token */ })
            .then(function (r) {
                setDoc('DORSO')
                setloading(false)
            })
            .catch(function (e) {
                alert('Error al subir imagen!')
                setloading(false)
            })
    }

    async function handleDniBack(dniData) {
        setloading(true)
        const image = await b64ToBlob(dniData)
        const fileName = `${patient.dni}/dniImages/${dt}_dniBack`
        const dniImgUrl = await putFileFB(image, fileName)
        const url = pol_dni_back
        const data = {
            ws: patient.ws,
            dni: patient.dni,
            dt: dt,
            sex: patient.sex,
            url_dni: dniImgUrl
        }
        Axios.post(url, data, { 'content': 'application/json'/*, 'Authorization': token */ })
            .then(function (r) {
                setDoc('SELFIE')
                setloading(false)
            })
            .catch(function (e) {
                alert('Error al subir imagen!')
                setloading(false)
            })
    }

    async function handleSelfie(selfieImg) {
        setloading(true)
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
        await Axios.post(pol_selfie, data, headers)
            .then(function (r) {
                setloading(false)
                goToStep('success')
            })
            .catch(function (e) {
                setloading(false)
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
                    {(docSide === 'FRENTE' || docSide === 'DORSO') ?
                        <div className='container_asd'>
                            <Camera
                                facingMode='environment'
                                onTakePhoto={(data) => {
                                    if (docSide === 'FRENTE') {
                                        handleDniFront(data)
                                    } else {
                                        handleDniBack(data)
                                    }
                                }}
                            />
                        </div>
                        :
                        <Camera
                            facingMode='user'
                            onTakePhoto={(data) => {
                                handleSelfie(data)
                            }}
                        />
                    }
                </>
            }
        </>
    )
}

export default withRouter(PolRegisterDni)