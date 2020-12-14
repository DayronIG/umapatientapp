import React from 'react'
import { useSelector, useDispatch } from "react-redux"
import DayTimeSelector from "./Components/DayTimeSelector"
import HoursSelector from "./Components/HoursSelector"

export default function PillCreate({handleSaveReminder}) {
    const { personalizedShifts, newReminder } = useSelector(state => state.pillbox)
    const dispatch = useDispatch()

    return (
        <div className='modalContent__container'>
        <h4 className='modal__title'>Recordatorio</h4>
        <div className='inputText__container'>
            <p>Medicina: </p>
            <input className="form-control" type="text" name="" id="" onChange={(e) => dispatch({type: "SET_NEW_REMINDER", payload:{...newReminder, medicine: e.target.value}})}/>
        </div>
        <hr className="separator"/>
        <div className='inputDate__container'>
            <label>Fecha inicial:</label>
            <input className="form-control" type="date" name="" id="" onChange={(e) => dispatch({type: "SET_NEW_REMINDER", payload:{...newReminder, initial_date: e.target.value}})}/>
        </div>
        <div className='inputNumber__container'>
            <label>Cantidad:</label>
            <input className="form-control" type="number" name="" id="" onChange={(e) => dispatch({type: "SET_NEW_REMINDER",payload:{...newReminder, dose: e.target.value}})}/>
        </div>
        <div className='inputNumber__container'>
            <label>Días:</label>
            <input className="form-control" type="number" name="" id="" onChange={(e) => dispatch({type: "SET_NEW_REMINDER",payload:{...newReminder, quantity_days: e.target.value}})}/>
        </div>
        <div className='inputFreq__container'>
            <label>Frecuencia:</label>
            <select className="form-control" onChange={(e) => e.target.value === "personalized"? dispatch({type: "SET_PERSONALIZED_SHIFTS", payload:true}): dispatch({type: "SET_PERSONALIZED_SHIFTS", payload:false})}>
                <option value="every_day">Todos los dias</option>
                <option value="personalized">Horarios personalizados</option>
            </select>
        </div>

        {!personalizedShifts &&
        <div>
            <HoursSelector medicine={newReminder.medicine}/>
        </div>}

        {personalizedShifts &&
        <div>
            <DayTimeSelector medicine={newReminder.medicine}/>
        </div>}

        <button
            className='save__button btn-blue-lg btn'
            onClick={() => handleSaveReminder(false)}
            >
            Guardar
        </button>
    </div>
    )
}
