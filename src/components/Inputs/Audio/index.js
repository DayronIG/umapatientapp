/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import {Link} from 'react-router-dom';
import {FaPlay, FaPause} from "react-icons/fa"
import Sthetoscope from "./Sthetoscope";
import { storage } from "firebase"
import instructionsAortico from "./assets/focoaortico.jpg"
import instructionsMitral from "./assets/focomitral.png"
import getBlobFirebase from "../../Utils/getBlobFirebase"
import '../../../styles/inputs/audio/Audio.scss';


export default function SthetoscopeTrigger({ finalAction, upload_url_prop, autonomus = false, wellness = false }) {
    const [typeOfRec, setTypeOfRec] = useState("AOT");
    const [vitalSignsInstruction, setVitalSignsInstruction] = useState(true);
    const [showResults, setShowResults] = useState(false);
    const [sthetoscopeGraph, setSthetoscopeGraph] = useState("")
    const [sthetoscopeAudio, setSthetoscopeAudio] = useState("");
    const [sthetoscopeBpm, setSthetoscopeBpm] = useState("")
    const timeID = useSelector(state => state.biomarkers.sthetoscopeID)
    const {ws} = useSelector(state => state.user)
    const [onPlay, setOnPlay] = useState(false);
    const audioElement = useSelector(state => state.biomarkers.audioData);
    const dispatch = useDispatch()

    const play = () => {
        try {
        audioElement.volume = 1;
        audioElement.play()
        setOnPlay(true)
        const interval = setInterval(() => {
            if(audioElement.ended) 
                {setOnPlay(false)
                clearInterval(interval)}
        }, 1000);
        }
        catch (error) {console.log("Wait until the audio is loaded to reproduce")}
    };
    
    const pause = () => {
        audioElement.pause()
        setOnPlay(false);
    };

    useEffect(() => {
        if(sthetoscopeAudio){
            (async function player () {
                const audioBlob = await getBlobFirebase(sthetoscopeAudio);
                var audioMp3 = new Blob ([audioBlob], {type:"audio/mp3"});
                var url = URL.createObjectURL(audioMp3);
                var audio = new Audio (url);
                // setAudioElement(audio);
                dispatch({type: "SET_AUDIO_ELEMENT", payload: audio});
            })();
    }
    }, [sthetoscopeAudio]);

    useEffect(() => {
        var imageRecognizer = `AOT`
        if(showResults){
            storage().ref().child(upload_url_prop).listAll()
            .then(res => {
                Promise.all(res.items.map(async item => {
                    await item.getDownloadURL()
                    .then(x => {
                        if (x.includes(imageRecognizer) && x.includes(timeID)) {
                            if (x.includes("signal_vs_time")) {
                                setSthetoscopeGraph(x)
                            }
                            if (x.includes("_processed_hb_")) {
                                setSthetoscopeAudio(item.location.path_)
                                setSthetoscopeBpm(x?.split("_")[3]?.split(".wav")[0])
                            }
                        }
                    }
                    )}))
            })
            .catch(err => console.error(err))
        }
    }, [showResults])

    return (
        <div>
            {!showResults && <>
                {vitalSignsInstruction && autonomus ?
                    <div className='instrucciones-audio'>
                        <h3>Capturaremos algunos signos vitales. Por favor:</h3>
                        <p>1.- Sitúate en una habitación silenciosa.</p>
                        <p>2.- Permanece lo más quieto posible durante 20 segundos</p>
                        <button onClick={() => setVitalSignsInstruction(false)}>Continuar</button>
                    </div>
                    :
                    <>
                        {typeOfRec === "AOT" && <Sthetoscope
                            autonomus={autonomus}
                            innerTextToRender="Foco Aórtico: Coloque el micrófono en su corazón como indica la figura."
                            image={instructionsAortico} id="AOT" 
                            wellness={wellness}
                            finalAction={(link) => {
                                if (autonomus) { finalAction(link) }
                                setTypeOfRec("MIT")
                            }} upload_url_prop={upload_url_prop} />}
                        {typeOfRec === "MIT" && <Sthetoscope
                            autonomus={autonomus}
                            wellness={wellness}
                            innerTextToRender="Foco Mitral: Coloque el micrófono en su corazón como indica la figura."
                            finalAction={() => {
                                !wellness ? finalAction() : setShowResults(true)
                            }}
                            image={instructionsMitral} id="MIT" upload_url_prop={upload_url_prop} />}
                    </>}
            </>}
            {
                showResults && wellness &&
                <>
                    {sthetoscopeGraph && <div className="wellness__results__img__container">
                        <img className="wellness__results__img" src={sthetoscopeGraph} alt="waveform" />
                    </div>}
                    <div className="wellness__results__title">
                        {parseInt(sthetoscopeBpm) > 50 && parseInt(sthetoscopeBpm) < 180 && <p>Frecuencia cardíaca estimada: {sthetoscopeBpm}</p>}
                        {!onPlay ?
                        <div onClick={play}  className = "styleButton">
                            <FaPlay className="icon" />
                        </div>
                        :
                        <div onClick={pause} className = "styleButton">
                            <FaPause className="icon" />
                        </div>}
                        <small>Éste escaneo se encuentra en etapa experimental y no constituye ni reemplaza un análisis médico.</small>
                        <Link to={`/onlinedoctor/${ws}`}>
                            <div className="">Si lo desea puede consultar a un médico online haciendo click aquí</div>
                        </Link>
                    </div>
                    {/* <div className="record__trigger--btn styleButton">
                        <span onClick={() => finalAction()}>Volver</span>
                    </div> */}
                </>
            }
        </div>
    )
}
