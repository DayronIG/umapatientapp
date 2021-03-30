import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { NODE_SERVER } from '../../../config/endpoints';
import axios from 'axios';


export const RiskFactor = () => {
    const patient = useSelector(state => state.user)
    const { currentUser } = useSelector((state) => state.userActive)
    const [activeButton, setActiveButton] = useState(false)
    const history = useHistory()
    const dispatch = useDispatch()
    const [riskQuestions, setRiskQuestions] = useState({
        smoke: '',
        alcohol: '',
        alcoholFrequency: '',
    })

    const nextPage = async () => {
        if (activeButton) {
			dispatch({type: 'LOADING', payload: true})
			let history = {
				smoke: riskQuestions.smoke,
                alcohol: riskQuestions.alcohol,
                alcoholFrequency: riskQuestions.alcoholFrequency
			};
            await currentUser.getIdToken().then(async token => {
				let headers = { 'Content-Type': 'Application/Json', 'Authorization': `Bearer ${token}` }
                await axios.post(`${NODE_SERVER}/history/self/${patient.core_id}`, {history}, {headers})
                    .then((res) => {
                        console.log('Siguientes preguntas')
                    })
                    .catch((err) => {
                        dispatch({ type: 'TOGGLE_DETAIL' });
                        console.log(err);
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
            <section className='questionGroup'>
                <p className='question'>¿Fumas?</p>
                <div className='answers'>
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
                </div>
            </section>
            <section className='questionGroup'>
                <p className='question'>¿Tomás alcohol?</p>
                <div className='answers'>
                    <button
                        className={riskQuestions.alcohol === true ? 'buttonAnswer focused' : 'buttonAnswer'}
                        onClick={()=>setRiskQuestions({...riskQuestions, alcohol: true})}>Sí</button>
                    <button 
                        className={riskQuestions.alcohol === false ? 'buttonAnswer focused' : 'buttonAnswer'}
                        onClick={()=>setRiskQuestions({...riskQuestions, alcohol: false})}>No</button>
                </div>
            </section>
            {riskQuestions.alcohol &&
                <section className='questionGroup'>
                    <label className='question'>¿Con qué frecuencia?</label>
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
                </section>
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
    return(
        <div>
            Holo parents
        </div>
    )
}