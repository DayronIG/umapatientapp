import React, { useEffect, useState, Fragment } from 'react'
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { NODE_SERVER } from '../../../../config/endpoints';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { QuestionGroup, FamilyQuestions } from '../QuestionGroup';
import axios from 'axios';

const FamilyBackground =()=> {
    const patient = useSelector(state => state.user)
    const history = useHistory()
    const dispatch = useDispatch()
    const { currentUser } = useSelector((state) => state.userActive)
    const userHistory = useSelector(state =>state.userHistory)
    const [addList, setAddList] = useState([])
    const [activeButton, setActiveButton] = useState(false)
    const [personalQuestions, setPersonalQuestions] = useState({
        familyCancer: null,
        familyDiabetes: null,
        familyHypertension: null,
        familyOtherDisease: '',
    })

    useEffect(() => {
        if( personalQuestions.familyCancer !== null &&
            personalQuestions.familyDiabetes !== null &&
            personalQuestions.familyHypertension !== null
        ){
            dispatch({type: 'USER_HISTORY_FAMILY_CANCER', payload: personalQuestions.familyCancer})
            dispatch({type: 'USER_HISTORY_FAMILY_DIABETES', payload: personalQuestions.familyDiabetes})
            dispatch({type: 'USER_HISTORY_FAMILY_HYPERTENSION', payload: personalQuestions.familyHypertension})
            dispatch({type: 'USER_HISTORY_FAMILY_OTHER_DISEASE', payload: personalQuestions.familyOtherDisease})
            dispatch({type: 'HISTORY_COMPLETED'})
            return setActiveButton(true);
        }
    }, [personalQuestions])

    useEffect(() => {
        const previousData = JSON.parse(localStorage.getItem('userHistory'));
        dispatch({type: 'GET_HISTORY', payload: previousData})
    }, [])

    const sendToStorage = () => {
        const previousData = JSON.parse(localStorage.getItem('userHistory'));
        let data = {
            ...previousData,
            familyCancer: userHistory.familyCancer,
            familyCancerDetails: userHistory.familyCancerDetails,
            familyDiabetes: userHistory.familyDiabetes,
            familyDiabetesDetails: userHistory.familyDiabetesDetails,
            familyHypertension: userHistory.familyHypertension,
            familyHypertensionDetails: userHistory.familyHypertensionDetails,
            otherDisease: userHistory.familyOtherDisease,
            completed: userHistory.completed
        }
        localStorage.setItem('userHistory', JSON.stringify(data));
    }

    const nextPage = async () => {
        window.scroll(0, 0);
        if (activeButton) {
			let data = {
                history: {
                    ...userHistory
                }
			};

            await currentUser.getIdToken().then(async token => {
				let headers = { 'Content-Type': 'Application/Json', 'Authorization': `Bearer ${token}` }
                await axios.post(`${NODE_SERVER}/history/self/${patient.core_id}`, data, {headers})
                    .then((res)=> {
                        sendToStorage()
                        history.push(`/signup/dataSaved`)
                    })
                    .catch((err) => {
                        console.error(err);
                    });
                });
        }else {
            console.error('No completó los datos');
        }
	};

    const onAddForm =(section)=> {
        let lengthItems
        if(section === 'cancer'){
            lengthItems = userHistory.familyCancerDetails.length 
        }
        if(section === 'diabetes') {
            lengthItems = userHistory.familyDiabetesDetails.length
        }
        if(section === 'hipertension') {
            lengthItems = userHistory.familyHypertensionDetails.length 
        }
        setAddList(addList.concat(<FamilyQuestions id={lengthItems} section={section} />))
    }


    return (
        <section className='contentQuestionnaire'>
            <QuestionGroup question='¿Alguien de tu familia tuvo o tiene cancer?'>
                <button
                    className={personalQuestions.familyCancer === true ? 'buttonAnswer focused' : 'buttonAnswer'}
                    onClick={()=> setPersonalQuestions({...personalQuestions, familyCancer: true})}>
                        Sí
                </button>
                <button 
                    className={personalQuestions.familyCancer === false ? 'buttonAnswer focused' : 'buttonAnswer'}
                    onClick={()=> setPersonalQuestions({...personalQuestions, familyCancer: false})}>
                        No
                </button>
            </QuestionGroup>
            {personalQuestions.familyCancer === true &&
                <Fragment>
                    <FamilyQuestions id={userHistory.familyCancerDetails.length} section='cancer' />
                    {addList.map(item => item.props.section === 'cancer' && item)}
                    <div className='addForm'>
                        <button className='addGroup' onClick={()=>onAddForm('cancer')}>
                            <FontAwesomeIcon icon={faPlus}/>
                        </button>
                        <p className='text'>Añadir</p>
                    </div>
                </Fragment>
            }
            <div className='line'></div>
            <QuestionGroup question='¿Alguien de tu familia tuvo o tiene diabetes?'>
                <button
                    className={personalQuestions.familyDiabetes === true ? 'buttonAnswer focused' : 'buttonAnswer'}
                    onClick={()=> setPersonalQuestions({...personalQuestions, familyDiabetes: true})}>
                        Sí
                </button>
                <button 
                    className={personalQuestions.familyDiabetes === false ? 'buttonAnswer focused' : 'buttonAnswer'}
                    onClick={()=> setPersonalQuestions({...personalQuestions, familyDiabetes: false})}>
                        No
                </button>
            </QuestionGroup>
            {personalQuestions.familyDiabetes === true &&
                <Fragment>
                    <FamilyQuestions id={userHistory.familyDiabetesDetails.length} section='diabetes' />
                    {addList.map(item => item.props.section === 'diabetes' && item)}
                    <div className='addForm'>
                        <button className='addGroup' onClick={()=>onAddForm('diabetes')}>
                            <FontAwesomeIcon icon={faPlus}/>
                        </button>
                        <p className='text'>Añadir</p>
                    </div>
                </Fragment>
            }
            <div className='line'></div>
            <QuestionGroup question='¿Alguien de tu familia tuvo o tiene hipertension?'>
                    <button
                        className={personalQuestions.familyHypertension === true ? 'buttonAnswer focused' : 'buttonAnswer'}
                        onClick={()=> setPersonalQuestions({...personalQuestions, familyHypertension: true})}>
                            Sí
                    </button>
                    <button 
                        className={personalQuestions.familyHypertension === false ? 'buttonAnswer focused' : 'buttonAnswer'}
                        onClick={()=> setPersonalQuestions({...personalQuestions, familyHypertension: false})}>
                            No
                    </button>
            </QuestionGroup>
            {personalQuestions.familyHypertension === true &&
                <Fragment>
                    <FamilyQuestions id={userHistory.familyHypertensionDetails.length} section='hipertension' />
                    {addList.map(item => item.props.section === 'hipertension' && item)}
                    <div className='addForm'>
                        <button className='addGroup' onClick={()=>onAddForm('hipertension')}>
                            <FontAwesomeIcon icon={faPlus}/>
                        </button>
                        <p className='text'>Añadir</p>
                    </div>
                </Fragment>
            }
            <div className='line'></div>
            <Fragment>
                <label className='other__condition'>¿Algún otro antecedente familiar que desees mencionar?</label>
                <input 
                    className='other__input' 
                    type='text' 
                    onChange={(e)=> setPersonalQuestions({...personalQuestions, familyOtherDisease: e.target.value})}
               />
            </Fragment>
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

export default FamilyBackground;
