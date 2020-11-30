import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from "react-router-dom"
import Modal from "../GeneralComponents/Modal/MobileModal"
import "../../styles/pillbox/pillbox.scss"
import { FiTrash, FiEdit3 } from "react-icons/fi"
import { BsClock } from "react-icons/bs"
import { FaPills, FaPlus, FaMinus } from "react-icons/fa"
import { MdToday } from "react-icons/md"
import { BackButton } from '../GeneralComponents/Headers';
import DB from '../../config/DBConnection';
import DayTimeSelector from "./Components/DayTimeSelector"
import HoursSelector from "./Components/HoursSelector"
import swal from 'sweetalert';

const format = 'HH:mm';

const Pillbox = props => {
    const [reminderModal, setReminderModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [reminderToEdit, setReminderToEdit] = useState({});
    const history = useHistory()
    const uid = "UH0QnNl14nVlq0xtqd3hpB0dAws1"
    // const [recipes, setRecipes] = useState([])
    const [personalizedShifts, setPersonalizedShifts] = useState(false)
    const [isValid, setIsValid] = useState("")
    const shiftsToPost = useSelector(state => state.pillbox.shiftsToPost)
    const [newReminder, setNewReminder] = useState(
        {
            uid: "",
            dose: 0,
            frequency_hours: 0,
            quantity_weeks: 0,
            medicine: "",
            notify: true,
            initial_date: "",
            active: false,
            reminders: {
                mon: [],
                tue: [],
                wed: [],
                thu: [],
                fri: [],
                sat: [],
                sun: []
            }
        }
    )
    const [recipes, setRecipes] = useState([{
        uid: "",
        dose: 1,
        frequency_hours: 3,
        quantity_weeks: 5,
        medicine: "AMOXIDAL",
        notify: true,
        initial_date: "2020-12-12",
        active: true,
        personalized: false,
        reminders: {
            mon: ["09:00", "12:00"],
            tue: ["9:00"],
            wed: ["9:00"],
            thu: ["9:00"],
            fri: ["9:00"],
            sat: ["9:00"],
            sun: ["9:00"]
        }
    },
    {
        uid: "",
        dose: 1,
        frequency_hours: 3,
        quantity_weeks: 5,
        medicine: "IBUPIRAC",
        notify: true,
        initial_date: "2020-12-12",
        active: false,
        personalized: true,
        reminders: {
            mon: ["9:00", "20:00"],
            tue: [],
            wed: ["8:00"],
            thu: ["20:00"],
            fri: ["20:00"],
            sat: ["9:00"],
            sun: ["8:00"]
        }
    }
    ])

    // const setRecipesFromFirebase = async () => {
    //     const recipesQuery = await DB
    //     .firestore()
    //     .collection(`/services/reminders/${uid}`)
    //     .get();
    //     console.log(recipesQuery)
    //     setRecipes(recipesQuery)
    // }

    // useEffect(() => {
    //     setRecipesFromFirebase()
    // }, [])

    const postReminder = () => {
        console.log(newReminder)
    }

    useEffect(() => {
        if(shiftsToPost?.medicine){
            if(!shiftsToPost?.personalized){
                setNewReminder({...newReminder, reminders: {
                mon: shiftsToPost.shifts,
                tue: shiftsToPost.shifts,
                wed: shiftsToPost.shifts,
                thu: shiftsToPost.shifts,
                fri: shiftsToPost.shifts,
                sat: shiftsToPost.shifts,
                sun: shiftsToPost.shifts,
            }})
            } else if (shiftsToPost?.personalized) {
                setNewReminder({...newReminder, reminders: shiftsToPost.shifts})
            }
        }
    }, [shiftsToPost])
    
    useEffect(() => {
        if(!(!!newReminder.medicine)){setIsValid("Medicina")}
        else if(!(!!newReminder.initial_date)){setIsValid("Fecha inicial")}
        else if(!(!!newReminder.quantity_weeks)){setIsValid("Semanas")}
        else { setIsValid("") }
        // if(!newReminder.medicine || !newReminder.initial_date || !newReminder.quantity_weeks || !newReminder.reminders){
        //     setIsValid(false)
        // } else {
        //     setIsValid(true)
        // }

    }, [newReminder])

    const handleSaveReminder = () => {
        if(!isValid){
            postReminder()
            deleteReminder(reminderToEdit)
            setRecipes([...recipes, {...newReminder, personalized: personalizedShifts}])
            setReminderModal(false)
            setEditModal(false)
            setReminderToEdit({})
            setNewReminder({})
        } else {
            swal("Error",`Debe completar ${isValid}`)
        }
    }

    const deleteReminder = (recipe) => {
        var filteredRecipes = recipes.filter((el)=> el !== recipe)
        setRecipes(filteredRecipes)
    }

    const editReminder = (field, value) => {
        setNewReminder({...reminderToEdit, [field]: value})
    }

    const recipesList = () => {
        const recipeList = [];
        let sortedRecipes = recipes.sort((a, b) =>{return a.medicine > b.medicine})
        for(let recipe of sortedRecipes) {
            recipeList.push(
                <div className='recipesList__container' key={recipe.medicine || Math.random()}>
                    <div className='recipesListIndicator__container'>
                        <label className='item_medicine'>{recipe.medicine}</label>
                        <label className='item'><BsClock className="element_icon" />{recipe.personalized? "Horarios personalizados": "Todos los dias"}</label>
                        <label className='item'><MdToday className="element_icon" />{recipe.quantity_weeks} días restantes</label>
                        <label className='item'><FaPills className="element_icon" />Quedan {recipe.dose} / Reponer</label>
                    </div>
                    <div className='recipesListEditDelete__container'
                    onClick={() => deleteReminder(recipe)}>
                    <FiEdit3 className="edit__icon"
                    onClick={() => {
                            setEditModal(true)
                            setReminderToEdit(recipe)
                            setNewReminder(recipe)
                    }}/>
                    <FiTrash className="delete__icon"/>
                    </div>
                </div>
            )
        }
        return recipeList
    }

    useEffect(() => {
        setPersonalizedShifts(reminderToEdit?.personalized)
    }, [reminderToEdit])

    return (
        <div className="pillbox">
        <BackButton inlineButton={true} action={()=>history.push(`/`)} />
        {reminderModal && <Modal
          callback={() => {
              setReminderModal(false)
              setNewReminder({})
            }}>
            <div className='modalContent__container'>
                        <h4 className='modal__title'>Recordatorio</h4>
                        <div className='inputText__container'>
                            <p>Medicina: </p>
                            <input className="form-control" type="text" name="" id="" onChange={(e) => setNewReminder({...newReminder, medicine: e.target.value})}/>
                        </div>
                        <hr className="separator"/>
                        <div className='inputDate__container'>
                            <label>Fecha inicial:</label>
                            <input className="form-control" type="date" name="" id="" onChange={(e) => setNewReminder({...newReminder, initial_date: e.target.value})}/>
                        </div>
                        <div className='inputNumber__container'>
                            <label>Cantidad:</label>
                            <input className="form-control" defaultValue={1} type="number" name="" id="" onChange={(e) => setNewReminder({...newReminder, dose: e.target.value})}/>
                        </div>
                        <div className='inputNumber__container'>
                            <label>Semanas:</label>
                            <input className="form-control" type="number" name="" id="" onChange={(e) => setNewReminder({...newReminder, quantity_weeks: e.target.value})}/>
                        </div>
                        <div className='inputFreq__container'>
                            <label>Frecuencia:</label>
                            <select className="form-control" onChange={(e) => e.target.value === "personalized"? setPersonalizedShifts(true): setPersonalizedShifts(false)}>
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
                            onClick={() => handleSaveReminder()}
                            >
                            Guardar
                        </button>
                    </div>
            </Modal>}
            {editModal && <Modal
                callback={() => {
                    setEditModal(false)
                    setReminderToEdit("")
                    setNewReminder({})
                    handleSaveReminder()
                    }}>
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
                            <label>Semanas:</label>
                            <input className="form-control" type="number" name="" id="" defaultValue={reminderToEdit?.quantity_weeks} onChange={(e) => editReminder("quantity_weeks", e.target.value)}/>
                        </div>
                        <div className='inputFreq__container'>
                            <label>Frecuencia:</label>
                            <select className="form-control" defaultValue={reminderToEdit?.personalized? "personalized": "every_day"} onChange={(e) => e.target.value === "personalized"? setPersonalizedShifts(true): setPersonalizedShifts(false)}>
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

                        {/* <button
                            className='save__button btn-blue-lg btn'
                            onClick={() => handleSaveReminder()}
                            >
                            Guardar
                        </button> */}
                    </div>
            </Modal>}
            <div className=''>
                <h2 className="pillbox__title">Pillbox</h2>
                <div className='pillboxList__container'>
                    <div className='pillboxReminder__header'>
                        <div className=''>
                            Recordatorios
                        </div>
                    </div>
                    {recipesList()}
                </div>
                </div>
                <div className="pillbox__addContainer"
                onClick={() => setReminderModal(true)}>
              <label
                className="pillbox__btnContainer">
                <button className="pillbox__addBtn">+</button>
                <label className="pillbox__addMsg">Agregar recordatorio</label>
              </label>
            </div>
            </div>
    )

}

export default Pillbox
