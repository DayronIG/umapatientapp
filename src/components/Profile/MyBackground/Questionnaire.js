import React, { useEffect, useState, Fragment } from 'react'
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import QuestionGroup from './QuestionGroup';
import { NODE_SERVER } from '../../../config/endpoints';
import axios from 'axios';

export const RiskFactor = () => {
    const patient = useSelector(state => state.user)
    const history = useHistory()
    const { currentUser } = useSelector((state) => state.userActive)
    const [activeButton, setActiveButton] = useState(false)
    const [riskQuestions, setRiskQuestions] = useState({
        smoke: '',
        alcohol: '',
        alcoholFrequency: '',
    })

    const nextPage = async () => {
        if (activeButton) {
			let data = {
                history: {
                    smoke: riskQuestions.smoke,
                    alcohol: riskQuestions.alcohol,
                    alcoholFrequency: riskQuestions.alcoholFrequency
                }
			};
            await currentUser.getIdToken().then(async token => {
				let headers = { 'Content-Type': 'Application/Json', 'Authorization': `Bearer ${token}` }
                await axios.post(`${NODE_SERVER}/history/self/${patient.core_id}`, data, {headers})
                    .then((res)=> {
                        history.push(`/antecedents/${patient.id}/parents`)
                    })
                    .catch((err) => {
                        console.error(err);
                    });
                });
        }else {
            console.error('No completó los datos');
        }
	};

    useEffect(() => {
        if(riskQuestions.smoke !== '' && riskQuestions.alcohol !== '') {
            setActiveButton(true)
        }
    }, [riskQuestions])


    return (
        <section className='contentQuestionnaire'>
            <h3>Tus factores de riesgo</h3>
            <QuestionGroup question='¿Fumas?'>
                <Fragment>
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
                </Fragment>
            </QuestionGroup>
            <QuestionGroup question='¿Tomás alcohol?'>
                <Fragment>
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
                </Fragment>
            </QuestionGroup>
            {riskQuestions.alcohol &&
                <QuestionGroup question='¿Con qué frecuencia?'>
                    <select 
                        className='alcoholFrequency' 
                        onChange={(e)=>setRiskQuestions({...riskQuestions, alcoholFrequency: e.target.value})}
                    >
                        <option defaultValue='Elige una opción'>- Elige una opción -</option>
                        <option value="Una vez a la semana" >
                            Una vez a la semana
                        </option>
                        <option value="Dos veces a la semana" >
                            Dos veces a la semana
                        </option>
                        <option value="Tres veces a la semana">
                            Tres veces a la semana
                        </option>
                        <option value="Más">
                            Más
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

export const Parents = () => {
    const patient = useSelector(state => state.user)
    const history = useHistory()
    const { currentUser } = useSelector((state) => state.userActive)
    const [activeButton, setActiveButton] = useState(false)
    const [personalQuestions, setPersonalQuestions] = useState({
        allergy: '',
        allergyType: ''
    })

    return(
        <section className='contentQuestionnaire'>
            <h3>Antecedentes personales</h3>
            <QuestionGroup question='¿Eres alérgico/a?'>
                <Fragment>
                    <button
                        className={personalQuestions.allergy === true ? 'buttonAnswer focused' : 'buttonAnswer'}
                        onClick={()=>setPersonalQuestions({...personalQuestions, allergy: true})}>
                            Sí
                    </button>
                    <button 
                        className={personalQuestions.allergy === false ? 'buttonAnswer focused' : 'buttonAnswer'}
                        onClick={()=>setPersonalQuestions({...personalQuestions, allergy: false})}>
                            No
                    </button>
                </Fragment>
            </QuestionGroup>
            {personalQuestions.allergy === true && 
                <QuestionGroup question='¿A qué?'>
                    {/* react-select library */}
                </QuestionGroup>
            }
        </section>
    )
}