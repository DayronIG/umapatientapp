import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GenericSelect } from './GenericSelect';

export const EditAnotherConditions = ({ updateData }) => {
    const dispatch = useDispatch()
	const userHistory = useSelector((state) => state.userHistory)

    const [edit, setEdit] = useState({
        celiac: userHistory.celiac,
        diabetes: userHistory.diabetes,
        diabetesType: userHistory.diabetesType,
        hypertension: userHistory.hypertension, 
        thyroid: userHistory.thyroid,
        thyroidType: userHistory.thyroidType
    }) 
    
    const saveData = (edit) => {
        dispatch({type: 'USER_HISTORY_CELIAC', payload: edit.celiac})
        dispatch({type: 'USER_HISTORY_DIABETES', payload: edit.diabetes})
        dispatch({type: 'USER_HISTORY_DIABETES_TYPE', payload: edit.diabetesType})
        dispatch({type: 'USER_HISTORY_HYPERTENSION', payload: edit.hypertension})
        dispatch({type: 'USER_HISTORY_THYROID', payload: edit.thyroid})
        dispatch({type: 'USER_HISTORY_THYROID_TYPE', payload: edit.thyroidType})
        dispatch({type: 'USER_HISTORY_EDIT', payload: true})
    }

    useEffect(() => {
        if(userHistory.edit) {
            updateData()
        }
    }, [userHistory.edit])

    return(
        <div className='edit__personalQuestions'>
            <GenericSelect 
                question='¿Eres celiaco?' 
                defaultValue={edit.celiac} 
                action={data => setEdit({...edit, celiac: data})}
            />
            <GenericSelect 
                question='¿Tienes diabetes?'
                defaultValue={edit.diabetes}
                action={data => setEdit({...edit, diabetes: data})}
            />
            <label>Tipo de diabetes</label>
            <select 
                className='edit__select'
                disabled={edit.diabetes ? false : true}
                onChange={e => setEdit({...edit, diabetesType: e.target.value})}>						
                <option defaultValue={edit.diabetesType}> Seleccionar</option>
                <option value='Tipo 1'>Tipo 1</option>
                <option value='Tipo 2'>Tipo 2</option>
            </select>
            <GenericSelect 
                question='¿Tienes hipertensión?'
                defaultValue={edit.hypertension}
                action={data => setEdit({...edit, hypertension: data})}
            />
            <GenericSelect 
                question='¿Tienes tiroides?'
                defaultValue={edit.thyroid}
                action={data => setEdit({...edit, thyroid: data})}
            />
            <label>Tipo de tiroides</label>
            <select 
                className='edit__select'
                disabled={edit.thyroid ? false : true}
                onChange={e => setEdit({...edit, thyroidType: e.target.value})}>
                <option defaultValue = {edit.thyroidType}>Seleccionar</option>
                <option value='Hipertiroidismo'>Hipertiroidismo</option>
                <option value='Hipotiroidismo'>Hipotiroidismo</option>
            </select>
            <button 
                className='edit__saveData' 
                onClick={()=>saveData(edit)}>
                    Guardar
                </button>
        </div>
    )
}
