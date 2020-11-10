import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import AnalysisResultCard from './AnalysisResultCard';
import negative from "../../../assets/img/negative.png";
import positive from "../../../assets/img/positive.png";

const Result = () => {
    const {currentService} = useSelector(state => state.deliveryService)
    const [result, setResult] = useState("-")

    useEffect(() => {
        if(currentService.lab_result === "POSITIVE"){
            setResult("Detectable")
        } else if (currentService.lab_result === "NEGATIVE") {
            setResult("No detectable")
        }
    }, [currentService])

    return (
        <div className="trackProgress__module">
            <div className="laboratory__container">
                <h3 className="laboratory__header">Resultado disponible: {result}</h3>
                <div className="laboratory__description">
                <div className="laboratory__image">
                    {result === "Detectable" &&
                        <img src={positive} alt="hisopado positivo" />}
                    {result === "No detectable" &&
                        <img src={negative} alt="hisopado negativo" />}
                </div>
                {result === "Detectable" &&
                    <div className="laboratory__text">
                        Un resultado detectable quiere decir que se ha identificado la presencia del virus COVID-19 en tu organismo, pero no hay por qué alarmarse. Es importante que cumplas con tu tratamiento y respetes las medidas de aislamiento para cuidar la salud de otras personas.
                    </div>}
                {result === "No detectable" &&
                    <div className="laboratory__text">
                        Un resultado no detectable quiere decir que no se ha identificado presencia del virus en la muestra del hisopado realizado así que la posibilidad de que tengas COVID-19 es muy baja. En este caso, no es necesario extremar las medidas de aislamiento, pero si respetar la cuarentena obligatoria y demás medidas de prevención.
                    </div>}
                </div>
            </div>
            {currentService.path && <AnalysisResultCard link={currentService.path} />}
        </div>
    ) 
}

export default Result;