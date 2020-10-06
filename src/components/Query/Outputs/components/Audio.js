//takes in an array of objects describing inputs, returns the rendered component
import React, { useState, useEffect, useRef } from 'react';




const Audio = (props) => {
	const [file, setFile] = useState('')
	const data = props.data
	/*
	
	data = {
		url: firestore db ref
	}
	*/

	useEffect(()=>{
		if(file == ''){
			// Download file
			setFile('')
		}
	})


	return (
		<>
			<div>

		

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