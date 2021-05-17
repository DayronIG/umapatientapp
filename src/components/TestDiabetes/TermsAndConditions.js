import React from 'react'
import './diabetes.scss'
import icon from '../../assets/icon.png'

const TermsAndConditions = ({step, setStep}) => {
    return (

        <div className='diabetes__TermsAndConditions'>
                     <img src={icon}></img>
            <h1> Lo invitamos a participar en un estudio de investigación</h1>

                <p>
                En ÜMA estamos desarrollando una aplicación que permite determinar con alta precisión si usted es diabético o no, usando la cámara del celular! Solo le tomará unos segundos y quizás en un futuro, otros o incluso usted, podrán beneficiarse.</p>

                <p>Usted podrá rechazar el ofreciemiento en todo momento y la asistencia médica que recibirá no se verá influida por su decisión.
                La medición no es exacta y puede contener errores.</p>

                <p>Tené en cuenta lo siguiente:
                El estudio es totalmente voluntario. Sus datos sólo serán recabados con fines de investigación, y serán resguardados durante todo el proceso. No almacenaremos información sensible.</p> 

                <div className='diabetes__TermsAndConditionsButtons'>
                    <button onClick={() => setStep(0)}>RECHAZAR</button>
                    <button onClick={() => setStep(1)}>ACEPTAR</button>
                </div>
        </div>
    )
}

export default TermsAndConditions
