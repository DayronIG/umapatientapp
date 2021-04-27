import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../../../styles/profile/antecedents.scss';

export const QuestionGroup = (props) => {
    return (
        <section className='questionGroup'>
            <p className='question'>{props.question}</p>
            <div className='answers'>
                {props.children}
            </div>
        </section>
    )
}

export const OperationsTraumatismQuestions = ({id, section, edit }) => {
    const [data, setData] = useState({id, section, type: '', age: '' })
    const [sectionTitle, setSectionTitle] = useState('')
    const dispatch = useDispatch()
    const userHistory = useSelector(state => state.userHistory)
    
    useEffect(() => {
        if(data.section === 'operacion' && data.type && data.age) {
            if (!userHistory.operationsType.length) {
                dispatch({ type: 'USER_HISTORY_OPERATIONS', payload: true })
                dispatch({ type: 'USER_HISTORY_OPERATIONS_TYPES', payload: [...userHistory.operationsType, {type: data.type, age: data.age}] })
            } else if (!userHistory.operationsType[parseInt(data.id)]) {
                dispatch({ type: 'USER_HISTORY_OPERATIONS_TYPES', payload: [...userHistory.operationsType, {type: data.type, age: data.age}] })
            } else {
                let newArr = [...userHistory.operationsType]
                newArr[parseInt(data.id)] = {type: data.type, age: data.age}
                dispatch({ type: 'USER_HISTORY_OPERATIONS_TYPES', payload: newArr })
            }
        }
        if(data.section === 'fractura' && data.type && data.age) {
            if (!userHistory.fracturesType.length) {
                dispatch({ type: 'USER_HISTORY_FRACTURE', payload: true })
                dispatch({ type: 'USER_HISTORY_FRACTURES_TYPES', payload: [...userHistory.fracturesType, {type: data.type, age: data.age}] })
            } else if (!userHistory.fracturesType[parseInt(data.id)]) {
                dispatch({ type: 'USER_HISTORY_FRACTURES_TYPES', payload: [...userHistory.fracturesType, {type: data.type, age: data.age}] })
            } else {
                let newArr = [...userHistory.fracturesType]
                newArr[parseInt(data.id)] = {type: data.type, age: data.age}
                dispatch({ type: 'USER_HISTORY_FRACTURES_TYPES', payload: newArr })
            }
        }
    }, [data])

    useEffect(() => {
        if (typeof section === 'string') {
            let upper = section.charAt(0).toUpperCase() + section.slice(1)
            return setSectionTitle(upper)
        }
    }, [])

    return(
        <section className='questionGroup'>
            {!edit && <h3>{sectionTitle}</h3>}
            <form className='operationQuestions'>
                <div className='group'>
                    <label>¿De qué fue la {section}?</label>
                    {!edit ?
                        <input name={section} onChange={(e)=> setData({...data, type: e.target.value})} />
                    :
                        <input name={section} onBlur={(e)=> setData({...data, type: e.target.value})} />
                    }
                </div>
                <div className='group'>
                    <label>¿A qué edad?</label>
                    {!edit ? 
                        <input type='number' name={section} onChange={(e)=> setData({...data, age: e.target.value})}/>
                    :
                        <input type='number' name={section} onBlur={(e)=> setData({...data, age: e.target.value})}/>
                    }
                </div>
            </form>
        </section>
    )
}

