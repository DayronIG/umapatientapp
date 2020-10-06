//takes in an array of objects describing inputs, returns the rendered component
import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment-timezone';

import {uploadFileToFirebase} from '../../../Utils/postBlobFirebase';
import microphone from '../../assets/microphone.jpeg'

const Audio = (props) => {
	const [audioBlob, setAudioBlob] = useState(null)
	const [chunks, setChunks] = useState([])
	const [mediaRecorder, setMediaRecorder] = useState(null)

	
	const toggleMicrophone = () => {
		if (mediaRecorder) {
			console.log("------------- TERMINO ------------- ")
			stopMicrophone();
    	} else {
			console.log("------------- EMPEZO ------------- ")
			getMicrophone();
    	}
	}
	
	const stopMicrophone = () => {
		mediaRecorder.stop();
		console.log('chunks', chunks)
		setMediaRecorder(null)
		
	}
	

	const getMicrophone = () => {
		setChunks([])
		navigator.mediaDevices.getUserMedia({
      audio: true,
			video: false
    }).then(function(stream) {
			const recorder = new MediaRecorder(stream)
			setMediaRecorder(recorder);
			console.log(recorder)
			recorder.start();
			
	
			recorder.addEventListener("dataavailable", event => {
				let date = moment().tz('America/Argentina/Buenos_Aires').format('YYYYMMDDHHmmss')
				console.log(chunks)
				uploadFileToFirebase(event.data, '94429191/'+date)
			});
	});
	}



	return (
		<>
			<div>

			<div><button ><img src={microphone} onClick={toggleMicrophone}/></button></div>

			</div>
		</>
	)
}

// const Audio = () => {
//  	const [mediaRecorder, setMediaRecorder] = useState(null)
// 	const record = useRef();
// 	const stop = useRef();
// 	const soundClips = useRef();
// 	useEffect(()=>{
	
// 	})
	
// const start = function() {
// 	if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
// 		console.log('getUserMedia supported.');
// 		navigator.mediaDevices.getUserMedia({
// 					audio: true,
// 					video: false
// 			 }).then( async function(stream) {
// 				console.log('el STREAM recorder', stream)

// 				 await setMediaRecorder(new MediaRecorder(stream, {
// 										type: 'audio',
// 										mimeType: 'audio/webm;codecs=opus',
// 										recorderType: StereoAudioRecorder,
// 										sampleRate: 44100,
// 										bufferSize: 4096
// 								}));
// 				 console.log('el media recorder', mediaRecorder)
// 				 mediaRecorder.start();
// 			 }).catch(function(err) {
// 					console.log('The following getUserMedia error occured: ' + err);
// 			 }
// 		);
//  } else {
// 		console.log('getUserMedia not supported on your browser!');
//  }
 

	
// }
// const save = function() {
//   mediaRecorder.stop();
//   console.log(mediaRecorder.state);
//   console.log("recorder stopped");
// }
// return (
// 			<>
// 				<div>
// 				<button ref={record} onClick={start}>record</button>
// 				<button  ref={stop} onClick={save}>stop</button>
// 				<audio ref={soundClips}></audio>
	
// 				</div>
// 			</>
// 		)
// }


export default Audio;