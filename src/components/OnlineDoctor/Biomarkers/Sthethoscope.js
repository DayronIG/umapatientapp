import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import ReactMicRecord from 'react-mic-record';
import axios from 'axios';
import { sound_online, start_biomarker } from '../../../config/endpoints.js';
import moment from 'moment';
import 'moment-timezone';
import stethoscope from '../../../assets/sthetoscop.jpeg';
import stethoscopewav from '../../../assets/stethoscopewav.wav';
import '../../../styles/onlinedoctor/Biomarkers.scss';
import DBConnection from '../../../config/DBConnection';

const Sthetoscope = (props) => {
    const dispatch = useDispatch()
    const token = useSelector(state => state.userActive.token)
    const [started, setStarted] = useState(false)
    const [record, setRecord] = useState()
    const patient = useSelector(state => state.queries.patient)

    const startRecording = () => {
        console.log("Empezar a grabar")
        setStarted(true)
      }
     
    const stopRecording = () => {
        setRecord(false)
        console.log("Detener grabación")
    }

    useEffect(() => {
        if(props.step === "2") {
            setTimeout(() => { setStarted(true) }, 3000)
        }
    }, [props.step])

    useEffect(() => {
        if(started === true) {
        setRecord(true)
        // dispatch({type: 'LOADING', payload: true})
        setTimeout(() => {
            setRecord(false)
            setStarted(false)
            // dispatch({type: 'LOADING', payload: false})
        }, 8000)
        }
    }, [started])
     
    const onData = (recordedBlob) => {
        console.log('chunk of real-time data is: ', recordedBlob)
      }
     
    const onStop = async (recordedBlob) => {
        setRecord(false)
        dispatch({type: 'LOADING', payload: true})
        let date = moment().tz("America/Argentina/Buenos_Aires").format('YYYY-MM-DD HH:mm:ss')
        var base64str = ""
        async function blobToB64() {
            var reader = new FileReader();
            reader.onload = await function(){
                var arrayBuffer = reader.result;
                base64str = btoa(arrayBuffer);
                console.log(base64str)
            };
            await reader.readAsBinaryString(recordedBlob.blob);
            handleFileChange(recordedBlob.blobURL)
        }
        await blobToB64()
        setTimeout(() => {
            let headers = {'Content-Type': 'Application/Json'/* , 'Authorization': token */}
            let data ={'assignation_id': patient.incidente_id,
                'ws': patient.ws,
                'dni': patient.dni,
                'dt': `${date}`,
                'b64': `${base64str}`,
                'sex': patient.sex,
                'age': patient.dob,
                'voice': '1'
                }
                axios.post(sound_online, data, headers)
                .then(ok => {
                    dispatch({type: 'LOADING', payload: false})
                }).catch(err => {
                    console.log(err)
                    dispatch({type: 'LOADING', payload: false})
                }) 
                let resetBiomarker = {
                    'ws':`${patient.ws}`,
                    'dni': `${patient.dni}`,
                    'type': `stethoscope`,
                    'status': '0'
                }
                axios.post(`${start_biomarker}`, resetBiomarker, headers).then(ok => console.log(ok)).catch(err => console.log(err)) 
        }, 1000)
      }

    const handleFileChange = blobUrl => {
        let dt =  moment().tz("America/Argentina/Buenos_Aires").format('YYYYMMDDHHmmss')
        console.log("Uploading foto")
        // const firestore = DBConnection.firestore(),
        let ref  = DBConnection.storage().ref()
        let fileRef = ref.child(`${patient.dni}/source/${dt}_stethoscopeAudio`)
        getFileBlob(blobUrl, file => {
            fileRef.put(file).then(snap => { console.log("Uploaded ", snap, fileRef) })
        })
    }

    var getFileBlob = function (url, cb) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.addEventListener('load', function() {
          cb(xhr.response);
        });
        xhr.send();
      };

    return (
        <div className="sthethoscope-container">
            {props.step === "1" && 
            <div className="stethoscope-instructions">
                <p>
                    <b>Instrucciones:</b> Por favor apoye el micrófono a su pecho como se ve en la imagen y siga las instrucciones de su médico. <br />
                </p>
                <img src={stethoscope} className="stethoscope-image" alt="stethoscope" />
                <button className="btn btn-blue-lg" onClick={() => dispatch({type: 'SET_BIOMARKER_WINDOW', payload: false})}>Cerrar</button>
            </div>}
            {props.step === "2" &&
                <div className="stethoscope-sample">
                    <p>Se está tomando una muestra. Por favor espere. <br /></p>
                    <ReactMicRecord
                        record={record}         // defaults -> false.  Set to true to begin recording
                        className={"sound-wave"}       // provide css class name
                        onData={(data) => onData(data)}        // callback to execute when chunk of audio data is available
                        onStop={(data) => onStop(data)}        // callback to execute when audio stops recording
                        strokeColor={'#ffffff'}     // sound wave color
                        backgroundColor={'#42a5f5'} // background color
                        />
{/*                 <button onClick={() => startRecording()} type="button">Start</button>
                    <button onClick={() => stopRecording()} type="button">Stop</button> */}
                </div>
            }
        </div>
    )
}

export default Sthetoscope