import React from 'react'
import './diabetes.scss'
import labsicon from '../../assets/labsicon.png'
import heartbeat2 from './heartbeat2.svg'

const TermsAndConditions = ({step, setStep}) => {
    return (

        <div className='diabetes__TermsAndConditions'>
            <img src={heartbeat2}></img>
            <h1> Evaluá tu riesgo cardiovascular</h1>

            <p>¿Te gustaría conocer el riesgo que tienes de sufrir alguna enfermedad cardiaca?</p>

            <p>Gracias a nuestra tecnología basada en Inteligencia Artificial puedes averiguarlo en 2 simples pasos.</p>

               
                <div className='diabetes__TermsAndConditionsButtons'>
                    <button className='button1' onClick={() => setStep(0)}>RECHAZAR</button>
                    <button onClick={() => setStep(1)}>COMENZAR</button>
                </div>
        </div>
    )
}

export default TermsAndConditions
