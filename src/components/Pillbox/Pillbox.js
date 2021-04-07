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
import DB, {firebaseInitializeApp} from '../../config/DBConnection';
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
    const { core_id } = useSelector(state => state.user)
    const [isValid, setIsValid] = useState("")
    const { newReminder, personalizedShifts, shiftsToPost, reminderToEdit, reminderToEditIndex, recipes, renderState} = useSelector(state => state.pillbox)
	const token = useSelector(state => state.userActive.token)

    const setRecipesFromFirebase = () => {
        dispatch({type: "SET_LOADING_REMINDERS", payload: true})
        DB
        .firestore(firebaseInitializeApp)
        .collection(`/user/${core_id}/pillbox`)
        .get()
        .then((snapshot) => {
            const arrOfRecipies = []
			snapshot.forEach((doc) => {
                arrOfRecipies.push({...doc.data(), pillbox_id: doc.id})
            });
            dispatch({type: "SET_RECIPES_REMINDERS", payload: arrOfRecipies})
            dispatch({type: "SET_ORIGINAL_RECIPES", payload: arrOfRecipies})
            dispatch({type: "SET_LOADING_REMINDERS", payload: false})
        });
    }

    const postReminder = () => {
        axios.post("http://localhost:8080/pillbox/reminder", {...newReminder, uid: core_id}, { headers: {'Content-Type': 'Application/Json', "Authorization": `${token}`}})
    }

    const updateReminder = () => {
        axios.patch("http://localhost:8080/pillbox/reminder",{...newReminder, uid: core_id}, { headers: {'Content-Type': 'Application/Json', "Authorization": `${token}`}})
    }
    
    const deleteReminderDB = (recipe) => {
        axios.post("http://localhost:8080/pillbox/reminder/delete",{core_id: core_id, pillbox_id: recipe.pillbox_id},{ headers: {'Content-Type': 'Application/Json', "Authorization": `${token}`}})
    }

    useEffect(() => {
        if(shiftsToPost?.medicine){
            // if(!shiftsToPost?.personalized){
            //     dispatch({type: "SET_NEW_REMINDER", 
            //     payload: {...newReminder, reminders: {
            //     mon: shiftsToPost.shifts,
            //     tue: shiftsToPost.shifts,
            //     wed: shiftsToPost.shifts,
            //     thu: shiftsToPost.shifts,
            //     fri: shiftsToPost.shifts,
            //     sat: shiftsToPost.shifts,
            //     sun: shiftsToPost.shifts,
            // }}})
            // } else if (shiftsToPost?.personalized) {
                console.log(shiftsToPost.shifts, "aquí")
                dispatch({type: "SET_NEW_REMINDER", payload:{...newReminder, personalized: shiftsToPost?.personalized, reminders: shiftsToPost.shifts}})
            // }
        }
    }, [shiftsToPost])
    
    useEffect(() => {
        if(!(!!newReminder.medicine)){setIsValid("Medicina")}
        else if(!(!!newReminder.initial_date)){setIsValid("Fecha inicial")}
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
                recipes.push(newReminder)
            }
            dispatch({type: "SET_REMINDER_TO_EDIT", payload: {}})
            // setReminderToEdit({})
            deleteReminderFront(reminderToEdit)
            dispatch({type: "SET_NEW_REMINDER", payload: {}})
            dispatch({type: "SET_RENDER_STATE", payload: 'LIST'})
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
                return <PillList setRecipesFromFirebase={setRecipesFromFirebase} />
            case 'DETAIL':
                return <PillDetail deleteReminderDB={deleteReminderDB} />
            case 'CREATE':
                return <PillCreate handleSaveReminder={handleSaveReminder} />
            default:
                console.log("default")
        }
    }

    return (
        <div className="pillbox">
        {renderContent()}
        </div>
    )

}

export default Pillbox
