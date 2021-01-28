import React, {useState} from 'react'
import { useSelector, useDispatch } from "react-redux"
import defaultPillImage from "../../assets/img/pillbox/defaultPillImage.jpg"
import { BackButton } from '../GeneralComponents/Headers';
import MobileModal from '../GeneralComponents/Modal/MobileModal';
import {FaExclamationTriangle} from 'react-icons/fa'

export default function PillDetail({handleSaveReminder}) {
    const { personalizedShifts, reminderToEdit} = useSelector(state => state.pillbox)
    const { ws } = useSelector(state => state.user)
    const [displayModalDelete, setDisplayModalDelete] = useState(false)
    const dispatch = useDispatch()

    const editReminder = (field, value) => {
        dispatch({type: "SET_NEW_REMINDER", payload: {...reminderToEdit, [field]: value}})
    }

    const deleteReminder = () => {

    }

    const renderDay = (day) => {
        switch(day){
            case('mon'):
                return 'Lunes'
            case('tue'):
                return 'Martes'
            case('wed'):
                return 'Miércoles'
            case('thu'):
                return 'Jueves'
            case('fri'):
                return 'Viernes'
            case('sat'):
                return 'Sábado'
            case('sun'):
                return 'Domingo'
            default:
                break
            }
    }
    
    return (
        <>
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
        <BackButton inlineButton={true} customTarget={ws} action={()=>dispatch({type: "SET_RENDER_STATE", payload:"LIST"})} />
        <div className='detailContent__container'>
            <div className='pillForm'>
                        <div className='image__container'>
                            <img className='pill_image' src={reminderToEdit?.imagePath || defaultPillImage} alt="defaultPill"/> 
                        </div>
                        <div className='inputText__container'>
                            <label>Medicina </label>
                            <input readOnly className="form-control" type="text" name="" id="" defaultValue={reminderToEdit?.medicine} onChange={(e) => editReminder("medicine", e.target.value)}/>
                        </div>
                        <div className='inputText__container'>
                            <label>Formato </label>
                            <input readOnly className="form-control" type="text" name="" id="" defaultValue={reminderToEdit?.format} onChange={(e) => editReminder("format", e.target.value)}/>
                        </div>
                        <div className='inputText__container stockButtonInput_container'>
                            <label>Stock </label>
                            <div className='stockButton__container'>
                                <button className='stockButton'>Reponer</button>
                            </div>
                            <input readOnly className="form-control stockInput" type="text" name="" id="" defaultValue={reminderToEdit?.stock} onChange={(e) => editReminder("stock", e.target.value)}/>
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
                        </div>

                        {!personalizedShifts &&
                        <div className='doseDisplay'>
                            <p className='weekday'>Todos los dias</p>
                            <div className='hourlist'>
                                {reminderToEdit?.reminders?.mon.map((el, i) => {
                                if(!!el && el.length > 0){
                                    console.log(el, "el")
                                    return <p className='hour' key={i}>{el}</p>
                                }}
                                )}
                            </div>
                        </div>}

                        {personalizedShifts &&
                        <>
                            {Object.keys(reminderToEdit?.reminders).map((el, i) =>{
                                if(!!reminderToEdit?.reminders[el] && reminderToEdit?.reminders[el].length > 0){
                                return  <div className='doseDisplay' key={i}>
                                            <p className='weekday'>{renderDay(el)}</p>
                                            <div className='hourlist'>
                                                {reminderToEdit?.reminders[el].map(((hour, index) => <p className='hour' key={index}>{hour}</p>))}
                                            </div>
                                        </div>
                                }})
                            }
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
                                dispatch({type: "SET_IS_EDITION", payload: true})
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
