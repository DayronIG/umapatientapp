//takes in an array of objects describing inputs, returns the rendered component
import React, { useState } from 'react';
import moment from 'moment-timezone';

import {uploadFileToFirebase} from '../../../Utils/postBlobFirebase';
import microphone from '../../assets/microphone.jpeg'

const Audio = (props) => {
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
				<button >
					<img src={microphone} onClick={toggleMicrophone} alt="mic" />
				</button>
			</div>
		</>
	)
}

export default Audio;