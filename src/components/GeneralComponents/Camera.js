import React, { useEffect, useRef } from 'react'
import { FaCamera } from 'react-icons/fa'
import '../../styles/generalcomponents/Camera.scss';

export default function Camera({
	facingMode = 'user',
	onTakePhoto = (photo) => console.log(photo),
	onError = (err) => console.log(err),
	dataType = '',
	innerHtmlToRender = "",
	modal = false}) {

    const camView = useRef(), camOutput = useRef(), camSensor = useRef()
    // Facingmode: 'user' or 'environment'
    useEffect(() => {
        let track = {};
        (async function startCamera() {
            try {
                const constraints = { video: { facingMode }, audio: false };
                // Take a picture when camTrigger is tapped
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                track = stream.getTracks()[0];
                camView.current.srcObject = stream;
                camView.current.onloadedmetadata = () => camView.current.play();
            } catch (error) {
                console.error(error);
                onError(error);
            }
        })()
        return () => {
            try { track.stop(); } catch (error) { }
        }
    }, [])

	const takePhoto = () => {
		camSensor.current.width = camView.current.videoWidth;
		camSensor.current.height = camView.current.videoHeight;
		camSensor.current.getContext('2d').drawImage(camView.current, 0, 0);
		// const url = URL.createObjectURL(blob);
		switch (dataType) {
			case 'blob':
				camOutput.current.src = camSensor.current.toBlob(function (blob) {
					return onTakePhoto(blob);
				}, 'image/jpeg', 1);
				return;
			case 'jpg':
				camOutput.current.src = camSensor.current.toDataURL('image/jpg');
				return onTakePhoto(camOutput.current.src);
			case 'png':
				camOutput.current.src = camSensor.current.toDataURL('image/png');
				return onTakePhoto(camOutput.current.src);
			default:
				camOutput.current.src = camSensor.current.toDataURL('image/jpg');
				return onTakePhoto(camOutput.current.src);
		}
	}

	const fixed = {
		position: "fixed"
	}

	const relative = {
		position: "relative"
	}
	
	return (
		<main className='camera'>
			{/* <-- Camera sensor --> */}
			<canvas ref={camSensor} className={facingMode === 'user' ? 'camera__sensor flip' : 'camera__sensor'}></canvas>
			{/* <-- Camera view --> */}
			<video ref={camView} className={facingMode === 'user' ? 'camera__view flip' : 'camera__sensor'} style={modal ? relative: fixed} autoPlay playsInline ></video>
			{/* <-- Camera output --> */}
			<img ref={camOutput} alt='Camara' className={facingMode === 'user' ? 'camera__output flip d-none' : 'camera__output d-none'}/>
			{/* <-- Camera trigger --> */}
			<div className='camera__trigger'style={modal ? relative: fixed}>
				{innerHtmlToRender}
				<button className='camera__trigger--btn' onClick={takePhoto}>
					<FaCamera className="icon" />
					<span>Tomar foto</span>
				</button>
			</div>
		</main>
	)
}
