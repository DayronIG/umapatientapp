/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux"
import moment from 'moment-timezone';
import axios from "axios";
import { FaMicrophone } from 'react-icons/fa'
import { RiRecordCircleLine } from 'react-icons/ri';
import { Loader } from '../../GeneralComponents/Loading';
import swal from 'sweetalert';
import AudioAnalyser from "./AudioWaveformAnalizer/AudioAnalyser.js"
import { post_biomarkers } from "../../../config/endpoints"

import {uploadFileToFirebase} from '../../Utils/postBlobFirebase';

const AudioRecorder = ({ 
	modal= true, 
	time = 20, 
	image="",
	id="",
	innerTextToRender="Coloque el micrófono en su corazón como indica la figura.", 
	finalAction = (() => console.log("no final action")),
	upload_url_prop = false,
	autonomus = false ,
	}) => {

	const [mediaRecorder, setMediaRecorder] = useState(null);
	const [onRecord, setOnRecord] = useState(false);
	const [counter, setCounter] = useState(time);
	const [finishedRecording, setFinishedRecording] = useState(false);
	const [audioToPlot, setAudioToPlot] = useState(null);
	const appoint = useSelector((state) => state.assignations.selectedAppointment);
	const { patient } = useSelector((state) => state.queries);
	const dispatch = useDispatch();
	const token = localStorage.getItem('token');

	useEffect(() => {
		if(onRecord && counter > 0) {
		  setTimeout(() => {
			setCounter(counter - 1);
		}, 1000);
		}
		if (mediaRecorder && counter === 0) {
			stopMicrophone();
			setOnRecord(false)
			setFinishedRecording(true)
		}
	}, [counter, onRecord])

	const startMicrophone = () => {
			setTimeout(() => setOnRecord(true), 300)
			getMicrophone();
	};
	
	const stopMicrophone = () => {
		mediaRecorder.stop();
		setMediaRecorder(null);
		setAudioToPlot(null);
	};

	const getMicrophone = async () => {
		const audio = await navigator.mediaDevices.getUserMedia({
		  audio: true,
		  video: false
		});
		const options = {
			mimeType: "audio/webm"
		}
		const recorder = new MediaRecorder(audio, options);
		setMediaRecorder(recorder);
		setAudioToPlot(recorder.stream);
		recorder.start();

		recorder.addEventListener("dataavailable", async event => {
				try{
					//POST TO COMPUTER VISION
					const blobDataInWebaFormat = event.data; 
					const blobDataInWavFormat = new Blob([blobDataInWebaFormat], { type : 'audio/wav' });
					const fileLink = await uploadFileToFirebase(blobDataInWavFormat, `${patient.dni}/heartbeat/${patient.dni}_${moment().format('YYYY-MM-DD_HH:mm:ss')}_heartbeat_original.wav`);
					dispatch({ type: 'SET_ASSESSMENT_BIOMARKER', payload: {sthetoscope: fileLink} });
					var heartbeatEndpoint = "https://computer-vision-dot-uma-v2.uc.r.appspot.com/process_heartbeat"
					var headersComputerVision = { 'Content-Type': 'Application/Json' }
					var timeID = moment().format("YYYY-MM-DD-HH-mm-ss")
					if(id === "AOT") {dispatch({type: "SET_STHETOSCOPE_ID", payload: timeID})}
					var data = {
						"url": fileLink, 
						"id": `${timeID}##${id}##`,
						"upload_url": upload_url_prop? upload_url_prop:`${patient.dni}/attached/${appoint?.path?.split('/')?.[3]}`
					} 
					const resData = await axios.post(heartbeatEndpoint, data, {headersComputerVision})
					//POST TO BIOMARKERS
					let post_biomarkers_data = {
						data: {},
						date: moment().format("YYYY-MM-DD_HH-mm-ss"),
						dni: patient.dni,
						links: {
							[ `sthetoscope${id}_original`]: fileLink,
							processed_hb: resData.data.processed_hb,
							waveform: resData.data.waveform
						},
							type: `sthetoscope${id}`,
							ws: patient.ws
					}
					var headers = { 'Authorization': token, 'Content-Type': 'Application/Json' }
					axios.post(`${post_biomarkers}/${patient.dni}`, post_biomarkers_data, {headers})
					swal("Captura exitosa", "Se ha grabado con éxito!", "success")
					autonomus? finalAction({[`audio_sthetocope_${id}`]: fileLink}): finalAction()
                } catch(error) {
					swal("Algo falló", "Intente nuevamente mas tarde", "warning")
					autonomus? finalAction({[`audio_sthetocope_${id}`]: ""}): finalAction()
					console.error(error);
				}
			})};

	return (
		<div className= "audio-container">
			<div className= {modal? "isModal":"isFullscreen"}>

			{!finishedRecording  && 
			<div className="heart-record-indications">
				<img className={autonomus? "margin-top-autonomous": ""} src={image}  alt="hb"/>
			</div>}

			{finishedRecording && (
						<div className="loader__container">
							<br />
							<br />
							<br />
							<Loader />
							<div className='mt-5'>Cargando...</div>
						</div>
					)}

			{audioToPlot ? <AudioAnalyser className="analizer" audio={audioToPlot} modal={modal} /> : ''}

			{onRecord &&
            <div className="counter">
                <p className="styleCounter">{counter}</p> 
                <span className="sr-only">Loading...</span>
            </div>}

			{!finishedRecording  && 
			<> 			
			{!onRecord && !audioToPlot && <p className= {modal? "title":"title title-fullscreen"}>{innerTextToRender}</p>}
			{ !onRecord ?
			<div className = "record__trigger--btn styleButton" onClick={startMicrophone}>
				<FaMicrophone className="icon" />
                <span>Grabar</span>
			</div>
			:
			<div className = "record__trigger--btn styleButton">
				<RiRecordCircleLine className="btn-reproducir" />
				<span>Grabando...</span>
			</div>}
			</>}
		</div>
		</div>
	)
}

export default AudioRecorder;