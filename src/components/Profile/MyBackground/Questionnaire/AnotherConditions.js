import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { QuestionGroup } from '../QuestionGroup';

const AnotherConditions =()=> {
    const patient = useSelector(state => state.user)
    const history = useHistory()
    const dispatch = useDispatch()
    const userHistory = useSelector(state => state.userHistory)
    const [activeButton, setActiveButton] = useState(false)
    const [personalQuestions, setPersonalQuestions] = useState({
        celiac: null,
        diabetes: null,
        diabetesType: '',
        hypertension: null,
        thyroid: null,
        thyroidType: '',
    })

    const nextPage = async () => {
        window.scroll(0, 0);
        if(activeButton) {
            const previousData = JSON.parse(localStorage.getItem('userHistory'));
            let data = {
                ...previousData,
                celiac: userHistory.celiac,
                diabetes: userHistory.diabetes,
                diabetesType: userHistory.diabetesType,
                hypertension: userHistory.hypertension,
                thyroid: userHistory.thyroid,
                thyroidType: userHistory.thyroidType,

            }
            localStorage.setItem('userHistory', JSON.stringify(data));
            history.push(`/antecedents/${patient.id}/familybackground`)
        }
	};

    useEffect(() => {
        if( personalQuestions.celiac !== null &&
            personalQuestions.diabetes !== null &&
            personalQuestions.hypertension !== null &&
            personalQuestions.thyroid !== null) {
            dispatch({type: 'USER_HISTORY_CELIAC', payload: personalQuestions.celiac})
            dispatch({type: 'USER_HISTORY_DIABETES', payload: personalQuestions.diabetes})
            dispatch({type: 'USER_HISTORY_DIABETES_TYPE', payload: personalQuestions.diabetesType})
            dispatch({type: 'USER_HISTORY_HYPERTENSION', payload: personalQuestions.hypertension})
            dispatch({type: 'USER_HISTORY_THYROID', payload: personalQuestions.thyroid})
            dispatch({type: 'USER_HISTORY_THYROID_TYPE', payload: personalQuestions.thyroidType})
            setActiveButton(true)
        }
    }, [personalQuestions])


    return(
        <section className='contentQuestionnaire'>
            <QuestionGroup question='¿Eres celiaco?'>
                    <button
                        className={personalQuestions.celiac === true ? 'buttonAnswer focused' : 'buttonAnswer'}
                        onClick={()=> setPersonalQuestions({...personalQuestions, celiac: true})}>
                            Sí
                    </button>
                    <button 
                        className={personalQuestions.celiac === false ? 'buttonAnswer focused' : 'buttonAnswer'}
                        onClick={()=> setPersonalQuestions({...personalQuestions, celiac: false})}>
                            No
                    </button>
            </QuestionGroup>
            <div className='line'></div>
            <QuestionGroup question='¿Tienes diabetes?'>
                    <button
                        className={personalQuestions.diabetes === true ? 'buttonAnswer focused' : 'buttonAnswer'}
                        onClick={()=> setPersonalQuestions({...personalQuestions, diabetes: true})}>
                            Sí
                    </button>
                    <button 
                        className={personalQuestions.diabetes === false ? 'buttonAnswer focused' : 'buttonAnswer'}
                        onClick={()=> setPersonalQuestions({...personalQuestions, diabetes: false})}>
                            No
                    </button>
            </QuestionGroup>
            {personalQuestions.diabetes === true &&
                <QuestionGroup question='¿Qué tipo de diabetes?'>
                    <select onChange={(e)=> setPersonalQuestions({...personalQuestions, diabetesType: e.target.value})}>
                        <option defaultValue=''>- Seleccionar -</option>
                        <option value='Tipo 1'>Tipo 1</option>
                        <option value='Tipo 2'>Tipo 2</option>
                    </select>
                 </QuestionGroup> 
            }
            <div className='line'></div>
            <QuestionGroup question='¿Tienes hipertensión?'>
                    <button
                        className={personalQuestions.hypertension === true ? 'buttonAnswer focused' : 'buttonAnswer'}
                        onClick={()=> setPersonalQuestions({...personalQuestions, hypertension: true})}>
                            Sí
                    </button>
                    <button 
                        className={personalQuestions.hypertension === false ? 'buttonAnswer focused' : 'buttonAnswer'}
                        onClick={()=> setPersonalQuestions({...personalQuestions, hypertension: false})}>
                            No
                    </button>
            </QuestionGroup>
            <div className='line'></div>
            <QuestionGroup question='¿Tienes algun tipo de tiroides?'>
                    <button
                        className={personalQuestions.thyroid === true ? 'buttonAnswer focused' : 'buttonAnswer'}
                        onClick={()=> setPersonalQuestions({...personalQuestions, thyroid: true})}>
                            Sí
                    </button>
                    <button 
                        className={personalQuestions.thyroid === false ? 'buttonAnswer focused' : 'buttonAnswer'}
                        onClick={()=> setPersonalQuestions({...personalQuestions, thyroid: false})}>
                            No
                    </button>
            </QuestionGroup>
            {personalQuestions.thyroid === true &&
                <QuestionGroup question='¿Qué tipo?'>
                    <select onChange={(e)=> setPersonalQuestions({...personalQuestions, thyroidType: e.target.value})}>
                        <option defaultValue=''>- Seleccionar -</option>
                        <option value='Hipertiroidismo'>Hipertiroidismo</option>
                        <option value='Hipotiroidismo'>Hipotiroidismo</option>
                    </select>
                 </QuestionGroup> 
            }
            <section className='action__buttons'>
                <button className='btnBackwards'
                    onClick={() => history.goBack()}
                >
                    Anterior
                </button>
                <button 
                    onClick={nextPage} 
                    className={activeButton ? 'btnNext foward' : 'btnNext'}
                >
                    Siguiente
                </button>
            </section>
        </section>
    )
}

export default AnotherConditions;
