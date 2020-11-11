import React from 'react'
import '../../styles/transport/registerFormComponents.scss'
import '../../styles/generalcomponents/ContinueButton.scss'
export const YesNoCheckbox = ({ title, id, cb }) => (
    <div className="checkboxsContainer">
        <label htmlFor="">
            {title}
        </label>
        <label htmlFor={`${id}Yes`}>Si</label>
        <input value='1' type="checkbox" id={`${id}Yes`} onChange={(e) => cb(e)} />
        <label htmlFor={`${id}No`}>No</label>
        <input value='0' type="checkbox" id={`${id}No`} onChange={(e) => cb(e)} />
    </div>
)

export const UploadImg = ({ title, id, cb }) => (
    <div className="uploadImgContainer">
        <label htmlFor={`${id}img`}>
            {title}
        </label>
        <input type="file" id={`${id}img`} onChange={(e) => cb(e)} />
    </div>
)

export const SelectRegister = ({ title, id, cb, options }) => (
    <div className="selectContainer">
        <label htmlFor={`${id}select`}>
            {title}
        </label>
        <select name={id} id={`${id}select`} onChange={(e) => cb(e)}>
            {options.length > 0 &&
                options.map((op) => <option value={op}>{op}</option>)
            }
        </select>
    </div>
)

export const InputRegister = ({ title, id, cb }) => (
    <div className="inputContainer">
        <label htmlFor={id}>{title}</label>
        <input name={id} type="number" id={id} onChange={(e) => cb(e)} />
    </div>
)

export const ContinueButton = ({ title, cb, type }) => {
    return (
        <div className="buttonContainer">
            <button onClick={() => cb()} type={type || ''} >
                {title}
            </button>
        </div>
    )
}