export const FamilyQuestions = ({ id, section }) => {
    const [data, setData] = useState({id, section, parent: '', type: ''})
    const dispatch = useDispatch()
    const userHistory = useSelector(state => state.userHistory)

    useEffect(() => {
        if(data.section === 'cancer' && data.parent && data.type) {
            if (!userHistory.familyCancerDetails.length) {
                dispatch({ type: 'USER_HISTORY_FAMILY_CANCER_DETAILS', payload: [...userHistory.familyCancerDetails, {parent: data.parent, type: data.type}] })
            } else if (!userHistory.familyCancerDetails[parseInt(data.id)]) {
                dispatch({ type: 'USER_HISTORY_FAMILY_CANCER_DETAILS', payload: [...userHistory.familyCancerDetails, {parent: data.parent, type: data.type}] })
            } else {
                let newArr = [...userHistory.familyCancerDetails]
                newArr[parseInt(data.id)] = {parent: data.parent, type: data.type}
                dispatch({ type: 'USER_HISTORY_FAMILY_CANCER_DETAILS', payload: newArr })
            }
        }
        
        if (data.section === 'diabetes' && data.parent && data.type) {
            if (!userHistory.familyDiabetesDetails.length) {
                dispatch({ type: 'USER_HISTORY_FAMILY_DIABETES_DETAILS', payload: [...userHistory.familyDiabetesDetails, {parent: data.parent, type: data.type}] })
            } else if (!userHistory.familyDiabetesDetails[parseInt(data.id)]) {
                dispatch({ type: 'USER_HISTORY_FAMILY_DIABETES_DETAILS', payload: [...userHistory.familyDiabetesDetails, {parent: data.parent, type: data.type}] })
            } else {
                let newArr = [...userHistory.familyDiabetesDetails]
                newArr[parseInt(data.id)] = {parent: data.parent, type: data.type}
                dispatch({ type: 'USER_HISTORY_FAMILY_DIABETES_DETAILS', payload: newArr })
            }
        }

        if (data.section === 'hipertension' && data.parent) {
            if (!userHistory.familyHypertensionDetails.length) {
                dispatch({ type: 'USER_HISTORY_FAMILY_HYPERTENSION_DETAILS', payload: [...userHistory.familyHypertensionDetails, data.parent] })
            } else if (!userHistory.familyHypertensionDetails[parseInt(data.id)]) {
                dispatch({ type: 'USER_HISTORY_FAMILY_HYPERTENSION_DETAILS', payload: [...userHistory.familyHypertensionDetails, data.parent] })
            } else { 
                let newArr = [...userHistory.familyHypertensionDetails]
                newArr[parseInt(data.id)] = data.parent 
                dispatch({ type: 'USER_HISTORY_FAMILY_HYPERTENSION_DETAILS', payload: newArr }) 
            }
        }
    }, [data])

    const family = [
        {id: 1, type: 'Madre'},
        {id: 2, type: 'Padre'},
        {id: 3, type: 'Abuela'},
        {id: 4, type: 'Abuelo'},
        {id: 5, type: 'Hermana'},
        {id: 6, type: 'Hermano'},
    ]

    const cancerType = [
        {id: 1, type: 'Pulmón'},
        {id: 2, type: 'Seno (mama)'},
        {id: 3, type: 'Páncreas'},
        {id: 4, type: 'Melanoma'},
        {id: 5, type: 'Prostata'},
        {id: 6, type: 'Leucemia'},
        {id: 7, type: 'Hígado'},
        {id: 8, type: 'Riñón'},
        {id: 9, type: 'Vejiga'},
        {id: 10, type: 'Tiroides'},
        {id: 11, type: 'Endometrio'},
    ]

    const diabetesType = [
        {id:1, type: 'Tipo 1'},
        {id:2, type: 'Tipo 2'}
    ]

    return(
        <section className='questionFamilyGroup'>
            <div className='options'>
                <label>Parentesco:</label>
                <select onChange={(e)=> setData({...data, parent: e.target.value})}>
                    <option defaultValue = ''>Seleccionar</option>
                    {family.map((item)=> <option key={item.id} value={item.type}>{item.type}</option>)}
                </select>
            </div>
            {section !== 'hipertension' &&                     
                <div className='options'>
                    <label>Tipo de {section}:</label>
                    <select onChange={(e)=> setData({...data, type: e.target.value})}>
                        <option defaultValue = ''>Seleccionar</option>
                        {
                            section === 'cancer' && cancerType.map((item)=> 
                            <option key={item.id} value={item.type}>{item.type}</option>)
                        }
                        {
                            section === 'diabetes' && diabetesType.map((item)=> 
                            <option key={item.id} value={item.type}>{item.type}</option>)
                        }
                    </select>
                </div>
            }
        </section>
    )
}
