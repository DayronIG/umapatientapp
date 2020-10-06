import React, { useEffect } from "react";
import { useSelector } from 'react-redux';
import PropTypes from "prop-types";
import SpeechRecognition from "react-speech-recognition";
import { transcription } from '../../../config/endpoints' // etiqueta_match
import moment from 'moment';
import 'moment-timezone';
import axios from 'axios';

const propTypes = {
  // Props injected by SpeechRecognition
  transcript: PropTypes.string,
  resetTranscript: PropTypes.func,
  browserSupportsSpeechRecognition: PropTypes.bool
};

const options = {
    autoStart: true,
}

const Dictaphone = ({ finalTranscript, resetTranscript, browserSupportsSpeechRecognition, recognition}) => {
    const attData = useSelector((state) => state.assignations.current)
    const token = useSelector(state => state.userActive.token)
    recognition.lang = 'es-AR'

    useEffect(() => {
        if (!browserSupportsSpeechRecognition) {
            return null; // Si el navegador no soporta el STT acá podemos manejarlo de otra manera
        }
    }, [])

    useEffect(() => {
        if(finalTranscript !== "") {
            streamLine(finalTranscript, 'stt-patient')
            console.log(finalTranscript)
            resetTranscript()
        }
    }, [finalTranscript])

    function streamLine(line, rol) {
    let date = moment(new Date()).tz("America/Argentina/Buenos_Aires").format('YYYY-MM-DD HH:mm:ss:SSS')
        if (line !== "" && attData) {
            var data = {
                'ws': attData.appointments[0]["6"],
                'dni': attData.appointments[0]["1"],
                'dt': date,
                'cuil': attData.cuil|| '-',
                'assignation_id': attData.appointments[0]["14"] || '-',
                'rol': rol,
                'text': line || ''
            }
            let headers = { 'Content-Type': 'Application/Json'/*, 'Authorization': token */ }
            axios.post(transcription, data, { headers })
                .then((res) => {
                    console.log("Transcription:", res.data)
                })
                .catch(function (err) {
                    console.log("Transcription error", err)
                })
        }
    }
  
  return (
  <div>{finalTranscript}</div>
  );
};

Dictaphone.propTypes = propTypes;

export default SpeechRecognition(options)(Dictaphone);