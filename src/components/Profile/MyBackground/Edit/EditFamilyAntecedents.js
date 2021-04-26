import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FamilyQuestions } from '../QuestionGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export const EditFamilyAntecedents = ({ updateData }) => {
    const dispatch = useDispatch()
    const userHistory = useSelector((state) => state.userHistory)
    const [addList, setAddList] = useState([])

    const onAddForm = (section) => {
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
        setAddList(addList.concat(<FamilyQuestions id={lengthItems} section={section}/>))
    }

    const deleteItem = (index, section) => {
        if(section === 'cancer') {
            let property = userHistory.familyCancerDetails
            property.splice(index, 1)
            dispatch({type:'USER_HISTORY_FAMILY_CANCER_DETAILS', payload: property})
        }
        if(section === 'diabetes') {
            let property = userHistory.familyDiabetesDetails
             property.splice(index, 1)
            dispatch({type:'USER_HISTORY_FAMILY_DIABETES_DETAILS', payload: property})
        }
        if(section === 'hypertension') {
            let property = userHistory.familyHypertensionDetails
            property.splice(index, 1)
            dispatch({type:'USER_HISTORY_FAMILY_HYPERTENSION_DETAILS', payload: property})
        }
    }

    return(
        <div className='edit__familyDetails'>
            <div>
                <h2 className='familyDetails__title'>Antecedentes familiares de cáncer</h2>
                {userHistory.familyCancerDetails.length > 0 && 
                    userHistory.familyCancerDetails.map((item, index)=>{
                        return (
                            <div key={index} className='familyDetails'>
                                <p>{item.parent}</p>
                                <p>{item.type}</p>
                            <FontAwesomeIcon icon={faTimes} onClick={()=> deleteItem(index, 'cancer')}/>
                        </div>
                    )
                })}
                {addList.map(item => item.props.section === 'cancer' && item)}
                <button className='other__btn' onClick={()=> onAddForm('cancer')}>Añadir</button>
            </div>
            <div>
                <h2 className='familyDetails__title'>Antecedentes familiares de diabetes</h2>
                {userHistory.familyDiabetesDetails.length > 0 && 
                    userHistory.familyDiabetesDetails.map((item, index)=>{
                        return (
                            <div key={index} className='familyDetails'>
                                <p>{item.parent}</p>
                                <p>{item.type}</p>
                            <FontAwesomeIcon icon={faTimes} onClick={()=> deleteItem(index, 'diabetes')}/>
                        </div>
                    )
                })}
                {addList.map(item => item.props.section === 'diabetes' && item)}
                <button className='other__btn' onClick={()=> onAddForm('diabetes')}>Añadir</button>
            </div>
            <div>
                <h2 className='familyDetails__title'>Antecedentes familiares de hipertensión</h2>
                {userHistory.familyHypertensionDetails.length > 0 && 
                    userHistory.familyHypertensionDetails.map((item, index)=>{
                        return (
                            <div key={index} className='familyDetails'>
                                <p className='parent'>{item}</p>
                                <FontAwesomeIcon icon={faTimes} onClick={()=> deleteItem(index, 'hypertension')}/>
                            </div>
                    )
                })}
                {addList.map(item => item.props.section === 'hipertension' && item)}
                <button className='other__btn' onClick={()=> onAddForm('hipertension')}>Añadir</button>
            </div>
            <button className='edit__saveData' onClick={updateData}>Guardar</button>
        </div>	
    )
}
