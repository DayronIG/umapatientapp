import React, {useState} from 'react'
import { useSelector, useDispatch } from "react-redux"
import defaultPillImage from "../../assets/img/pillbox/defaultPillImage.jpg"
import { BackButton } from '../GeneralComponents/Headers';
import MobileModal from '../GeneralComponents/Modal/MobileModal';
import {FaExclamationTriangle} from 'react-icons/fa'

export default function PillDetail({handleSaveReminder}) {
    const { personalizedShifts, reminderToEdit} = useSelector(state => state.pillbox)
    const [displayModalDelete, setDisplayModalDelete] = useState(false)
    const dispatch = useDispatch()

    const editReminder = (field, value) => {
        dispatch({type: "SET_NEW_REMINDER", payload: {...reminderToEdit, [field]: value}})
    }

    const deleteReminder = () => {

    }
    
    return (
        <>
        {console.log(displayModalDelete)}
        {displayModalDelete && 
        <MobileModal callback={() => setDisplayModalDelete(false)}>
            <div className='modalContent__container'>
                <FaExclamationTriangle className='icon' />
                <p>¿Estás seguro que deseas eliminar el recordatorio?</p>
                <button
                    className='delete__button btn-blue-lg btn'
                    onClick={() => deleteReminder()}
                    >
                    Eliminar
                </button>
            </div>
        </MobileModal>}
        <BackButton inlineButton={true} customTarget action={()=>dispatch({type: "SET_RENDER_STATE", payload:"LIST"})} />
        <div className='detailContent__container'>
            <div className='pillForm'>
                        <div className='image__container'>
                            <img className='pill_image' src={defaultPillImage} alt="defaultPill"/> 
                        </div>
                        <div className='inputText__container'>
                            <label>Medicina </label>
                            <input readOnly className="form-control" type="text" name="" id="" defaultValue={reminderToEdit?.medicine} onChange={(e) => editReminder("medicine", e.target.value)}/>
                        </div>
                        <div className='inputText__container'>
                            <label>Formato </label>
                            <input readOnly className="form-control" type="text" name="" id="" defaultValue={reminderToEdit?.format} onChange={(e) => editReminder("format", e.target.value)}/>
                        </div>
                        <div className='inputText__container'>
                            <label>Stock </label>
                            <div className='stockButton__container'>
                            <button className='stockButton'>Reponer</button>
                            </div>
                            <input readOnly className="form-control" type="text" name="" id="" defaultValue={reminderToEdit?.stock} onChange={(e) => editReminder("stock", e.target.value)}/>
                        </div>
                        <div className='inputText__container'>
                            <label>Fecha de inicio:</label>
                            <input readOnly className="form-control" type="date" name="" id="" defaultValue={reminderToEdit?.initial_date} onChange={(e) => editReminder("initial_date", e.target.value)}/>
                        </div>
                        <div className='inputText__container'>
                            <label>Cantidad:</label>
                            <input readOnly className="form-control" type="number" name="" id="" defaultValue={reminderToEdit?.dose} onChange={(e) => editReminder("dose", e.target.value)}/>
                        </div>
                        <div className='inputText__container'>
                            <label>Días:</label>
                            <input readOnly className="form-control" type="number" name="" id="" defaultValue={reminderToEdit?.quantity_days} onChange={(e) => editReminder("quantity_days", e.target.value)}/>
                        </div>
                        <div className='inputText__container'>
                            <label>Dosaje</label>
                            {/* <select className="form-control" defaultValue={reminderToEdit?.personalized? "personalized": "every_day"} 
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
                            </select> */}
                        </div>


                        {!personalizedShifts &&
                        <div className='doseDisplay'>
                            <p className='weekday'>Todos los dias</p>
                            <div className='hourlist'>
                                {reminderToEdit?.reminders?.mon.map(el => <p className='hour'>{el}</p>)}
                            </div>
                            {/* <HoursSelector medicine={reminderToEdit?.medicine} defaultValues={!reminderToEdit?.personalized ? reminderToEdit?.reminders?.mon: false}/> */}
                        </div>}

                        {personalizedShifts &&
                        <>
                            {Object.keys(reminderToEdit?.reminders).map(el =>
                                <div className='doseDisplay'>
                                    <p className='weekday'>{el}</p>
                                    <div className='hourlist'>
                                    {reminderToEdit?.reminders[el].map(hour => <p className='hour'>{hour}</p>)}
                                    </div>
                                    {/* <DayTimeSelector medicine={reminderToEdit?.medicine} defaultValues={reminderToEdit?.personalized ? reminderToEdit?.reminders: false}/> */}
                            </div>)}
                        </>
                        }

                        <div className='inputText__container'>
                            <label>Observaciones </label>
                            <input readOnly className="form-control" type="text" name="" id="" defaultValue={reminderToEdit?.obs} onChange={(e) => editReminder("obs", e.target.value)}/>
                        </div>

                        <button
                            className='save__button btn-blue-lg btn'
                            onClick={() => {
                                dispatch({type: "SET_NEW_REMINDER", payload: reminderToEdit})
                                dispatch({type: "SET_RENDER_STATE", payload:"CREATE"})
                                }}>
                            Editar
                        </button>

                        <button
                            className='delete__button btn-blue-lg btn'
                            onClick={() => setDisplayModalDelete(true)}
                            >
                            Eliminar
                        </button>
                        </div>
                    </div>
                    </>
    )
}
