import React, { useState } from 'react';
import Sthetoscope from "./Sthetoscope";
import instructionsAortico from "./assets/focoaortico.jpg"
import instructionsMitral from "./assets/focomitral.png"
import '../../../styles/inputs/audio/Audio.scss';


export default function SthetoscopeTrigger({finalAction, upload_url_prop, autonomus = false, wellness = false}) {
    const [typeOfRec, setTypeOfRec] = useState("AOT");
    const [vitalSignsInstruction, setVitalSignsInstruction] = useState(true)

    return (
        <div>
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
                image={instructionsAortico} id="AOT" finalAction={(link) => {
                    if(autonomus){finalAction(link)}
                    setTypeOfRec("MIT")}} upload_url_prop={upload_url_prop} />}
                {/* SANTICAMBIO IMAGEN DE FOCO MISTRAL */}
                {typeOfRec === "MIT" && <Sthetoscope 
                autonomus={autonomus}
                innerTextToRender="Foco Mitral: Coloque el micrófono en su corazón como indica la figura."
                finalAction={finalAction} image={instructionsMitral} id="MIT" upload_url_prop={upload_url_prop}/>}
            </>}
        </div>
    )
}
