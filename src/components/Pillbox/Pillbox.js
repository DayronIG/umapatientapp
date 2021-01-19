import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom"
import Modal from "../GeneralComponents/Modal/MobileModal"
import "../../styles/pillbox/pillbox.scss"
import { FiTrash, FiEdit3 } from "react-icons/fi"
import { FaPills, FaPlus, FaMinus } from "react-icons/fa"
import { BsClock } from "react-icons/bs"
import { MdToday } from "react-icons/md"
import { BackButton } from '../GeneralComponents/Headers';
import DB from '../../config/DBConnection';
import DayTimeSelector from "./Components/DayTimeSelector"
import HoursSelector from "./Components/HoursSelector"
import swal from 'sweetalert';
import axios from "axios"
import moment from "moment"
import PillList from "./PillList"
import PillDetail from "./PillDetail"
import PillCreate from "./PillCreate"

const format = 'HH:mm';

const Pillbox = props => {
    const dispatch = useDispatch()
    const history = useHistory()
    const [reminderModal, setReminderModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const { core_id } = useSelector(state => state.user)
    const [isValid, setIsValid] = useState("")
    const { newReminder, personalizedShifts, shiftsToPost, reminderToEdit, reminderToEditIndex, recipes, renderState} = useSelector(state => state.pillbox)
	const token = useSelector(state => state.userActive.token)

    const setRecipesFromFirebase = () => {
        DB
        .firestore()
        .collection(`/user/${core_id}/pillbox`)
        .get()
        .then((snapshot) => {
            const arrOfRecipies = []
			snapshot.forEach((doc) => {
                arrOfRecipies.push({...doc.data(), pillbox_id: doc.id})
            });
            dispatch({type: "SET_RECIPES_REMINDERS", payload: arrOfRecipies})
        });
    }

    const postReminder = () => {
        axios.post("http://localhost:8080/pillbox/reminder",newReminder,{ headers: {'Content-Type': 'Application/Json', "Authorization": `${token}`}})
    }

    const updateReminder = () => {
        axios.patch("http://localhost:8080/pillbox/reminder",newReminder,{ headers: {'Content-Type': 'Application/Json', "Authorization": `${token}`}})
    }
    
    const deleteReminderDB = (recipe) => {
        axios.post("http://localhost:8080/pillbox/reminder/delete",{core_id: core_id, pillbox_id: recipe.pillbox_id},{ headers: {'Content-Type': 'Application/Json', "Authorization": `${token}`}})
    }

    useEffect(() => {
        if(shiftsToPost?.medicine){
            if(!shiftsToPost?.personalized){
                dispatch({type: "SET_NEW_REMINDER", 
                payload: {...newReminder, reminders: {
                mon: shiftsToPost.shifts,
                tue: shiftsToPost.shifts,
                wed: shiftsToPost.shifts,
                thu: shiftsToPost.shifts,
                fri: shiftsToPost.shifts,
                sat: shiftsToPost.shifts,
                sun: shiftsToPost.shifts,
            }}})
            } else if (shiftsToPost?.personalized) {
                dispatch({type: "SET_NEW_REMINDER", payload:{...newReminder, reminders: shiftsToPost.shifts}})
            }
        }
    }, [shiftsToPost])
    
    useEffect(() => {
        if(!(!!newReminder.medicine)){setIsValid("Medicina")}
        else if(!(!!newReminder.initial_date)){setIsValid("Fecha inicial")}
        else if(!(!!newReminder.quantity_days)){setIsValid("Días")}
        else if(!(!!newReminder.dose)){setIsValid("Cantidad")}
        else { setIsValid("") }
    }, [newReminder])

    const handleSaveReminder = (edit) => {
        if(!isValid){
            if(edit){
                updateReminder()
                let updatedRecipes = recipes
                updatedRecipes[reminderToEditIndex] = newReminder
                dispatch({type: "SET_RECIPES_REMINDERS", payload: updatedRecipes})
            } else {
                postReminder()
                // let updatedRecipes = [...recipes, newReminder] 
                // setRecipes(updatedRecipes)
                // dispatch({type: "SET_RECIPES_REMINDERS", payload: updatedRecipes})
                recipes.push(newReminder)
            }
            setEditModal(false)
            setReminderModal(false)
            dispatch({type: "SET_REMINDER_TO_EDIT", payload: {}})
            // setReminderToEdit({})
            deleteReminderFront(reminderToEdit)
            dispatch({type: "SET_NEW_REMINDER", payload: {}})
        } else {
            swal("Error",`Debe completar ${isValid}`, 'warning')
        }
    }

    const deleteReminderFront = (recipe) => {
        var filteredRecipes = recipes.filter((el)=> el !== recipe)
        dispatch({type: "SET_RECIPES_REMINDERS", payload: filteredRecipes})
    }

    useEffect(() => {
        if(core_id){setRecipesFromFirebase()}
    }, [core_id])

    useEffect(() => {
        dispatch({type: "SET_PERSONALIZED_SHIFTS", payload: reminderToEdit?.personalized})
    }, [])

    const renderContent = () => {
        switch(renderState){
            case 'LIST':
                return <PillList />
            case 'DETAIL':
                return <PillDetail handleSaveReminder={handleSaveReminder} />
            case 'CREATE':
                return <PillCreate handleSaveReminder={handleSaveReminder} />
            default:
                console.log("default")
        }
    }

    return (
        <div className="pillbox">
        {reminderModal && <Modal
          callback={() => {
              setReminderModal(false)
              dispatch({type: "SET_NEW_REMINDER", payload: {}})

            }}>
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
            </Modal>}
        {renderContent()}
        </div>
    )

}

export default Pillbox
