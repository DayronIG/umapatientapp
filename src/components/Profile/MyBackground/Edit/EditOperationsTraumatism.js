import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { OperationsTraumatismQuestions } from '../QuestionGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export const EditOperations = ({ updateData }) => {
    const dispatch = useDispatch()
    const userHistory = useSelector((state) => state.userHistory)
    const [addList, setAddList] = useState([])
    
    const deleteItem = (index) => {
        let property = [...userHistory.operationsType]
        property.splice(index, 1)
        dispatch({type:'USER_HISTORY_OPERATIONS_TYPES', payload: property})
    }

    const onAddForm = () => {
        let lengthItems = userHistory.operationsType.length 
        setAddList(addList.concat(<OperationsTraumatismQuestions id={lengthItems} section='operacion' edit />))
    }

    return(
        <div className='edit__items'>
            {userHistory.operationsType.length > 0 && userHistory.operationsType.map((item, index)=> {
                return (
                    <div key={index} className='operation__traumatism'>
                        <p>{item.type}</p>
                        <p>A los {item.age} años</p>
                        <FontAwesomeIcon icon={faTimes} onClick={()=> deleteItem(index)}/>
                    </div>
                )
            })}
            {addList}
            <button className='other__btn' onClick={onAddForm}>Añadir</button>
            <button className='edit__saveData' onClick={updateData}>Guardar</button>
        </div>
    )
}

export const EditFractures = ({ updateData }) => {
    const dispatch = useDispatch()
    const userHistory = useSelector((state) => state.userHistory)
    const [addList, setAddList] = useState([])

    const deleteItem = (index) => {
        let property = [...userHistory.fracturesType]
        property.splice(index, 1)
        dispatch({type:'USER_HISTORY_FRACTURES_TYPES', payload: property})
    }

    const onAddForm = () => {
        let lengthItems = userHistory.fracturesType.length 
        setAddList(addList.concat(<OperationsTraumatismQuestions id={lengthItems} section='fractura' edit/>))
    }

    return(
        <div className='edit__items'>
            {userHistory.fracturesType.length > 0 && userHistory.fracturesType.map((item, index)=> {
                return (
                    <div>
                        <div key={index} className='operation__traumatism'>
                            <p>{item.type}</p>
                            <p>A los {item.age} años </p>
                            <FontAwesomeIcon icon={faTimes} onClick={()=> deleteItem(index)}/>
                        </div>
                    </div>
                )
            })}
            {addList}
            <div>
                <button className='other__btn' onClick={onAddForm}>Añadir</button>
            </div>
            <button className='edit__saveData' onClick={updateData}>Guardar</button>
        </div>
    )
}
