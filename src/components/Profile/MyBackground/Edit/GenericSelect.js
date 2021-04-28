import React from 'react';

export const GenericSelect = ({ question, defaultValue, items, action = () => {} }) => {
    return(
        <div className='edit__genericSelect'>
            <label>{question}</label>
            {!items && 				
                <select 
                className='edit__select' 
                defaultValue={defaultValue === true ? 'Si' : 'No'} 
                onClick={e => action(e.target.value === 'Si' ? true : false) }>
                    <option value='Si'>Sí</option>
                    <option value='No'>No</option>
                </select>
            }
        </div>
    )
}