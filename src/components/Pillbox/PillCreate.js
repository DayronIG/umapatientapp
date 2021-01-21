import React, {useRef} from 'react'
import { useSelector, useDispatch } from "react-redux"
import { AiOutlineClose, AiOutlineUpload } from 'react-icons/ai'
import DayTimeSelector from "./Components/DayTimeSelector"
import HoursSelector from "./Components/HoursSelector"
import { IconContext } from "react-icons";

export default function PillCreate({handleSaveReminder}) {
    const { personalizedShifts, newReminder } = useSelector(state => state.pillbox)
    const dispatch = useDispatch()
    const fileRef = useRef()

    const uploadFile = () => {
        fileRef.current.click()
    }

    return (
        <div className='createContent__container'>
            <div className='pillCreate__header'>
                <p className='content'>Nuevo recordatorio</p>
                <AiOutlineClose className='icon' onClick={()=>dispatch({type: "SET_RENDER_STATE", payload:"LIST"})}/>
            </div>
        <div className='pillForm'>
        <div className='inputText__container' onClick={() => uploadFile()}>
            <input ref={fileRef} type="file" name="" id="" style={{display: 'none'}}/>
            <label>Suba una foto de su medicamento (opcional) </label>
            <AiOutlineUpload className='uploadIcon'/>
            <input readOnly placeholder='Seleccione un archivo' className="form-control" type="text" name="" id=""/>
        </div>
        <div className='inputText__container'>
            <label>Medicamento </label>
            <input placeholder='Nombre (Ej: Ibuprofeno 600)' className="form-control" type="text" name="" id="" onChange={(e) => dispatch({type: "SET_NEW_REMINDER", payload:{...newReminder, medicine: e.target.value}})}/>
        </div>
        <div className='inputText__container'>
            <label>Formato </label>
            <select placeholder='Selecciona una opción' className="form-control" name="" id="" onChange={(e) => dispatch({type: "SET_NEW_REMINDER", payload:{...newReminder, format: e.target.value}})}>
                <option>Comprimido</option>
                <option>Pastilla</option>
            </select>
        </div>
        <div className='inputText__container'>
            <label>Fecha de inicio</label>
            <input className="form-control" type="date" name="" id="" onChange={(e) => dispatch({type: "SET_NEW_REMINDER", payload:{...newReminder, initial_date: e.target.value}})}/>
        </div>
        <div className='inputText__container'>
            <label>Fecha de fin (opcional)</label>
            <input className="form-control" type="date" name="" id="" onChange={(e) => dispatch({type: "SET_NEW_REMINDER", payload:{...newReminder, initial_date: e.target.value}})}/>
        </div>
        <div className='inputText__container'>
            <label>Dosis</label>
            <input className="form-control" placeholder='2 por día' type="number" name="" id="" onChange={(e) => dispatch({type: "SET_NEW_REMINDER",payload:{...newReminder, dose: e.target.value}})}/>
        </div>

        <div className='inputText__container'>
            <label>Configure los días y horarios en los que debe tomar su medicación</label>
        </div>

        <div>
            <HoursSelector value={!personalizedShifts} medicine={newReminder.medicine}/>
        </div>

        <hr className='separator'/>

        <div>
            <DayTimeSelector value={personalizedShifts} medicine={newReminder.medicine}/>
        </div>

        <div className='inputText__container'>
            <label>Stock</label>
            <input placeholder='Cantidad en stock' className="form-control" type="number" name="" id="" onChange={(e) => dispatch({type: "SET_NEW_REMINDER",payload:{...newReminder, dose: e.target.value}})}/>
        </div>
        <div className='inputText__container'>
            <label>Observaciones</label>
            <textarea className="form-control observations" placeholder='Tomar una cucharada antes de la comida, en ayunas, etc.' type="number" name="" id="" onChange={(e) => dispatch({type: "SET_NEW_REMINDER",payload:{...newReminder, dose: e.target.value}})}/>
        </div>
        <button
            className='save__button btn-blue-lg btn'
            onClick={() => handleSaveReminder(false)}
            >
            Crear recordatorio
        </button>
    </div>
    </div>
    )
}
