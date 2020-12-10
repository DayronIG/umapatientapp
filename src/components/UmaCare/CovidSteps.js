import React from 'react';
import {useDispatch} from 'react-redux';
import hisopado from "./img/hisopado.png";
import muestra from "./img/muestra.png";
import negative from "./img/negative.png";
import positive from "./img/positive.png";
import alta from "./img/alta.png";

export const CovidSteps = ({percent, setTextDetail, result}) => {
  // eslint-disable-next-line default-case
  const dispatch = useDispatch()
  switch(percent) {
    case 0:
      return (
        <div>
          <h3>El hisopado</h3>
          <div className="text-image">
            <div className="text">
              Para realizar el diagnóstico de COVID-19 es necesario tomar una muestra de las fosas nasales y/o garganta utilizando un hisopo...
            </div>
            <div className="detalle-img">
              <img src={hisopado} alt="hisopado" />
            </div>
          </div>
          <p className="link"
                onClick={() => {
                  dispatch({ type: "OPEN_MODAL", payload: true });
                  setTextDetail("Para realizar el diagnóstico de COVID-19 es necesario tomar una muestra de las fosas nasales y/o garganta utilizando un hisopo. Este consiste en un bastoncillo de plástico con una punta de algodón. Sus síntomas pueden deberse a la infección por otros virus como la gripe o el resfrió común, por lo cual es importante que mantenga las medidas de higiene de manos y el uso de tapaboca para evitar el contagio de otras personas.");
                }}>Más Información</p>
        </div>
      );
    case 35: 
      return (
        <>
          <h3>Esperando Resultado</h3>
          <div className="text-image">
            <div className="text">
              La muestra del hisopado es llevada a un laboratorio especializado para su análisis...
            </div>
            <div className="detalle-img">
              <img src={muestra} alt="muestra" />
            </div>
          </div>
          <p className="link" onClick={() => {
            dispatch({ type: "OPEN_MODAL", payload: true });
            setTextDetail("La muestra del hisopado es llevada a un laboratorio especializado para su análisis. En el mismo se realiza una técnica específica llamada PCR. La misma consiste en amplificar una porción del virus COVID-19, para así poder detectarlo. Dado que es una técnica compleja y con gran demanda los resultados suelen demorar entre 48 y 72hs.")
          }}>Más Información</p>
        </>
      ) 
    case 70: 
      return (
        <>
          <h3>
            { 
              (result === 'positive' && 'Resultado Positivo') ||
              (result === 'negative' && 'Resultado Negativo')
            }
          </h3>
          <div className="text-image">
            <div className="text">
              { 
                (result === 'positive' && 'Un test positivo significa que actualmente está infectado con el virus COVID-19...') ||
                (result === 'negative' && 'Un test negativo significa que no se ha detectado la presencia del virus en el hisopado realizado... ')
              }
            </div>
            <div className="detalle-img">
              <img src={result === 'positive' ? positive : negative} alt="hisopado" />
            </div>
          </div>
            <p className="link" onClick={() => {
              dispatch({ type: "OPEN_MODAL", payload: true });
              result === 'positive' ?
              setTextDetail("Un test positivo significa que actualmente está infectado con el virus COVID-19. No debe alarmarse, pero si debe saber que es muy importante que respete las medidas de aislamiento para no contagiar a otras personas.")
              :
              setTextDetail('Un test negativo significa que no se ha detectado la presencia del virus en el hisopado realizado. En este caso la probabilidad que tenga COVID-19 es baja y no es necesario extremar medidas de aislamiento más allá de las recomendaciones de cuarentena obligatoria. ')
            }}>
              Más Información
            </p>
        </>
      ) 
    case 71: 
      return (
        <>
          <h3>
            Proceso de alta
          </h3>
          <div className="text-image">
            <div className="text">
              Transcurridos los 10 días del inicio de los síntomas si la evolución de los síntomas es favorable se procederá al alta.
            </div>
            <div className="detalle-img">
              <img src={alta} alt="hisopado" />
            </div>
          </div>
          <p className="link" onClick={() => {
            dispatch({ type: "OPEN_MODAL", payload: true });
            setTextDetail("Ya han transcurrido 10 días del inicio de los síntomas y hemos observado que su evolución es favorable. Dentro de pocos días podrá obtener el alta médica. Fuerza que falta poco!");
          }}>Más Información</p>
        </>
      ) 
    default:
      return <>
          <h3>
            Seguimiento finalizado
          </h3>
          <div className="text-image">
            <div className="text">
              Transcurridos los 10 días del inicio de los síntomas si la evolución de los síntomas es favorable se procederá al alta.
            </div>
            <div className="detalle-img">
              <img src={alta} alt="hisopado" />
            </div>
          </div>
      </>
  }
}