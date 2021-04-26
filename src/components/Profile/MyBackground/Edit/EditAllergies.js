import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export const EditAllergies = ({ updateData }) => {
    const dispatch = useDispatch()
	const userHistory = useSelector((state) => state.userHistory)
    const [addAllergy, setAddAllergy] = useState('')

    const deleteItem = (item) => {
        const allergiesRemove = userHistory.allergyType
        let newArr = []
        newArr = allergiesRemove.filter(current => current !== item)
        dispatch({type:'USER_HISTORY_ALLERGY_TYPE', payload: newArr})
    }

    const addItem = () => { 
        const prevAllergies = userHistory.allergyType
        dispatch({type:'USER_HISTORY_ALLERGY_TYPE', payload: [...prevAllergies, addAllergy]})
    }

    return(
        <div className='edit__allergies'>
            {userHistory.allergyType.length > 0 && userHistory.allergyType.map((item, index)=>{
                return (
                    <div key={index} className='allergies'>
                        <p >{item}</p>
                        <FontAwesomeIcon icon={faTimes} onClick={()=> deleteItem(item)}/>
                    </div>
                )
            })}
            <div className='edit__add'>
                <input className='edit__other' type='text' onChange={e=> setAddAllergy(e.target.value)}/>
                <button className='edit__other__btn' onClick={addItem}>Añadir</button>
            </div>
            <button className='edit__saveData' onClick={updateData}>Guardar</button>
        </div>
    )
}