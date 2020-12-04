/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import { url_facePos_model, url_facePos_metadata } from '../../../config/endpoints';
import { useSelector, useDispatch } from 'react-redux';
import { FaCamera } from 'react-icons/fa';
import { RiRecordCircleLine } from 'react-icons/ri';
import { uploadFileToFirebase } from '../../Utils/postBlobFirebase';
import UmaLoader, { Loader } from '../../GeneralComponents/Loading';
import moment from 'moment-timezone';
import { load } from '@teachablemachine/image';
import '../../../styles/inputs/video/videoComponent.scss';
import Axios from 'axios';
import { post_biomarkers } from "../../../config/endpoints"

const VideoComponent = (props) => {
	const { time, title, isModal, finalAction, onError } = props;
	const videoRef = useRef();
	const [stream, setVideoStream] = useState(null);
	const [contador, setContador] = useState(time || 10);
	const [iniciado, setIniciado] = useState(false);
	const [terminado, setTerminado] = useState(false);
	const [instrucciones, setInstrucciones] = useState(true);
	const { dni, ws } = useSelector((state) => state.user);
	const [modelPrediction, setmodelPrediction] = useState('red');
	const dispatch = useDispatch();
	const token = localStorage.getItem('token');

	useEffect(() => {
		if (!stream) {
			startVideo();
		}
	}, [dni]);

	useEffect(() => {
		if (iniciado && contador > 0) {
			setTimeout(() => {
				setContador(contador - 1);
			}, 1000);
		}
	}, [contador, iniciado]);

	const runModel = async () => {
		try {
			let video = videoRef.current;
			const model = await load(url_facePos_model, url_facePos_metadata);
			const maxPredictions = model.getTotalClasses();
			const predict = async () => {
				if(video) {
					const prediction = await model.predict(video);
					for (let i = 0; i < maxPredictions; i++) {
						// console.log(prediction[i].className + ': ' + prediction[i].probability.toFixed(2));
						if (prediction[0].probability.toFixed(2) >= 0.8) {
							setmodelPrediction('green');
						} else {
							setmodelPrediction('red');
						}
					}
				}
			};
			const loop = async () => {
				await predict();
				window.requestAnimationFrame(loop);
			};
			window.requestAnimationFrame(loop);
		} catch (error) {
			console.error(error);
			return error;
		}
	};

	const startVideo = async () => {
		let video = videoRef.current;
		try {
			let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
			video.srcObject = stream;
			setVideoStream(stream);
			runModel();
			return stream;
		} catch (error) {
			console.error(error);
			return error;
		}
	};

	const record = (stream) => {
		let video = videoRef.current;
		const dt = moment().format('YYYYMMDDHHmmss');
		setIniciado(true);
		let chuncks = [];
		video.srcObject = stream;
		const mediaRecorder = new MediaRecorder(stream, {
			mimeType: 'video/webm',
		});
		mediaRecorder.start();
		mediaRecorder.ondataavailable = function(e) {
			chuncks.push(e.data);
		};
		mediaRecorder.onstop = function() {
			const blob = new Blob(chuncks, { type: 'video/webm' });
			chuncks = [];
			uploadFileToFirebase(blob, `/${dni}/video/${dt}_${dni}.webm`)
				.then((res) => {
					dispatch({ type: 'SAVE_FILES', payload: res });
					let biomarker = {
						video: res,
					};
					dispatch({ type: 'SET_ASSESSMENT_BIOMARKER', payload: biomarker });
					setIniciado(false);
					var headers = { 'Authorization': token, 'Content-Type': 'Application/Json' }
					let post_biomarkers_data = {
						data: {},
						date: moment().format("YYYY-MM-DD_HH-mm-ss"),
						dni: dni,
						links: biomarker,
						type: `fever-video`,
						ws: ws
					}
					Axios.post(`${post_biomarkers}/${dni}`, post_biomarkers_data, {headers})
					finalAction(biomarker);
				})
				.catch((err) => {
					if (onError) onError();
					else finalAction();
				});
		};
		setTimeout(() => {
			mediaRecorder.stop();
			stream.getTracks().forEach((track) => {
				track.stop();
				setTerminado(true);
			});
		}, time * 1000 || 11000);
	};

	const clases = (isModal) => {
		if (isModal) {
			return 'isModal';
		} else {
			return 'noModal';
		}
	};

	return (
		<>
			{!dni ? (
				<UmaLoader />
			) : (
				<>
					<div className='contenedor-video'>
						{instrucciones && (
							<div className='instrucciones-video'>
								<h3>Capturaremos algunos signos vitales. Por favor:</h3>
								<p>1.- Sitúate en una habitación luminosa.</p>
								<p>2.- Enfoca tu rostro mirando al centro de la pantalla</p>
								<p>3.- Permanece lo más quieto posible durante 10 segundos</p>
								<button onClick={() => setInstrucciones(false)}>Continuar</button>
							</div>
						)}
						{iniciado && contador !== 0  && (
							<>
								<p className={`${clases(isModal)}`}>{contador}</p>
								<div
									className={`spinner-border text-light spiner-video ${clases(isModal)}`}
									role='status'>
									<span className='sr-only'>Loading...</span>
								</div>
							</>
						)}
						{terminado ? (
						<div>
							<br />
							<br />
							<br />
							<Loader />
							<div className='mt-5'>Cargando...</div>
						</div>
						) : (
							<div className='contenedor-video-circulo'>
								<div className={`circulo-video ${modelPrediction}`} />
								<div className='floating-text'>
									{modelPrediction === 'green' ? 'Correcto' : 'Céntrate'}
								</div>
								<video className={`${clases(isModal)}`} ref={videoRef} autoPlay playsInline></video>
							</div>
						)}
						{!terminado && <>
						<div className={`footer-reproducir ${clases(isModal)}`}>
							<div className='contenedor-btn-reproducir'>
								<div className='title-video'>
									{title || 'Colóquese frente a la camara y haga click en capturar'}
								</div>
								{!iniciado ? (
									<button onClick={() => record(stream)}>
										<FaCamera className='btn-reproducir' />
										<span>Capturar</span>
									</button>
								) : (
									<button>
										<RiRecordCircleLine className='btn-reproducir' />
										<span>Grabando...</span>
									</button>
								)}
							</div>
						</div>
						</>}
					</div>
				</>
			)}
		</>
	);
};

export default VideoComponent;
