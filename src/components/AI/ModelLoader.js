import React, { useState, useEffect, useRef, useReducer } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as tf from '@tensorflow/tfjs';
// import "../../styles/AI/LoadModels.scss";

const modelCycle = {
    initial: "initial",
    states: {
        initial: { on: { next: "loadModel" } },
        loadModel: { on: { next: "modelLoaded" } },
        modelLoaded: { on: { next: "imgReady" } },
        imgReady: { on: { next: "runPredict" }, showImage: true },
        runPredict: { on: { next: "completed" } },
        completed: { on: { next: "modelLoaded" }, showImage: true, showResults: true }
    }
};

function ModelLoader() {
    const [results, setResults] = useState([]);
    const [imageURL, setImageURL] = useState(null);
    const [model, setModel] = useState(null);
    const imageRef = useRef();
    const inputRef = useRef();
    const reducer = (state, event) =>
        modelCycle.states[state].on[event] || modelCycle.initial;
    const [appState, dispatch] = useReducer(reducer, modelCycle.initial);
    const next = () => dispatch("next");

    useEffect(() => {

    }, [])

    const loadModel = async () => {
        next();
        // Acá se puede cargar cualquier otro modelo
        // Considerando dynamic imports
        // Example: const model = await import('./model')
        const model = await mobilenet.load();
        // const skin_model = await import('../../assets/models/skin_model.json')
        // let model_url = 'http://localhost:3000/models/skin_model.json'
        // let model_url = 'https://storage.googleapis.com/tfjs-models/savedmodel/mobilenet_v2_1.0_224/model.json'
        // const model = await tf.loadGraphModel(model_url); // loadGraphModel (tf) or loadLayersModel (keras)
        setModel(model);
        next();
    };

    const identify = async () => {
        next();
        const results = await model.classify(imageRef.current);
        setResults(results);
        next();
    };

    const reset = async () => {
        setResults([]);
        next();
    };

    const upload = () => inputRef.current.click();

    const handleUpload = event => {
        const { files } = event.target;
        if (files.length > 0) {
            const url = URL.createObjectURL(event.target.files[0]);
            setImageURL(url);
            next();
        }
    };

    const actionButton = {
        initial: { action: loadModel, text: "Cargar modelo" },
        loadModel: { text: "Cargando modelo..." },
        modelLoaded: { action: upload, text: "Subir una imagen" },
        imgReady: { action: identify, text: "Identificar" },
        runPredict: { text: "Procesando..." },
        completed: { action: reset, text: "Volver" }
    };

    const { showImage, showResults } = modelCycle.states[appState];

    return (
        <div>
            {showImage && <img src={imageURL} style={{width: '50px'}} alt="Imagen subida" ref={imageRef} />}
            <input
                type="file"
                accept="image/*"
                capture="camera"
                onChange={handleUpload}
                ref={inputRef}
            />
            {showResults && (
                <ul>
                    {results.map(({ className, probability }) => (
                        <li key={className}>{`${className}: %${(probability * 100).toFixed(
                            2
                        )}`}</li>
                    ))}
                </ul>
            )}
            <button 
                type="button"
                onClick={actionButton[appState].action || (() => { })}>
                {actionButton[appState].text}
            </button>
        </div>
    );
}

export default ModelLoader;