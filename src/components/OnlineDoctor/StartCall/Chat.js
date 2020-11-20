/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import  { useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment-timezone';
import { transcription } from '../../../config/endpoints';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Loader } from '../../GeneralComponents/Loading';
import { getUserMedicalRecord } from '../../../store/actions/firebaseQueries';
import db from "../../../config/DBConnection";
import '../../../styles/onlinedoctor/Chat.scss';

const Chat = (props) => {
    const dispatch = useDispatch()
    const { dni } = useParams()
    const { ws } = useSelector((state) => state.user)
    const current = useSelector(state => state.assignations.current)
    const loading = useSelector(state => state.front.loading)
    const [, setMedicalRecord] = useState([])
    const token = useSelector(state => state.userActive.token)
    const [dataChat, setDataChat] = useState([])
    const [inputValue, setInputValue] = useState('')
    const chatRef = useRef()
    const firestore = db.firestore()

    useEffect(() => {
        setInterval(() => {
            scrollToBottom()
        }, 5000)
    }, [chatRef])

    useEffect(() => {
        if (dni) {
            getAppointmentByDni(dni).then((appoint) => {
                if (appoint) {
                    dispatch({ type: "GET_CURRENT_ASSIGNATION", payload: appoint })
                } else {
                    let mr = findMR()
                    mr.then(mr => {
                        firestore.doc(`assignations/${mr[0]?.path}`).get().then(res => {
                            dispatch({ type: "GET_CURRENT_ASSIGNATION", payload: res.data() })
                        })
                    })
                }
            })
        }
    }, [dni])

    useEffect(() => {
        if (current?.appointments) {
            let query = firestore.collection('events').doc('messages').collection(dni).where("assignation_id", "==", current.appointments[0]["14"])
            query.onSnapshot({
                includeMetadataChanges: true
            },
                function (snapshot) {
                    var tempArray = []
                    snapshot.forEach((content) => {
                        tempArray.push(content.data())
                    })
                    tempArray.sort(function (a, b) {
                        var keyA = new Date(a.dt),
                            keyB = new Date(b.dt);
                        // Compare the 2 dates
                        if (keyA < keyB) return -1;
                        if (keyA > keyB) return 1;
                        return 0;
                    })
                    setDataChat(tempArray)
                })
        }
    }, [current])

    async function findMR() {
        try {
            const medicRecs = await getUserMedicalRecord(dni, ws)
            let filteredRecords = []
            if (!!medicRecs && medicRecs.length) {
                medicRecs.forEach(function (mr) {
                    if (mr.mr_preds) {
                        const scheduledTurn = mr.mr_preds.pre_clasif[0]
                        const doctorName = mr.mr_preds.pre_clasif[1]
                        const specialty = mr.mr_preds.pre_clasif[2]
                        const date = mr.mr_preds.pre_clasif[3]
                        const time = mr.mr_preds.pre_clasif[4]
                        const path = mr.mr_preds.pre_clasif[5]
                        if (scheduledTurn === 'TurnoConsultorioOnline' && mr.mr.destino_final === "") {
                            filteredRecords.push({ doctorName, specialty, date, time, mr, path })
                        }
                    }
                })
                setMedicalRecord(filteredRecords)
            }
            return filteredRecords
        } catch (error) {
            // console.error(error)
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    async function getAppointmentByDni(dni) {
        if (dni !== "") {
            let currentDate = moment(new Date()).tz("America/Argentina/Buenos_Aires").format('YYYYMM')
            let compareDate = moment(new Date()).tz("America/Argentina/Buenos_Aires").format('YYYY-MM-DD')
            let specialty = 'online_clinica_medica' // Temporal, luego habrá más especialidades
            try {
                const query = await db.firestore().collection('assignations').doc(specialty).collection(currentDate)
                    .where('appointments.0', 'array-contains', dni)
                    .where("state", "in", ["ASSIGN", "ATT"])
                const bagQuery = await db.firestore().collection('assignations').doc(specialty).collection("bag")
                    .where('appointments.0', 'array-contains', dni)
                    .where("state", "in", ["ASSIGN", "ATT"])
                return new Promise((resolve, reject) => {
                    query.get()
                        .then((snap) => {
                            let appointments = []
                            snap.forEach(subDoc => {
                                let data = { ...subDoc.data(), path: subDoc.ref.id }
                                if (data.date >= compareDate) {
                                    appointments.push(data)
                                }
                            })
                            if (appointments.length === 0) {
                                bagQuery.get().then(snapBag => {
                                    snapBag.forEach(subDoc => {
                                        let data = { ...subDoc.data(), path: subDoc.ref.id }
                                        appointments.push(data)
                                    })
                                    return resolve(appointments[0])
                                })
                            } else {
                                return resolve(appointments[0])
                            }
                        })
                        .catch(err => reject(err))
                })
            } catch (err) { throw err }
        }
    }


    function postDataConversation(postValue) {
/*         if (!current?.cuil || !current?.appointments[0]["14"]) {
            window.location.reload();
        } */
        dispatch({ type: 'LOADING', payload: true })
        let date = moment(new Date()).tz("America/Argentina/Buenos_Aires").format('YYYY-MM-DD HH:mm:ss')
        // 'Accept': 'text/plain' 
        if (inputValue !== '') {
            var data = {
                'ws': ws,
                'dni': dni,
                'dt': date,
                'cuil': current?.cuil || '',
                'assignation_id': current?.appointments && (current?.appointments[0]["14"] || ''),
                'rol': 'patient',
                'text': inputValue || ''
            }
            let headers = { 'Content-Type': 'Application/Json', 'Authorization': token }
            axios.post(transcription, data, { headers })
                .then((res) => {
                    setInputValue('')
                    dispatch({ type: 'LOADING', payload: false })
                    scrollToBottom()
                })
                .catch(function (err) {
                    dispatch({ type: 'LOADING', payload: false })
                })
        } else {
            console.error("Hay que escribir un mensaje")
            dispatch({ type: 'LOADING', payload: false })
        }
    }


    function scrollToBottom() {
        if (chatRef.current) {
            chatRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <>
            <div className="chatWrapper">
                {dataChat.length >= 1 ? dataChat.map((content, index) =>
                    <div className="listContainer" key={index} ref={chatRef}>
                        {content.rol === 'doctor' &&
                            <div>
                                <div key={index} className="conversationWrapper umaChat">
                                    <div className="conversation">{content.msg.toString()}</div>
                                    <div className="right-column umaChatProfile"></div>
                                </div>
                                <small className="umaChatDate">{content.dt.slice(0, -7)}</small>
                            </div>}
                        {content.rol === 'patient' &&
                            <div>
                                <div key={index} className="conversationWrapper userChat">
                                    <div className="left-column userChatProfile">
                                        <FontAwesomeIcon icon={faUser} />
                                    </div>
                                    <div className="conversation">{content.msg}</div>
                                </div>
                                <small className="userChatDate">{content.dt.slice(0, -7)}</small>
                            </div>}
                    </div>
                ) :
                    <span className="chatEmpty">
                        Aún no hay mensajes.
                        <br />
                        Describa sus síntomas para iniciar el diálogo con su médico
                    </span>}
                    {loading && <Loader className="ml-5" />}
                <div className="postDataWrapper">
                    <input className="inputChat" placeholder="Enviarle un mensaje al médico" value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                postDataConversation(inputValue)
                            }
                        }}>
                    </input>
                    <button className="sendButton btn btn-active"
                        onClick={() => postDataConversation(inputValue)}
                    >Enviar</button>
                </div>
            </div>
            <div className="chat__ad">El chat se mantendrá activo mientras no haya conexión de audio o video</div>
        </>
    );
}


export default Chat;