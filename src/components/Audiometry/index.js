//takes in an array of objects describing inputs, returns the rendered component
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import AudioReproducer from "../Inputs/Audio/Reproducer/AudioReproducer.js"
import ChartAudiometry from "./ChartAudiometry";
import {FaCheck} from "react-icons/fa";
import "../../styles/generalcomponents/Audiometry.scss"

const Audiometry = ({modal = true}) => {
	const [ready, setReady] = useState(false);
	const [onPlay, setOnPlay] = useState(false);
	const [ampCounter, setAmpCounter] = useState(0);
	const [freqCounter, setFreqCounter] = useState(0);
	const [earCounter, setEarCounter] = useState(0);
	const [results, setResults] = useState([]);
	const [resultsDB, setResultsDB] = useState([]);
	const [finished, setFinished] = useState(false);
	const audios = [
		[["/audios/audiometria/500-40-LE.wav", "/audios/audiometria/500-50-LE.wav", "/audios/audiometria/500-60-LE.wav", "/audios/audiometria/500-70-LE.wav", "/audios/audiometria/500-80-LE.wav", "/audios/audiometria/500-90-LE.wav", "/audios/audiometria/500-100-LE.wav", "/audios/audiometria/500-110-LE.wav"], 
		["/audios/audiometria/1000-40-LE.wav", "/audios/audiometria/1000-50-LE.wav", "/audios/audiometria/1000-60-LE.wav", "/audios/audiometria/1000-70-LE.wav", "/audios/audiometria/1000-80-LE.wav", "/audios/audiometria/1000-90-LE.wav", "/audios/audiometria/1000-100-LE.wav", "/audios/audiometria/1000-110-LE.wav"], 
		["/audios/audiometria/2000-40-LE.wav", "/audios/audiometria/2000-50-LE.wav", "/audios/audiometria/2000-60-LE.wav", "/audios/audiometria/2000-70-LE.wav", "/audios/audiometria/2000-80-LE.wav", "/audios/audiometria/2000-90-LE.wav", "/audios/audiometria/2000-100-LE.wav", "/audios/audiometria/2000-110-LE.wav"], 
		["/audios/audiometria/4000-40-LE.wav", "/audios/audiometria/4000-50-LE.wav", "/audios/audiometria/4000-60-LE.wav", "/audios/audiometria/4000-70-LE.wav", "/audios/audiometria/4000-80-LE.wav", "/audios/audiometria/4000-90-LE.wav", "/audios/audiometria/4000-100-LE.wav", "/audios/audiometria/4000-110-LE.wav"]], 
		[["/audios/audiometria/500-40-RE.wav", "/audios/audiometria/500-50-RE.wav", "/audios/audiometria/500-60-RE.wav", "/audios/audiometria/500-70-RE.wav", "/audios/audiometria/500-80-RE.wav", "/audios/audiometria/500-90-RE.wav", "/audios/audiometria/500-100-RE.wav", "/audios/audiometria/500-110-RE.wav"], 
		["/audios/audiometria/1000-40-RE.wav", "/audios/audiometria/1000-50-RE.wav", "/audios/audiometria/1000-60-RE.wav", "/audios/audiometria/1000-70-RE.wav", "/audios/audiometria/1000-80-RE.wav", "/audios/audiometria/1000-90-RE.wav", "/audios/audiometria/1000-100-RE.wav", "/audios/audiometria/1000-110-RE.wav"], 
		["/audios/audiometria/2000-40-RE.wav", "/audios/audiometria/2000-50-RE.wav", "/audios/audiometria/2000-60-RE.wav", "/audios/audiometria/2000-70-RE.wav", "/audios/audiometria/2000-80-RE.wav", "/audios/audiometria/2000-90-RE.wav", "/audios/audiometria/2000-100-RE.wav", "/audios/audiometria/2000-110-RE.wav"], 
		["/audios/audiometria/4000-40-RE.wav", "/audios/audiometria/4000-50-RE.wav", "/audios/audiometria/4000-60-RE.wav", "/audios/audiometria/4000-70-RE.wav", "/audios/audiometria/4000-80-RE.wav", "/audios/audiometria/4000-90-RE.wav", "/audios/audiometria/4000-100-RE.wav", "/audios/audiometria/4000-110-RE.wav"]]
	];
	const [audio, setAudio] = useState(audios[0][0][0]);
	const audioElement = useSelector(state => state.biomarkers.audioData);
	const { ws } = useParams();

	useEffect(() => {
		if (results[results.length-1] === "y") {
			setAmpCounter(ampCounter + 1);
		}
		if (results[results.length-1] === "n" && freqCounter != 3) {
			setFreqCounter(freqCounter + 1);
			setAmpCounter(0);
			setResultsDB([...resultsDB, audio.split("-")[1]]);
		}
		if(freqCounter === 3 && (ampCounter === 7 || results[results.length-1] === "n")) {
			setResultsDB([...resultsDB, audio.split("-")[1]]);
			// console.log("FINISH ONE EAR");
			setAmpCounter(0);
			setFreqCounter(0);
			setEarCounter(earCounter + 1);
		}
		if(ampCounter === 7 && freqCounter != 3) {
			setResultsDB([...resultsDB, audio.split("-")[1]]);
			setAmpCounter(0);
			setFreqCounter(freqCounter + 1);
		}
	},[results])
	useEffect(() => {
		try {
		setAudio(audios[earCounter][freqCounter][ampCounter]);
		setOnPlay(true);
		// console.log("DB:" , resultsDB);
		} catch(err) {
			console.log("finished: ", err);
			setFinished(true);
		}
	}, [ampCounter, freqCounter, earCounter])
	const handleYes = () => {
		try {
		setOnPlay(false);
		setResults([...results, "y"]);
		audioElement.pause()
		} catch (err) {
			console.log("Hang on!", err)
		}
	}
	const handleNo = () => {
	try {
		setOnPlay(false);
		setResults([...results, "n"]);
		audioElement.pause()
	} catch (err) {
		console.log("Hang on!", err)
	}
	}

	const plot = (data) => {
		if (data === "freqs") {return ["500", "1K", "2K", "4K"]}
		if (data === "leftEar"){return resultsDB.slice(0,4).map(num => num/20 * -1)}
		if (data === "rightEar"){return resultsDB.slice(4,8).map(num => num/20 * -1)}
	}
	return (<>
		{ !ready? 
		<>
		<div className={`ready ${modal? "modal--audiometry": ""}`}>
			<div className= "title title-fullscreen">
				<ul className="list-requirenments">
					<li><FaCheck /> Colóquese auriculares</li>
					<li><FaCheck /> Ponga el volumen al máximo</li> 
					<li><FaCheck /> Busque un entorno con el menor ruido posible.</li>
				</ul>
			<br></br> 
			<br></br>
			Preparado/a?</div>
			<div onClick={()=>setReady(true)} className = "record__trigger--btn styleButton confirm--audiometry">
			Si!
			</div>
		</div>
		</>
		:
		<div className= {`container ${modal? "modal--audiometry": ""}`}>
			{ onPlay && !finished ?
			<>
			<AudioReproducer 
			soundFile={audio}
			innerTextToRender="Marque si escucha para continuar el estudio"
			canPause={false}
			modal={modal}/>
			<div>
            <div onClick={()=>handleYes()} className = "record__trigger--btn y styleButton">
                Si
			</div>
			<div onClick={()=>handleNo()} className = "record__trigger--btn n styleButton">
                No
			</div>
			</div>
			</>:
			""}
			{finished? 
			<>
			<ChartAudiometry
			leftEarResults = {plot("leftEar")}
			rightEarResults = {plot("rightEar")}
			freqs = {plot("freqs")}
			modal={modal}
			linkConsulta={`/${ws}/onlinedoctor/who`} />
			</> 
			: ""}
		</div>}
	</>
	)
}

export default Audiometry;

