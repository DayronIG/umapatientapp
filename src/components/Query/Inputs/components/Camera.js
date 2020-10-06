//takes in an array of objects describing inputs, returns the rendered component
import React, { useState, useEffect, useRef } from 'react';
import * as handpose from '@tensorflow-models/handpose';

const Camera = (props) => {
  const [audioBlob, setAudioBlob] = useState(null)
  const [chunks, setChunks] = useState([])
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [facingMode, setFacingMode] = useState('user')
  const errorHandler = (error) => {
    console.log(error)
  }
  const onTakePhoto = async (url, blob) => {
    console.log(url, blob)

  }
  useEffect(() => {
    let track = {}
    try {
      const constraints = { video: { facingMode: facingMode }, audio: false };
      const cameraView = document.querySelector('.camera--view'),
        cameraOutput = document.querySelector('.camera--output'),
        cameraSensor = document.querySelector('.camera--sensor'),
        cameraTrigger = document.querySelector('.camera--trigger');
      if (facingMode === 'user') {
        cameraView.className = 'flip';
        cameraSensor.className = 'flip';
        cameraOutput.className = 'flip';
      }
      // Take a picture when cameraTrigger is tapped
      cameraTrigger.onclick = async function () {
        cameraSensor.width = cameraView.videoWidth;
        cameraSensor.height = cameraView.videoHeight;
        console.log(cameraView, cameraView.videoWidth, cameraView.videoHeight)
        const model = await handpose.load()
        console.log('model', model)
        const detections = await model.estimateHands(cameraView)
        console.log(detections)
        if (detections.length > 0) {
          console.log(JSON.stringify(detections[0].annotations))
          detections[0].landmarks.forEach(hand => console.log(hand))
        }
        cameraSensor.getContext('2d').drawImage(cameraView, 0, 0);
        cameraOutput.src = await cameraSensor.toBlob(function (blob) {
          const url = URL.createObjectURL(blob);
          return onTakePhoto({ url, blob })
        }, 'image/jpeg', 1)
        await track.stop()
      }
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
          track = stream.getTracks()[0]
          cameraView.srcObject = stream
          cameraView.onloadedmetadata = () => cameraView.play()
        })
        .catch(err => {
          errorHandler(true)
        })
    } catch (error) {
      console.error(error)
      errorHandler(true)
    }
    return () => {
      try {
        track.stop()
      } catch (error) {
        console.error(error)

      }
    }
  }, [])



  return (
    <main className='camera'>
      <div>
        {/* <-- Camera sensor --> */}
        <canvas style={{height: '4px'}} className='camera--sensor'></canvas>
        {/* <-- Camera view --> */}
        <video style={{width:'100%'}} className='camera--view' autoPlay playsInline></video>
        {/* <-- Camera output --> */}
        <img width="640" height="480" src='//:0' alt='' className='camera--output' />
        {/* <-- Camera trigger --> */}
      </div>
      <div className='cameraTriggerContainer'>
        <button className='camera--trigger'>Tomar foto</button>
      </div>
    </main>
  )
}


export default Camera;