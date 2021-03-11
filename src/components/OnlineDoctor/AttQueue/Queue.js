/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import queryString from 'query-string'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneAlt } from '@fortawesome/free-solid-svg-icons';
import { Link, withRouter, useHistory, useLocation, useParams } from 'react-router-dom';
import { calcReaminingHrsMins } from '../../Utils/dateUtils';
import { getDocumentFB } from '../../Utils/firebaseUtils';
import { findAllAssignedAppointment } from '../../Utils/appointmentsUtils';
import { BackButton } from '../../GeneralComponents/Headers';
import QueueActions from './QueueActions';
import DoctorDelay from './DoctorDelay';
import DBConnection from '../../../config/DBConnection';
import Slider from './Slider';
import Loading from '../../GeneralComponents/Loading';
import tone from '../../../assets/ring.mp3';
import moment from 'moment-timezone';
import swal from 'sweetalert';
import 'moment/locale/es';

const Queue = (props) => {
    const firestore = DBConnection.firestore();
    const dispatch = useDispatch();
    const [assignation, setAssignation] = useState('')
    const [calling, setCalling] = useState(false)
    const { loading } = useSelector(state => state.front)
    const assessment = useSelector(state => state.assessment)
    const {dni} = useSelector(state => state.user)
    const { questions, appointments: appointment, callSettings, assignedAppointment } = useSelector(state => state.queries)
    const patient = useSelector(state => state.user)
    const mr = useSelector(state => state.queries.medicalRecord[0])
    const {activeUid} = useParams()
    const history = useHistory()
    const location = useLocation()
    const params = queryString.parse(location.search)

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
                        if (mr.destino_final !== '' && mr.destino_final !== "USER CANCEL") {
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
        let snapshot = () => { console.log("No hay snapshot") }

        if (!!assignedAppointment && Object.keys(assignedAppointment).length > 0) {
            calculateRemainingTime(assignedAppointment)
        }
        const interval = setInterval(() => {
            calculateRemainingTime(assignedAppointment)
            if (callSettings.room === '') {
                snapshot = getCallStatus()
            }
        }, 10000)
        return () => {
            snapshot()
            clearInterval(interval)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assignedAppointment])

    // Effect to listen callSettings
    useEffect(() => {
        if (callSettings.room !== '') setCalling(true)
        else setCalling(false)
    }, [callSettings])

    // Effect to start audio calling
    useEffect(() => {
        try {
            var audioControl = document.getElementById('toneAudio')
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

    const getCallStatus = useCallback(() =>{
        // WIP
        try {
            if ((!patient.ws || patient.ws === '') && assignedAppointment) {
                patient.ws = assignedAppointment.appointments?.['0']?.['6']
            }
            if(patient.ws && patient.ws !== "") {
                let queryUser = firestore.collection('auth').doc(patient.ws)
                return queryUser.onSnapshot(async function (doc) {
                    let data = doc.data()._start_date
                    dispatch({ type: 'LOADING', payload: false })
                    if (data !== '' && data !== "geo") {
                        let callRoom = data?.split('///')
                        if(callRoom) {
                            dispatch({ type: 'SET_CALL_ROOM', payload: { room: callRoom?.[0], token: callRoom?.[1], assignation: callRoom?.[2]  } })
                        }
                    } else {
                        dispatch({ type: 'SET_CALL_ROOM', payload: { room: '', token: '' } })
                    }
                })
            } else {
                console.log("Cargando", patient)
                dispatch({ type: 'LOADING', payload: true })
            }
        } catch (err) {
            dispatch({ type: 'ERROR', payload: 'FAILED QueryUser ' + err })
        }
    }, [patient, assignedAppointment])


    return (
        <>
            <BackButton action={()=> history.push(`/`)} />
            {loading && <Loading />}
            {calling ?
                <>
                    <div className='ico-calling'>
                        <Link to={`/onlinedoctor/attention/${activeUid}?dependant=${params.dependant}`} replace={true}>
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
                id={assignedAppointment?.appointments?.[0][14]}
                calling={calling} 
                appState={appointment.state}
                activeUid={activeUid}
                dependant={params.dependant}
            />
            {calling && <audio src={tone} id='toneAudio' autoPlay />}
        </>
    )
}

export default withRouter(Queue)
