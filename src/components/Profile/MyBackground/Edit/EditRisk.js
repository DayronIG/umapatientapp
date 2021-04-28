import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GenericSelect } from './GenericSelect';

export const EditRisk = ({ updateData }) => {
    const dispatch = useDispatch()
    const userHistory = useSelector((state) => state.userHistory)
    const [edit, setEdit] = useState({
        smoke: userHistory.smoke,
        alcohol: userHistory.alcohol,
        alcoholFrequency: userHistory.alcoholFrequency 
    })
    
    const saveData = (edit) => {
        dispatch({type: 'USER_HISTORY_SMOKE', payload: edit.smoke})
        dispatch({type: 'USER_HISTORY_ALCOHOL', payload: edit.alcohol})
        dispatch({type: 'USER_HISTORY_ALCOHOL_FREQUENCY', payload: edit.alcoholFrequency})
        dispatch({type: 'USER_HISTORY_EDIT', payload: true})
    }

    useEffect(() => {
        if(userHistory.edit) {
            updateData()
        }
    }, [userHistory.edit])

    return(
        <div className='edit__riskQuestions'>
            <GenericSelect question='¿Fumas?' 
                defaultValue={edit.smoke} 
                action={data => setEdit({...edit, smoke: data})}
            />
            <GenericSelect question='¿Bebes alcohol?'
                 defaultValue={edit.alcohol}
                action={data => setEdit({...edit, alcohol: data})}
            />
            <div className='alcoholFrequencySelect'>
                <label>Frecuencia con la que bebe</label>
                <select className='edit__select'
                    onChange={e => setEdit({...edit, alcoholFrequency: e.target.value})}>
                    <option defaultValue = {edit.alcoholFrequency}>Seleccionar</option>
                    <option value="Poco" >
                        Poco
                    </option>
                    <option value="Moderado" >
                        Moderado
                    </option>
                    <option value="Excesivo">
                        Excesivo
                    </option> 
                </select>
            </div>
            <button className='edit__saveData' onClick={()=>saveData(edit)}>Guardar</button>
        </div>
    )
}
