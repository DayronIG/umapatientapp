import { FaceMesh } from "@mediapipe/face_mesh";
import React, { useRef, useEffect } from "react";
import * as Facemesh from "@mediapipe/face_mesh";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
import './diabetes.scss'



const Test = ({handleSubmit}) => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const connect = window.drawConnectors;
    var camera = null;
    function onResults(results) {
        // const video = webcamRef.current.video;
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        // Set canvas width
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        const canvasElement = canvasRef.current;
        const canvasCtx = canvasElement.getContext("2d");
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(
            results.image,
            0,
            0,
            canvasElement.width,
            canvasElement.height
        );
        if (results.multiFaceLandmarks) {
            for (const landmarks of results.multiFaceLandmarks) {
                connect(canvasCtx, landmarks, Facemesh.FACEMESH_TESSELATION, {
                    color: "#ffff",
                    lineWidth: 0.2,
                });
                connect(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYE, {
                    color: "#ffff",
                    lineWidth: 0.3,
                });
                // connect(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYEBROW, {
                //     color: "#ffff",
                // });
                connect(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYE, {
                    color: "#ffff",
                    lineWidth: 0.3,
                });
                // connect(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYEBROW, {
                //     color: "#ffff",
                // });
                connect(canvasCtx, landmarks, Facemesh.FACEMESH_FACE_OVAL, {
                    color: "#ffff",
                    lineWidth: 0.3,
                });
                connect(canvasCtx, landmarks, Facemesh.FACEMESH_LIPS, {
                    color: "#ffff",
                    lineWidth: 0.3,
                });
            }
        }
        canvasCtx.restore();
    }
    // }

    // setInterval(())
    useEffect(() => {
        const faceMesh = new FaceMesh({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
            },
        });

        faceMesh.setOptions({
            maxNumFaces: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });

        faceMesh.onResults(onResults);

        if (
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null
        ) {
            camera = new cam.Camera(webcamRef.current.video, {
                onFrame: async () => {
                    await faceMesh.send({ image: webcamRef.current.video });
                },
                width: 400,
                height: 500,
            });
            camera.start();
        }
    }, []);

    const videoConstraints = {
        facingMode: "user"
    };

    return (
        <div>
            <Webcam
                    ref={webcamRef}
                    style={{
                        // position: "absolute",
                        display:'none',
                        marginLeft: "auto",
                        marginRight: "auto",
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        zindex: 9,
                        width: '100%',
                        height: '65%',
                    }}
                    videoConstraints={videoConstraints}
                />
                <canvas
                    ref={canvasRef}
                    className="output_canvas"
                    style={{
                        // position: "absolute",
                        marginLeft: "auto",
                        marginRight: "auto",
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        zindex: 9,
                        width: '100%',
                        height: '65%',
                    }}
                ></canvas>
            <div className='TestCamera__buttons'>
                    <h1>Encuadrate lo mas derecho que puedas!</h1>
                    <button onClick={handleSubmit}>Tomar Foto</button>
                </div>
            </div>
    );
}

export default Test;
