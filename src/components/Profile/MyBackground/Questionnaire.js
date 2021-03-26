import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const RiskFactor = () => {
    const patient = useSelector(state => state.user)
    const history = useHistory()
    const [riskQuestions, setRiskQuestions] = useState({
        smoke: '',
        alcohol: {response: '', frequency: ''},
    })

    useEffect(() => {
        console.log(riskQuestions, 'risk Question')
    }, [riskQuestions])

    return (
        <section className='contentQuestionnaire'>
            <h3>Tus factores de riesgo</h3>
            <section className='questionGroup'>
                <p className='question'>¿Fumas?</p>
                <div className='answers'>
                    <button onClick={()=>setRiskQuestions({...riskQuestions, fumas: 'Si'})}>Sí</button>
                    <button onClick={()=>setRiskQuestions({...riskQuestions, fumas: 'No'})}>No</button>
                </div>
            </section>
            <section className='questionGroup'>
                <p className='question'>¿Tomás alcohol?</p>
                <div className='answers'>
                    <button onClick={()=>setRiskQuestions({...riskQuestions, alcohol: 'Si'})}>Sí</button>
                    <button onClick={()=>setRiskQuestions({...riskQuestions, alcohol: 'No'})}>No</button>
                </div>
                {riskQuestions.alcohol === 'Si' &&
                    <select name='alcoholFrequency'>
                        <option defaultValue='' selected>- Elige una opción -</option>
                        <option value="Una vez a la semana">Value 1</option>
                        <option value="Dos veces a la semana">Value 2</option>
                        <option value="Tres veces a la semana">Value 3</option>
                        <option value="Más">Value 3</option>
                    </select>
                }
            </section>
        </section>
    )
}

export const Parents = () => {
    return(
        <div>
            Holo parents
        </div>
    )
}