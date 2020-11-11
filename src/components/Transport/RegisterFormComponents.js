import React from 'react'

export const YesNoCheckbox = ({ title, id, cb }) => {
    <>
        <label htmlFor="">
            {title}
        </label>
        <label htmlFor={`${id}Yes`}>Si</label>
        <input type="checkbox" id={`${id}Yes`} onChange={(e) => cb(e)} />
        <label htmlFor={`${id}No`}>No</label>
        <input type="checkbox" id={`${id}No`} onChange={(e) => cb(e)} />
    </>
}