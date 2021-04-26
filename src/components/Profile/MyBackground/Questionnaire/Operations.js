import React, { useEffect, useState, Fragment } from 'react'
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { QuestionGroup, OperationsTraumatismQuestions } from '../QuestionGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const Operations =()=> {
    const patient = useSelector(state => state.user)
    const history = useHistory()
    const dispatch = useDispatch()
    const userHistory = useSelector(state => state.userHistory)
    const [addList, setAddList] = useState([])
    const [activeButton, setActiveButton] = useState(false)
    const [personalQuestions, setPersonalQuestions] = useState({
        operations: null, 
    })

    const nextPage = () => {
        window.scroll(0, 0);
        if(activeButton) {
            const previousData = JSON.parse(localStorage.getItem('userHistory'));
            let data = {
                ...previousData,
                operations: userHistory.operations,
                operationsType: userHistory.operationsType
            }
            localStorage.setItem('userHistory', JSON.stringify(data));
            history.push(`/antecedents/${patient.id}/fracture`)
        }
    }

    useEffect(() => {
        if(personalQuestions.operations !== null) {
            dispatch({type: 'USER_HISTORY_OPERATIONS', payload: personalQuestions.operations})
            setActiveButton(true)
        }
    }, [personalQuestions])

    const onAddForm =()=> {
        let lengthItems = userHistory.operationsType.length 
        setAddList(addList.concat(<OperationsTraumatismQuestions id={lengthItems} section='operacion'/>))
    }

    return (
        <section className='contentQuestionnaire'>
            <h3>Antecedentes personales</h3>
            <QuestionGroup question='¿Te has operado alguna vez?'>
                <button
                    className={personalQuestions.operations === true ? 'buttonAnswer focused' : 'buttonAnswer'}
                    onClick={()=>{setPersonalQuestions({...personalQuestions, operations: true})}}>
                        Sí
                </button>
                <button 
                    className={personalQuestions.operations === false ? 'buttonAnswer focused' : 'buttonAnswer'}
                    onClick={()=> setPersonalQuestions({...personalQuestions, operations: false})}>
                        No
                </button>
            </QuestionGroup>
            {personalQuestions.operations === true &&
                <Fragment>
                    <section className='questionGroup'>
                        <OperationsTraumatismQuestions id={userHistory.operationsType.length} section='operacion'/>
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
            <section className='action__buttons'>
                <button className='btnBackwards'
                    onClick={() => history.goBack()}
                >
                    Anterior
                </button>
                <button 
                    onClick={nextPage} 
                    className={activeButton ? 'btnNext foward' : 'btnNext' }
                >
                    Siguiente
                </button>
            </section>
        </section>
    )
}

export default Operations;
