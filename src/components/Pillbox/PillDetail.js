import React from 'react'
import { useSelector, useDispatch } from "react-redux"
import DayTimeSelector from "./Components/DayTimeSelector"
import HoursSelector from "./Components/HoursSelector"

export default function PillDetail({handleSaveReminder}) {
    const { personalizedShifts, reminderToEdit} = useSelector(state => state.pillbox)
    const dispatch = useDispatch()

    const editReminder = (field, value) => {
        dispatch({type: "SET_NEW_REMINDER", payload: {...reminderToEdit, [field]: value}})
    }
    
    return (
        <div className='modalContent__container'>
                        <h4 className='modal__title'>Recordatorio</h4>
                        <div className='inputText__container'>
                            <p>Medicina: </p>
                            <input className="form-control" type="text" name="" id="" defaultValue={reminderToEdit?.medicine} onChange={(e) => editReminder("medicine", e.target.value)}/>
                        </div>
                        <hr className="separator"/>
                        <div className='inputDate__container'>
                            <label>Fecha inicial:</label>
                            <input className="form-control" type="date" name="" id="" defaultValue={reminderToEdit?.initial_date} onChange={(e) => editReminder("initial_date", e.target.value)}/>
                        </div>
                        <div className='inputNumber__container'>
                            <label>Cantidad:</label>
                            <input className="form-control" type="number" name="" id="" defaultValue={reminderToEdit?.dose} onChange={(e) => editReminder("dose", e.target.value)}/>
                        </div>
                        <div className='inputNumber__container'>
                            <label>Días:</label>
                            <input className="form-control" type="number" name="" id="" defaultValue={reminderToEdit?.quantity_days} onChange={(e) => editReminder("quantity_days", e.target.value)}/>
                        </div>
                        <div className='inputFreq__container'>
                            <label>Frecuencia:</label>
                            <select className="form-control" defaultValue={reminderToEdit?.personalized? "personalized": "every_day"} 
                            onChange={(e) => {
                            if(e.target.value === "personalized") {
                                dispatch({type: "SET_PERSONALIZED_SHIFTS", payload:true})
                                editReminder("personalized", true)
                            } else {
                                dispatch({type: "SET_PERSONALIZED_SHIFTS", payload:false})
                                editReminder("personalized", false)
                            }}}>
                                <option value="every_day">Todos los dias</option>
                                <option value="personalized">Horarios personalizados</option>
                            </select>
                        </div>

                        {!personalizedShifts &&
                        <div>
                            <HoursSelector medicine={reminderToEdit?.medicine} defaultValues={!reminderToEdit?.personalized ? reminderToEdit?.reminders?.mon: false}/>
                        </div>}

                        {personalizedShifts &&
                        <div>
                            <DayTimeSelector medicine={reminderToEdit?.medicine} defaultValues={reminderToEdit?.personalized ? reminderToEdit?.reminders: false}/>
                        </div>}

                        <button
                            className='save__button btn-blue-lg btn'
                            onClick={() => handleSaveReminder(true)}
                            >
                            Guardar
                        </button>
                    </div>
    )
}
