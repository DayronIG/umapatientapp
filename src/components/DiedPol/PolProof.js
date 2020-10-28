import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import Axios from 'axios';
import DBConnection from '../../config/DBConnection';
import classnames from 'classnames';
import Loading from '../GeneralComponents/Loading';
import PolInstructions from './PolInstructions';
import { PolDeniedRegister, PolErrorRegister, PolProofSuccess } from './PolResponse';
import '../../styles/pol/Pol.scss'
import FooterBtn from '../GeneralComponents/FooterBtn';


const PolProof = (props) => {
    const videoRef = useRef()
    const dispatch = useDispatch()
    const token = useSelector(state => state.userActive.token)
    const pol = useSelector(state => state.pol)
    const patient = useSelector(state => state.queries.patient)
    const [currentStep, setCurrentStep] = useState('foto')
    const [currentBuffer, setCurrentBuffer] = useState(0)
    const [currentPainting, setCurrentPainting] = useState(0)
    const [actionButton, setActionButton] = useState('Comenzar')
    const [progressBar, setProgressBar] = useState(0)
    const [head, setHead] = useState('')
    const [instructions, setInstructions] = useState()
    const [mediaStream, setMediaStream] = useState()
    // const [scanning, setScanning] = useState(false)
    // const [startValue, setStartValue] = useState('Waiting')
    let tries = 0

    const gumSuccess = (stream) => {
        videoRef.current.srcObject = stream
        videoRef.play()
    }

    const gumFail = (err) => {
        console.log('No se pudo reconocer tu cámara. Asegurece de permitir que le aplicación tenga acceso.', err)
    }

    const streamImages = () => {
        // Clean recorded array and change button text
        // setStartValue('Streaming')
        setActionButton('Escaneando')
        setInstructions('Lea las instrucciones')
        bufferHandler()
        var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        console.log('[POL] is iOS:', iOS)
    }

    const getImage = () => {
        let overlay = document.getElementById('overlay')
        overlay.getContext('2d').drawImage(videoRef.current, 0, 0)
        var img = document.querySelector('#captureimg')
        img.src = overlay.toDataURL('image/jpeg', 0.6)
        return overlay.toDataURL('image/jpeg', 0.6)
    }

    const bufferHandler = () => {
        let i = 1;
        let bufferFirst = '', bufferSecond = '', bufferThird = '', bufferFourth = ''
        setInstructions('')
        setActionButton('Escaneando... 0%')
        let prevPaint = currentPainting
        if (i === 0) {
            let painting = setInterval(() => {
                currentPainting === 5 ? clearInterval(painting) : setCurrentPainting(prevPaint + 1)
            }, 4000)
        }
        let buffering = setInterval(() => {
            i++
            console.log('[POL] Capture #', i, ' painting #', currentPainting)
            if (i <= 15) {
                bufferFirst = bufferFirst.concat('imagestart;', getImage())
                setActionButton('Escaneando... 10%')
                setProgressBar(10)
            } else if (i > 15 && i <= 30) {
                if (i === 16) {
                    dispatch({ type: 'POL_SET_BUFFER_FIRST', payload: bufferFirst })
                    videoPost(1, bufferFirst)
                    setCurrentBuffer(2)
                    setActionButton('Escaneando... 25%')
                    setProgressBar(25)
                }
                bufferSecond = bufferSecond.concat('imagestart;', getImage())
            } else if (i > 30 && i <= 45) {
                if (i === 31) {
                    dispatch({ type: 'POL_SET_BUFFER_SECOND', payload: bufferSecond })
                    videoPost(2, bufferSecond)
                    setCurrentBuffer(3)
                    setActionButton('Escaneando... 50%')
                    setProgressBar(50)
                }
                bufferThird = bufferThird.concat('imagestart;', getImage())
            } else if (i > 45 && i <= 60) {
                if (i === 46) {
                    dispatch({ type: 'POL_SET_BUFFER_THIRD', payload: bufferThird })
                    videoPost(3, bufferThird)
                    setCurrentBuffer(4)
                    setActionButton('Escaneando... 75%')
                    setProgressBar(75)
                }
                bufferFourth = bufferFourth.concat('imagestart;', getImage())
            } else if (i > 60 && i <= 75) {
                if (i === 61) {
                    dispatch({ type: 'POL_SET_BUFFER_FOURTH', payload: bufferFourth })
                    videoPost(4, bufferFourth)
                    setActionButton('Escaneando... 100%')
                    setProgressBar(100)
                }
            } else {
                if (i > 75) {
                    // setCounter(75)
                    setActionButton('Procesando, espere...')
                    setTimeout(() => {
                        // setRetryMsg(true)
                        console.log('[POL][BufferHandler] Timeout')
                    }, 10000)
                    clearInterval(buffering)
                }
            }
        }, 200)
    }

    const videoPost = (step, data) => {
        const currentDate = dateConstructor()
        let currentData = {
            'ws': props.match.params.ws,
            'b64': data,
            'dni': patient.dni,
            'dt_ws': currentDate,
            'currentbuffer': step,
            'type_service': 'pol_selfie',
            'selfie0': 'no'
        }
        const url = 'https://stream-dot-uma-v2.appspot.com/stream_selfie'
        const headers = { 'Content-type': 'application/json'/*, 'Authorization': token */ }
        var start = Date.now()


        Axios.post(url, currentData, { headers })
            .then(function (res) {
                console.log("EN EL SUCCESS")
                console.log("LA RES", res)
                console.log(" los tries ", tries)
                if (!res.data) {
                    tries = tries + 1
                }
                setCurrentBuffer(currentBuffer + 1)
                let millis = Date.now() - start + 1
                console.log('[POL] Respuesta en ' + millis + ' milisegundos ', 'Current buffer is: ', currentBuffer)
                if (step === 4 && tries < 2) setCurrentStep('success')
                if (step === 4 && tries >= 2) setCurrentStep('failure')
            })
            .catch(function (err) {
                let millis = Date.now() - start + 1
                console.log('[POL] Respuesta en ' + millis + ' milisegundos')
                setCurrentBuffer(currentBuffer + 1)
                if (step === 4 && countRetry !== '2') setCurrentStep('denied')
                else if (step === 4) setCurrentStep('failure')
            })
    }

    const startRetry = () => {
        console.log('[POL] Start Retry: ', countRetry)
        if (countRetry === '0') {
            countRetry('1')
            setCurrentStep('foto')
        } else if (countRetry === '1') {
            countRetry('2')
            setCurrentStep('foto')
        } else if (countRetry === '2') {
            countRetry('3')
            setCurrentStep('denied')
        }
    }

    const countRetry = (argRetry) => {
        // setRetry(argRetry)
        // setRetry(true)
        const currentDate = dateConstructor()
        const url = 'https://stream-dot-uma-v2.appspot.com/pol_selfie'
        const headers = { 'Content-type': 'application/json'/*, 'Authorization': token */ }
        let data = {
            'ws': props.match.params.ws,
            'dni': patient.dni,
            'fixed_dt': '',
            'signed_selfie': '',
            'signed_selfie_embedding': argRetry.toString(), // 1, 2 y 3
            'lat': '',
            'lon': '',
            'date': currentDate,
            'selfie0': 'no'
        }
        console.log('[POL] CR Data: ', data)
        Axios.post(url, data, { headers })
            .then(function (res) {
                setCurrentStep('foto')
            })
            .catch(function (err) {
                setCurrentStep('denied')
            })
    }

    const dateConstructor = () => {
        let d = new Date()
        let currentMonth = ('0' + (d.getMonth() + 1)).substr(-2)
        let currentDay = ('0' + d.getDate()).substr(-2)
        let currentHours = ('0' + (d.getHours())).substr(-2)
        let currentMinutes = ('0' + d.getMinutes()).substr(-2)
        let currentSeconds = ('0' + d.getSeconds()).substr(-2)
        const currentDate = [d.getFullYear(), currentMonth, currentDay].join('-') + ' ' +
            [currentHours, currentMinutes, currentSeconds].join(':');
        return currentDate
    }

    useState(() => {
        let firestore = DBConnection.firestore()
        try {
            firestore.collection('auth')
                .where('ws', '==', props.match.params.ws)
                .onSnapshot((res) =>
                    res.forEach((content) => {
                        // setCurrentStep(content.data()._foto)
                        setCurrentStep('foto')
                        console.log('[POL] Selfie index: ', content.data()._foto)
                        if (content.data()._foto === 'foto') {
                            setActionButton('Completado')
                            setInstructions('')
                        }
                    }))
        } catch (err) {
            console.log(err)
        }
    }, [])

    // Get Video and print it to video canvas
    useEffect(() => {
        async function enableStream() {
            try {
                let constraints = {
                    audio: false,
                    video: { facingMode: "user" }
                }
                // check for camerasupport & capture
                navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
                window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL
                if (navigator.mediaDevices) {
                    const stream = await navigator.mediaDevices.getUserMedia(constraints)
                        .then(st => {
                            videoRef.current.srcObject = st
                            videoRef.current.play()
                            console.log('VIDEO REF', videoRef.current, st)
                        })
                        .catch(gumFail)
                    setMediaStream(stream)
                } else if (navigator.getUserMedia) {
                    navigator.getUserMedia(constraints, gumSuccess, gumFail)
                } else {
                }
            } catch (err) {
                alert('No se pudo abrir su cámara')
            }
        }
        if (!mediaStream) {
            enableStream();
        }
        else {
            return function cleanup() {
                mediaStream.getTracks().forEach(track => {
                    track.stop();
                });
            }
        }
    }, [mediaStream]);

    return (
        <div className='pol-proof-container'>
            {pol.showInstructions && <PolInstructions />}
            <div id='capture'>
                {(currentPainting >= 4 && currentStep === 'loading') &&
                    <div className='loaderWrapper'>
                        <Loading />
                        <div className='loadingText'>Validando...</div>
                    </div>
                }

                {/* Si se valida la fe de vida */}
                {currentStep === 'success' &&
                    <div className='pol-failure'>
                        <PolProofSuccess
                            polRegister={false}
                            goHome={() => props.history.replace('/')}
                        />
                    </div>
                }

                {/* Si NO se valida la fe de vida */}
                {currentStep === 'failure' &&
                    <div className='pol-failure'>
                        <PolErrorRegister
                            polRegister={false}
                            goToStep={() => startRetry()}
                            goHome={() => props.history.replace('/')}
                        />
                    </div>
                }
                {/* Si fallaron 2 intentos */}
                {currentStep === 'denied' &&
                    <div className='pol-denied'>
                        <PolDeniedRegister
                            polRegister={false}
                            goHome={() => props.history.replace('/')}
                            propsFromParent={props}
                        />
                    </div>
                }
                {currentStep === 'foto' &&
                    <>
                        <div className={classnames('circle-window',
                            (currentPainting === 1 ? 'first' : '') ||
                            (currentPainting === 2 ? 'second' : '') ||
                            (currentPainting === 3 ? 'third' : '') ||
                            (currentPainting >= 4 ? 'fourth' : '')
                            // (currentStep === 'foto' ? 'finished' : '')
                            // (startValue === 'finish' ? 'fourth' : '')
                        )}>
                            <div className='content-dotted'>
                                {(setHead === 'instructions' && instructions !== '') &&
                                    <div className='counter'>
                                        <span className='instructions'>
                                            {instructions}
                                        </span>
                                    </div>
                                }
                            </div>
                        </div>
                        <video ref={videoRef} id='video' width='1280' height='720' preload='auto' loop playsInline autoPlay></video>
                        <img src='' className='imgRender' id='captureimg' width='1280' height='720' alt='' />
                        <canvas id='overlay' width='1280' height='720'></canvas>
                        {(currentStep === 'foto' && !pol.showInstructions) &&
                            <div className="progress-container">
                                <div className={`prog-${progressBar}`} />
                            </div>
                        }
                    </>
                }
            </div>
            {/* 
          {currentStep === 'foto' &&
              <div className='pol-action-container'>
                  {props.ignoreInstructions ? '' :
                      <div className='sub-header'>
                          <strong>Instrucciones:</strong>
                          Coloque su rostro en el círculo y mueva la cabeza afirmativamente (hacia arriba y abajo repetitivamente hasta que se complete la validación)
                      </div>
                  }
              </div>
          } 
      */}
            {(currentStep === 'foto' && !pol.showInstructions && currentBuffer === 0) ?
                <FooterBtn
                    mode='single'
                    text={actionButton}
                    callback={() => streamImages()}
                />
                : (currentStep === 'foto' && !pol.showInstructions) &&
                <FooterBtn
                    mode='single'
                    text={actionButton}
                    callback={() => streamImages()}
                    color='footer-disabled'
                />
            }
        </div>
    )
}

export default withRouter(PolProof)

