/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { user_cancel, cx_action_create } from '../../../config/endpoints';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneAlt } from '@fortawesome/free-solid-svg-icons';
import { FaArrowLeft } from 'react-icons/fa';
import { Link, withRouter, useHistory } from 'react-router-dom';
import { calcReaminingHrsMins } from '../../Utils/dateUtils';
import { getDocumentFB } from '../../Utils/firebaseUtils';
import { getAppointmentByDni } from '../../../store/actions/firebaseQueries';
import { findAllAssignedAppointment } from '../../Utils/appointmentsUtils';
import swal from 'sweetalert';
import axios from 'axios';
import { BackButton } from '../../GeneralComponents/Headers';
import QueueActions from './QueueActions';
import MobileModal from '../../GeneralComponents/Modal/MobileModal';
import SendComplain from './SendComplain';
import DoctorDelay from './DoctorDelay';
import AnswerComplain from '../../CX';
import DBConnection from '../../../config/DBConnection';
import Slider from './Slider';
import Loading from '../../GeneralComponents/Loading';
import tone from '../../../assets/ring.mp3';
import moment from 'moment-timezone';
import 'moment/locale/es';

const Queue = (props) => {
    const firestore = DBConnection.firestore();
    const dispatch = useDispatch();
    const token = useSelector(state => state.userActive.token)
    const [assignation, setAssignation] = useState('')
    const [calling, setCalling] = useState(false)
    const [showModalCancelOptions, setShowModalCancelOptions] = useState(false);
    const [cancelOptions, setCancelOptions] = useState('')
    const [cancelDescription, setCancelDescription] = useState('');
    const [responseAction, setResponseAction] = useState({ response: '', action: '' })
    const { openDetails, modalAction, remainingText, loading } = useSelector(state => state.front)
    const assessment = useSelector(state => state.assessment)
    const [dni] = useState(props.match.params.dni)
    const { questions, appointments: appointment, callSettings, assignedAppointment } = useSelector(state => state.queries)
    const patient = useSelector(state => state.user)
    const mr = useSelector(state => state.queries.medicalRecord[0])
    const history = useHistory()

    useEffect(() => {
        (async function checkAssignedAppointment() {
            if (Object.keys(assignedAppointment).length === 0) {
                dispatch({ type: 'LOADING', payload: true })
                const user = await getDocumentFB(`users/${dni}`)
                const type = (moment().diff(user?.dob, 'years') <= 16) ? 'pediatria' : ''
                const assigned = await findAllAssignedAppointment(dni, type)
                dispatch({ type: 'LOADING', payload: false })
                if (assigned) {
                    dispatch({ type: 'SET_ASSIGNED_APPOINTMENT', payload: assigned })
                } else {
                    return history.replace(`/home`)
                }
            }
        })()
    }, [])

    useEffect(() => {
        (async function () {
            if (!!assignedAppointment && 'time' in assignedAppointment) {
                try {
                    const res = await getDocumentFB(assignedAppointment.path)
                    setAssignation(res.appointments['0']['14'])
                } catch (error) {
                    console.log(error)
                }
            }
        })()
    }, [assignedAppointment])

    useEffect(() => {
        if (dni && assignation) {
            firestore.doc(`events/mr/${dni}/${assignation}`)
                .onSnapshot(res => {
                    if (mr && mr !== undefined) {
                        let mr = res.data() && res.data().mr
                        if (mr.destino_final === 'Paciente ausente' || mr.destino_final === 'Anula por falla de conexión') {
                            swal(`El médico cerró tu atencion.`, `Motivo: ${mr.destino_final}. Puedes tomar una nueva consulta.`, 'warning')
                            dispatch({ type: 'RESET_ALL' })
                        }
                    }
                })
        }
    }, [assignation, mr])

    const calculateRemainingTime = (assgnAppnt) => {
        let now = moment(new Date()).format('HHmm')
        let next = ''
        let remainingTime = 0
        const today = moment(new Date()).tz('America/Argentina/Buenos_Aires').format('YYYY-MM-DD')
        if (!!assgnAppnt && assgnAppnt.time && assgnAppnt.cuil !== 'bag') {
            next = assgnAppnt.time.replace(/:/g, '')
            next = parseInt(next.slice(0, 2) * 60) + parseInt(next.slice(2, 4))
            now = parseInt(now.slice(0, 2) * 60) + parseInt(now.slice(2, 4))
            remainingTime = next - now
            let text = ''
            if (remainingTime > 0 && assgnAppnt.date === today) {
                if (remainingTime < 60) {
                    text = `Será atendido en ${remainingTime} minutos`
                } else {
                    try {
                        const calcTime = calcReaminingHrsMins(remainingTime)
                        if (calcTime.reaminingMinutes > 0) {
                            text = `Será atendido en ${calcTime.remainingHours} horas y ${calcTime.reaminingMinutes} minutos.`
                        } else {
                            text = `Será atendido en ${calcTime.remainingHours} horas.`
                        }
                    } catch (error) {
                        // console.error(error)
                        text = 'En breve será atendido.'
                    }
                }
                dispatch({ type: 'REMAINING_ATT_TIME', payload: text })
            } else if (assgnAppnt.date === today) {
                dispatch({ type: 'REMAINING_ATT_TIME', payload: 'En breve será atendido.' })
            } else {
                const hoursToMidNight = (1440 - now)
                const fromMidNightToAtt = next
                const totalTimeToNext = hoursToMidNight + fromMidNightToAtt
                const hoursToNext = totalTimeToNext / 60
                const calcTime = calcReaminingHrsMins(totalTimeToNext)
                if (assgnAppnt.date !== today && hoursToNext < 22) {
                    text = `Será atendido en ${calcTime.remainingHours} horas y ${calcTime.reaminingMinutes} minutos.`
                } else {
                    text = 'Será atendido en aproxidamente 1 día.'
                }
                dispatch({ type: 'REMAINING_ATT_TIME', payload: text })
            }
        } else {
            dispatch({
                type: 'REMAINING_ATT_TIME',
                payload: 'Seras atendido por el proximo medico disponible.'
            })
        }
        dispatch({ type: 'SHOW_ASK_TEXT', payload: false })
    }

    useEffect(() => {
        if (!!assignedAppointment && Object.keys(assignedAppointment).length > 0) {
            calculateRemainingTime(assignedAppointment)
        }
        const interval = setInterval(() => {
            calculateRemainingTime(assignedAppointment)
        }, 10000)
        return () => {
            clearInterval(interval)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assignedAppointment])

    useEffect(() => {
        try {
            dispatch({ type: 'LOADING', payload: true })
            if (callSettings.room === '') {
                try {
                    if ((!patient.ws || patient.ws === '') && assignedAppointment) {
                        patient.ws = assignedAppointment.appointments?.['0']?.['6']
                    }
                    let queryUser = firestore.collection('auth').doc(patient.ws)
                    queryUser.onSnapshot(async function (doc) {
                        let data = doc.data()._start_date
                        if (data !== '' && data !== "geo") {
                            let callRoom = data?.split('///')
                            if(callRoom) {
                                dispatch({ type: 'SET_CALL_ROOM', payload: { room: callRoom?.[0], token: callRoom?.[1] } })
                            }
                        } else {
                            dispatch({ type: 'SET_CALL_ROOM', payload: { room: '', token: '' } })
                        }
                    })
                } catch (err) {
                    dispatch({ type: 'ERROR', payload: 'FAILED QueryUser ' + err })
                }
            }
        } catch (err) {
            console.log(err)
        } finally {
            dispatch({ type: 'LOADING', payload: false })
        }
    }, [assignedAppointment, dispatch, callSettings.room, dni])

    // Effect to listen callSettings
    useEffect(() => {
        if (callSettings.room !== '') setCalling(true)
        else setCalling(false)
    }, [callSettings])

    // Effect to start audio calling
    useEffect(() => {
        try {
            var audioControl = document.getElementById('toneAudio')
            dispatch({ type: 'START_CALL' })
            if (audioControl !== null) {
                var interval = setInterval(() => {
                    audioControl.play()
                    try {
                        window.navigator.vibrate(1000)
                    } catch (err) {
                        console.log(err)
                    }
                }, 3000)
            }
            return () => clearInterval(interval)
        } catch (err) {
            alert(err)
        }
    }, [calling, dispatch])

    // Effect that get all selected questions for the patient's symptoms and save them to store
    useEffect(() => {
        function questionsForEachSymptom() {
            let selectedQuestions = []
            assessment.selectedSymptoms.forEach(symptom => {
                let filterQuestions = questions?.filter(t => {
                    if (t.symptom === symptom) {
                        return t
                    } else {
                        return null
                    }
                })
                selectedQuestions.push(filterQuestions[0]?.questions)
            })
            if (selectedQuestions.length === 0) {
                dispatch({ type: 'SHOW_ASK_TEXT', payload: false })
            } else {
                dispatch({ type: 'SET_SELECTED_QUESTIONS', payload: selectedQuestions })
            }
        }
        questionsForEachSymptom()
    }, [assessment.selectedSymptoms, questions, dispatch])

    function handleAppointment(type, claim) {
        if (type === 'complain') {
            handleComplain(type, claim)
        } else {
            cancelAppointment(type, claim)
        }
    }

    async function handleComplain(type, claim) {
        dispatch({ type: 'TOGGLE_MODAL_ACTION', payload: true })
        dispatch({ type: 'TOGGLE_DETAIL' });
        let headers = { 'Content-Type': 'Application/Json', 'Authorization': token }
        let data = {
            ws: patient.ws,
            dni: patient.dni,
            dt: moment().format('YYYY-MM-DD HH:mm:ss'),
            assignation_id: assignedAppointment.appointments[0][14] || patient.incidente_id,
            appointment_path: '',
            type,
            complain: claim
        }
        try {
            const res = await axios.post(cx_action_create, data, headers)
            setResponseAction({ response: res.data.ai_response, action: res.data.ai_action })
            dispatch({type: 'SET_CX_RESPONSE', payload: res.data})
        } catch (error) {
            dispatch({ type: 'TOGGLE_MODAL_ACTION', payload: false })
            swal('Error', 'Hubo un error al enviar el reclamo, intenta nuevamente.', 'error')
        }
    }

    function getEvent() {
        return firestore.collection('events/requests/online').doc(assignation).get()
            .then((res) => {
                return res.data()
            })
            .catch(err => console.log(err))
    }

    async function cancelAppointment(type, claim = '') {
        dispatch({ type: 'LOADING', payload: true })
        // let event = await getEvent()
        let date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        let yearAndMonth = moment(new Date()).format('YYYYMM')
        let documentBuild, aid = assignedAppointment.appointments[0][14], ws = patient.ws
        if (assignedAppointment.cuil !== 'bag') {
            try {
                documentBuild = `assignations/online_clinica_medica/${yearAndMonth}/${assignedAppointment.date.replace(
                    /-/g,
                    ''
                )}${assignedAppointment.time.replace(/:/g, '')}_${assignedAppointment.cuil}`
                await function () {
                    if (assignedAppointment.appointments['0'] && assignedAppointment.appointments['0']['14'] !== '') {
                        aid = assignedAppointment.appointments['0']['14']
                    } else if (appointment.appointments['0']['14']) {
                        aid = appointment.appointments['0']['14']
                    } else if (mr.assignation_id) {
                        aid = mr.assignation_id
                    }
                    return aid
                }
            } catch (error) {
                console.error(error)
            }
        } else {
            try {
                const r = await getAppointmentByDni(dni, 'bag')
                aid = r.appointments[0][14]
                documentBuild = `assignations/online_clinica_medica/bag/${aid}`
            } catch (error) {
                console.error(error)
            }
        }
        try {
            let data = {
                ws,
                dni: dni || '',
                dt: date || '',
                assignation_id: aid || '',
                appointment_path: documentBuild || '',
                type: type || '',
                complain: claim.replace(/(\r\n|\n|\r)/gm, '').trim() || ''
            }
            let headers = { 'Content-Type': 'Application/Json', 'Authorization': token }
            if(assignedAppointment && (assignedAppointment.status === "ATT" || assignedAppointment.status === "DONE")) {
                swal(`No se puede cancelar esta atención`, 
                    `La atención ya fue iniciada por el médico.`, 
                    'warning')
            } else {
                await axios.post(user_cancel, data, {headers})
                swal(`Consulta cancelada`, 
                `Será redireccionado/a al inicio`, 
                'success')
            }
            if (type === 'cancel') {
                dispatch({ type: 'RESET_ALL' })
                return history.push('/home')
            }
            return dispatch({ type: 'LOADING', payload: false })
        } catch (err) {
            console.error(err)
            dispatch({ type: 'ERROR', payload: err })
            dispatch({ type: 'RESET_ALL' })
            dispatch({ type: 'LOADING', payload: false })
            if (type === 'cancel') {
                return history.push('/home')
            }
        }
    }

    const cancelAppointmentWithReasons = useCallback(
        () => {
                let claim = ''
                if (cancelOptions === 'otro') {
                    claim = cancelDescription
                } else {
                    claim = cancelOptions
                }
                handleAppointment('cancel', claim)
                setShowModalCancelOptions(false)
                setCancelOptions('')
                setCancelDescription('')
        },[cancelDescription, cancelOptions])

    return (
        <>
            <BackButton action={()=> history.push(`/`)} />
            {loading && <Loading />}
            {showModalCancelOptions &&
                <div className='text-center'>
                    <MobileModal title='Motivo de canelación'
                        callback={() => setShowModalCancelOptions(false)}>
                        <div className='detail-modal-content'>
                            <div className='mb-2 d-flex flex-wrap flex-column align-items-start'>
                                <div className='custom-control custom-radio'>
                                    <input onChange={() => setCancelOptions('Me arrepentí')}
                                        type='radio' id='customRadio1' name='customRadio' className='custom-control-input'
                                    />
                                    <label className='custom-control-label' htmlFor='customRadio1'>Me arrepentí</label>
                                </div>
                                <div className='custom-control custom-radio'>
                                    <input onChange={() => setCancelOptions('Demasiada espera')}
                                        type='radio' id='customRadio2' name='customRadio' className='custom-control-input'
                                    />
                                    <label className='custom-control-label' htmlFor='customRadio2'>Demasiada espera</label>
                                </div>
                                <div className='custom-control custom-radio'>
                                    <input onChange={() => setCancelOptions('Error en la consulta anterior')}
                                        type='radio' id='customRadio3' name='customRadio' className='custom-control-input'
                                    />
                                    <label className='custom-control-label' htmlFor='customRadio3'>Error en la consulta anterior</label>
                                </div>
                                <div className='custom-control custom-radio'>
                                    <input onChange={() => setCancelOptions('otro')}
                                        type='radio' id='customRadio4' name='customRadio' className='custom-control-input'
                                    />
                                    <label className='custom-control-label' htmlFor='customRadio4'>Otro</label>
                                </div>
                            </div>
                            {cancelOptions === 'otro' &&
                                <textarea onChange={e => setCancelDescription(e.target.value)} value={cancelDescription}></textarea>
                            }
                            <button className='btn btn-blue mt-3' onClick={() => cancelAppointmentWithReasons()}>
                                Confirmar
                            </button>
                        </div>
                    </MobileModal>
                </div>
            }
            {openDetails &&
                <MobileModal title='Enviar un reclamo'
                    callback={() => dispatch({type: 'TOGGLE_DETAIL', payload: false})}>
                    <SendComplain 
                        sendComplain={claim => handleAppointment('complain', claim)} />
                </MobileModal>
            }
            {modalAction &&
                <MobileModal title='Respuesta' hideCloseButton>
                    <AnswerComplain responseAction={responseAction} />
                </MobileModal>
            }
            {calling ?
                <>
                    <div className='ico-calling'>
                        <Link to={`/${dni}/onlinedoctor/attention/`} replace={true}>
                            <FontAwesomeIcon icon={faPhoneAlt} />
                        </Link>
                    </div>
                    <div className='dinamic-call'>
                        <div>Su médico lo está llamando</div>
                    </div>
                </>
                :
                <>
                    <DoctorDelay cuit={assignedAppointment.cuit} time={assignedAppointment.time} date={assignedAppointment.date} />
                    <Slider />
                </>
            }
            <QueueActions
                setShowModalCancelOptions={setShowModalCancelOptions}
                cancel={() => handleAppointment('cancel')} dni={dni}
                calling={calling} appState={appointment.state}
            />
            {calling && <audio src={tone} id='toneAudio' autoPlay />}
        </>
    )
}

export default withRouter(Queue)
