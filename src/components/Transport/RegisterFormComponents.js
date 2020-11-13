import React from 'react'
import '../../styles/transport/registerFormComponents.scss'
import '../../styles/generalcomponents/ContinueButton.scss'
export const YesNoCheckbox = ({ title, id, cb }) => (
    <div className="checkboxsContainer">
        <label className="checkboxsContainer_label" htmlFor="label">
            {title}
        </label>
        <span className="checkboxsContainer_cheboxContainer">
        <input value='1' name={id} type="radio" id={`${id}Yes`} onChange={(e) => cb(e)} />
        <label htmlFor={`${id}Yes`}>Si</label></span>
        <span className="checkboxsContainer_cheboxContainer">
        <input value='0' name={id} type="radio" id={`${id}No`} onChange={(e) => cb(e)} />
        <label htmlFor={`${id}No`}>No</label></span>
    </div>
)

export const UploadImg = ({ title, id, cb, previewImage }) => (
    <div className="uploadImgContainer">
        <label htmlFor={`${id}img`}>
            {title}
        </label>
        <span className="uploadImgContainer_fileContainer">
            { previewImage ? <img className="imagePreview" src={previewImage}/> : null}
        
             <div className="uploadImgContainer_uploadTextCont">
        <i className="fas fa-file-upload"></i>
        <p>{ previewImage ? 'Cambiar Foto ': 'Subir Foto' }</p>
</div> 
       
        
        <input type="file" id={`${id}img`} onChange={(e) => cb(e.target.files[0], id)} />
        </span>
    </div>
)

export const SelectRegister = ({ title, id, cb, options }) => (
    <div className="selectContainer">
        <label className="selectContainer_label" htmlFor={`${id}select`}>
            {title}
        </label>
        <select className="selectContainer_input" name={id} id={`${id}select`} onChange={(e) => cb(e)}>
            <option defaultValue="-">-</option>
            {options.length > 0 &&
            options.map((op, i) => <option key={i} value={op}>{op}</option>)
            }
        </select>
    </div>
)



export const InputRegister = ({ title, id, cb }) => (
    <div className="inputContainer">
        <label className="inputContainer_label" htmlFor={id}>{title}</label>
        <input className="inputContainer_input" name={id} type="text" id={id} onChange={(e) => cb(e)} />
    </div>
)

export const ContinueButton = ({ title, cb, type }) => {
    return (
        <div className="buttonContainer buttonFinailzar">
            <button onClick={() => cb()} type={type || ''} >
                {title}
            </button>
        </div>
    )
}