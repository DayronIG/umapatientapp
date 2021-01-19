import React from 'react'
import { useSelector, useDispatch } from "react-redux"
import { GrClose } from 'react-icons/gr'
import DayTimeSelector from "./Components/DayTimeSelector"
import HoursSelector from "./Components/HoursSelector"
import { IconContext } from "react-icons";

export default function PillCreate({handleSaveReminder}) {
    const { personalizedShifts, newReminder } = useSelector(state => state.pillbox)
    const dispatch = useDispatch()

    return (
        <div className='createContent__container'>
            <div className='pillCreate__header'>
                <p className='content'>Nuevo recordatorio</p>
                <GrClose className='icon' onClick={()=>dispatch({type: "SET_RENDER_STATE", payload:"LIST"})}/>
            </div>
        <div className='pillForm'>
        <div className='inputText__container'>
            <label>Suba una foto de su medicamento (opcional) </label>
            <input placeholder='Seleccione un archivo' className="form-control" type="text" name="" id="" onChange={(e) => dispatch({type: "SET_NEW_REMINDER", payload:{...newReminder, medicine: e.target.value}})}/>
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
            <label>Cantidad</label>
            <input className="form-control" type="number" name="" id="" onChange={(e) => dispatch({type: "SET_NEW_REMINDER",payload:{...newReminder, dose: e.target.value}})}/>
        </div>
        <div className='inputText__container'>
            <label>Frecuencia:</label>
            <select className="form-control" onChange={(e) => e.target.value === "personalized"? dispatch({type: "SET_PERSONALIZED_SHIFTS", payload:true}): dispatch({type: "SET_PERSONALIZED_SHIFTS", payload:false})}>
                <option value="every_day">Todos los dias</option>
                <option value="personalized">Horarios personalizados</option>
            </select>
        </div>

        <div className='inputText__container'>
            <label>Configure los días y horarios en los que debe tomar su medicación</label>
        </div>

        {/* {!personalizedShifts && */}
        <div>
            <HoursSelector value={!personalizedShifts} medicine={newReminder.medicine}/>
        </div>

        <hr className='separator'/>

        {/* {personalizedShifts && */}
        <div>
            <DayTimeSelector value={personalizedShifts} medicine={newReminder.medicine}/>
        </div>

        <div className='inputText__container'>
            <label>Stock</label>
            <input className="form-control" type="number" name="" id="" onChange={(e) => dispatch({type: "SET_NEW_REMINDER",payload:{...newReminder, dose: e.target.value}})}/>
        </div>
        <div className='inputText__container'>
            <label>Observaciones</label>
            <input className="form-control" type="number" name="" id="" onChange={(e) => dispatch({type: "SET_NEW_REMINDER",payload:{...newReminder, dose: e.target.value}})}/>
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
