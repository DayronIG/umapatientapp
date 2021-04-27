import React, { useEffect, useState, Fragment } from 'react'
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { QuestionGroup } from '../QuestionGroup';

const RiskFactor =()=> {
    const patient = useSelector(state => state.user)
    const history = useHistory()
    const dispatch = useDispatch()
    const userHistory = useSelector(state => state.userHistory)
    const [activeButton, setActiveButton] = useState(false)
    const [riskQuestions, setRiskQuestions] = useState({
        smoke: null,
        alcohol: null,
        alcoholFrequency: '',
    })

    const nextPage = () => {
        window.scroll(0, 0);
        if(activeButton) {
            let data = {
                smoke: userHistory.smoke,
                alcohol: userHistory.alcohol,
                alcoholFrequency: userHistory.alcoholFrequency
            }
            localStorage.setItem('userHistory', JSON.stringify(data));
            history.push(`/antecedents/${patient.id}/allergy`)
        }
    }

    useEffect(() => {
        if(riskQuestions.smoke !== null && riskQuestions.alcohol !== null) {
            dispatch({type: 'USER_HISTORY_SMOKE', payload: riskQuestions.smoke})
            dispatch({type: 'USER_HISTORY_ALCOHOL', payload: riskQuestions.alcohol})
            dispatch({type: 'USER_HISTORY_ALCOHOL_FREQUENCY', payload: riskQuestions.alcoholFrequency})
            setActiveButton(true)
        }
    }, [riskQuestions])

    return (
        <section className='contentQuestionnaire'>
            <h3>Tus factores de riesgo</h3>
            <QuestionGroup question='¿Fumas?'>
                <button 
                    className={riskQuestions.smoke === true ? 'buttonAnswer focused' : 'buttonAnswer'}
                    onClick={()=>setRiskQuestions({...riskQuestions, smoke: true})}>
                        Sí
                </button>
                <button
                    className={riskQuestions.smoke === false ? 'buttonAnswer focused' : 'buttonAnswer'}
                    onClick={()=>setRiskQuestions({...riskQuestions, smoke: false})}>
                        No
                </button>
            </QuestionGroup>
            <QuestionGroup question='¿Tomás alcohol?'>
                <button
                    className={riskQuestions.alcohol === true ? 'buttonAnswer focused' : 'buttonAnswer'}
                    onClick={()=>setRiskQuestions({...riskQuestions, alcohol: true})}>
                        Sí
                </button>
                <button 
                    className={riskQuestions.alcohol === false ? 'buttonAnswer focused' : 'buttonAnswer'}
                    onClick={()=>setRiskQuestions({...riskQuestions, alcohol: false})}>
                        No
                </button>
            </QuestionGroup>
            {riskQuestions.alcohol &&
                <QuestionGroup question='¿Con qué frecuencia?'>
                    <select 
                        className='alcoholFrequency' 
                        onChange={(e)=>setRiskQuestions({...riskQuestions, alcoholFrequency: e.target.value})}
                    >
                        <option defaultValue=''>- Elige una opción -</option>
                        <option value="Poco" >
                            Poco
                        </option>
                        <option value="Moderado" >
                            Moderado
                        </option>
                        <option value="Excesivo">
                            Excesivo
                        </option> 
                    </select>
                </QuestionGroup>
            }
            <button 
                onClick={nextPage} 
                className={activeButton ? 'buttonNext next ' : 'buttonNext'}>
                    Siguiente
            </button>
        </section>
    )
}

export default RiskFactor;
