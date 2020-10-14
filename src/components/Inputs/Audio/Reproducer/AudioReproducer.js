//takes in an array of objects describing inputs, returns the rendered component
import React, { useState, useEffect, useRef } from 'react';
import '../../../../styles/inputs/audio/Audio.scss';
import Modal from '../../../GeneralComponents/Modal/MobileModal';
import getBlobFirebase from "../../../Utils/getBlobFirebase"
import { FaPlay } from 'react-icons/fa'
import { FaPause } from 'react-icons/fa'
import { useSelector, useDispatch } from "react-redux"

const AudioReproducer = ({ 
    modal= false,
    soundFile = '/audios/audiometria/1000-26-LE.wav',
    innerTextToRender="Escuche", 
    finalAction = (() => console.log("no final action")),
    canPause = true
    }) => {
    const [onPlay, setOnPlay] = useState(false);
    const dispatch = useDispatch();
    const audioElement = useSelector(state => state.biomarkers.audioData);
    // const [audioElement, setAudioElement] = useState(null);

    useEffect(() => {
        (async function player () {
            const audioBlob = await getBlobFirebase(soundFile);
            var audioMp3 = new Blob ([audioBlob], {type:"audio/mp3"});
            var url = URL.createObjectURL(audioMp3);
            var audio = new Audio (url);
            // setAudioElement(audio);
            dispatch({type: "SET_AUDIO_ELEMENT", payload: audio});
        })();
    }, []);

    const play = () => {
        try {
        audioElement.volume = 1;
        audioElement.play()
        setOnPlay(true)
        const interval = setInterval(() => {
            if(audioElement.ended) 
                {setOnPlay(false)
                finalAction()
                clearInterval(interval)}
        }, 1000);
        }
        catch (error) {console.log("Wait until the audio is loaded to reproduce")}
    };

    const pause = () => {
        audioElement.pause()
        setOnPlay(false);
    };

	return (
		<div className= "audio-container">
			<div className= {modal? "isModal":"isFullscreen"}>
            {onPlay ?
             <div className={modal? "isModalAnimation loader-audio-player-container":"isFullscreenAnimation loader-audio-player-container"}>
            <div className="spinner-grow text-primary loader-audio-player" role="status">
            </div>
            <div className="spinner-grow text-info loader-audio-player" role="status">
            </div>
            <div className="spinner-grow text-primary loader-audio-player" role="status">
            </div>
            <div className="spinner-grow text-info loader-audio-player" role="status">
            </div>
            <div className="spinner-grow text-primary loader-audio-player" role="status">
            </div>
            <div className="spinner-grow text-info loader-audio-player" role="status">
            </div>
            <div className="spinner-grow text-primary loader-audio-player" role="status">
            </div>
            <div className="spinner-grow text-info loader-audio-player" role="status">
            </div>
            <div className="spinner-grow text-primary loader-audio-player" role="status">
            </div>
            <div className="spinner-grow text-info loader-audio-player" role="status">
            </div>
            <div className="spinner-grow text-primary loader-audio-player" role="status">
            </div>
            <div className="spinner-grow text-info loader-audio-player" role="status">
            </div>
            <div className="spinner-grow text-primary loader-audio-player" role="status">
            </div>
            <div className="spinner-grow text-info loader-audio-player" role="status">
            </div>
            </div>
            : ""}

			<p className= {modal? "title":"title title-fullscreen"}>{innerTextToRender}</p>

            {!onPlay ?
            <div onClick={play}  className = "record__trigger--btn styleButton">
                <FaPlay className="icon" />
			</div>
            :
            <div onClick={canPause ? pause: () => ""} className = {` record__trigger--btn styleButton ${canPause? "":"disabled"}`}>
                <FaPause className="icon" />
			</div>}
		</div>
		</div>
	)
}

export default AudioReproducer;

