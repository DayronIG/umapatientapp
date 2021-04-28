import React, { useEffect, useState, Fragment } from 'react'
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { QuestionGroup, OperationsTraumatismQuestions } from '../QuestionGroup';

const Fractures = () => {
    const patient = useSelector(state => state.user)
    const history = useHistory()
    const dispatch = useDispatch()
    const userHistory = useSelector(state => state.userHistory)
    const [activeButton, setActiveButton] = useState(false)
    const [addList, setaddList] = useState([])
    const [personalQuestions, setPersonalQuestions] = useState({
        fractures: null,
        otherTraumatism: null,
        otherTraumatismType: '',
    })

    const nextPage = () => {
        window.scroll(0, 0);
        if(activeButton) {
            const previousData = JSON.parse(localStorage.getItem('userHistory'));
            let data = {
                ...previousData,
                fractures: userHistory.fractures,
                fracturesType: userHistory.fracturesType,
                otherTraumatism: userHistory.otherTraumatism,
                otherTraumatismType: userHistory.otherTraumatismType
            }
            localStorage.setItem('userHistory', JSON.stringify(data));
            history.push(`/antecedents/${patient.id}/otherconditions`)
        }
    }

    useEffect(() => {
        if(personalQuestions.fractures !== null 
        && personalQuestions.otherTraumatism !== null) {
            dispatch({type:'USER_HISTORY_FRACTURE', payload: personalQuestions.fractures})
            dispatch({type:'USER_HISTORY_OTHER_TRAUMATISM', payload: personalQuestions.otherTraumatism})
            dispatch({type:'USER_HISTORY_OTHER_TRAUMATISM_TYPE', payload: personalQuestions.otherTraumatismType})
            setActiveButton(true)
        }
    }, [personalQuestions])

    const onAddForm =()=> {
        let lengthItems = userHistory.fracturesType.length
        setaddList(addList.concat(<OperationsTraumatismQuestions id={lengthItems} section='fractura'/>))
    }

    return(
        <section className='contentQuestionnaire'>
            <h3>Antecedentes personales</h3>
            <QuestionGroup question='¿Te has fracturado alguna vez?'>
                <button
                    className={personalQuestions.fractures === true ? 'buttonAnswer focused' : 'buttonAnswer'}
                    onClick={()=> setPersonalQuestions({...personalQuestions, fractures: true})}>
                        Sí
                </button>
                <button 
                    className={personalQuestions.fractures === false ? 'buttonAnswer focused' : 'buttonAnswer'}
                    onClick={()=> setPersonalQuestions({...personalQuestions, fractures: false})}>
                        No
                </button>
            </QuestionGroup>
            {personalQuestions.fractures === true &&
                <Fragment>
                    <section className='questionGroup'>
                        <OperationsTraumatismQuestions id={userHistory.fracturesType.length} section='fractura'/>
                        {addList}
                    </section>
                    <div className='addForm'>
                        <button className='addGroup' onClick={onAddForm}>
                            <FontAwesomeIcon icon={faPlus}/>
                        </button>
                        <p className='text'>Añadir</p>
                    </div>
                </Fragment>
            }
            <div className='line'></div>
            <QuestionGroup question='¿Has sufrido de algun otro traumatismo?'>
                <button
                    className={personalQuestions.otherTraumatism === true ? 'buttonAnswer focused' : 'buttonAnswer'}
                    onClick={()=> setPersonalQuestions({...personalQuestions, otherTraumatism: true})}>
                        Sí
                </button>
                <button 
                    className={personalQuestions.otherTraumatism === false ? 'buttonAnswer focused' : 'buttonAnswer'}
                    onClick={()=> setPersonalQuestions({...personalQuestions, otherTraumatism: false})}>
                        No
                </button>
            </QuestionGroup>
                {personalQuestions.otherTraumatism === true && 
                    <Fragment>
                        <input 
                        className='other__input' 
                        id='otro' 
                        type='text' 
                        onChange={(e)=> setPersonalQuestions({...personalQuestions, otherTraumatismType: e.target.value})}/>
                    </Fragment>
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

export default Fractures;