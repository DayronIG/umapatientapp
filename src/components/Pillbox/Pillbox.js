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

const format = 'HH:mm';

const Pillbox = props => {
    const [reminderModal, setReminderModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [reminderToEdit, setReminderToEdit] = useState({});
    const history = useHistory()
    const uid = "UH0QnNl14nVlq0xtqd3hpB0dAws1"
    // const [recipes, setRecipes] = useState([])
    const [personalizedShifts, setPersonalizedShifts] = useState(false)
    const [shiftsNumber, setShiftsNumber] = useState(1)
    const [hoursNumber, setHoursNumber] = useState(1)
    const [newReminder, setNewReminder] = useState(
        {
            uid: "",
            dose: 0,
            frequency_hours: 0,
            quantity_days: 0,
            medicine: "",
            notify: true,
            initial_date: "",
            final_date: "",
            active: false
        }
    )

    const [recipes, setRecipes] = useState([{
        uid: "",
        dose: 1,
        frequency_hours: 3,
        quantity_days: 5,
        medicine: "AMOXIDAL",
        notify: true,
        initial_date: "2020-12-12",
        active: true
    },
    {
        uid: "",
        dose: 1,
        frequency_hours: 3,
        quantity_days: 5,
        medicine: "IBUPIRAC",
        notify: true,
        initial_date: "2020-12-12",
        active: false
    }])

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

    const handleSaveReminder = () => {
        deleteReminder(reminderToEdit)
        setRecipes([...recipes, newReminder])
        setReminderModal(false)
        setEditModal(false)
        setReminderToEdit({})
        setNewReminder({})
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
                        <span className='item_medicine'>{recipe.medicine}</span>
                        <span className='item'><BsClock className="element_icon" />9:00 todos los dias</span>
                        <span className='item'><MdToday className="element_icon" />{recipe.quantity_days} días restantes</span>
                        <span className='item'><FaPills className="element_icon" />Quedan 3 / Reponer</span>
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
                            <input type="text" name="" id="" onChange={(e) => setNewReminder({...newReminder, medicine: e.target.value})}/>
                        </div>
                        <hr className="separator"/>
                        <div className='inputDate__container'>
                            <span>Fecha inicial:</span>
                            <input type="date" name="" id="" onChange={(e) => setNewReminder({...newReminder, initial_date: e.target.value})}/>
                        </div>
                        <div className='inputNumber__container'>
                            <span>Cantidad:</span>
                            <input type="number" name="" id="" onChange={(e) => setNewReminder({...newReminder, treatment: {quantity: e.target.value}})}/>
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
                                <HoursSelector quantity={hoursNumber} />
                                <div className="add-pill-shift-icon">
                                <FaPlus className="add-icon" onClick={()=>setHoursNumber(hoursNumber + 1)}/>
                                <FaMinus className="minus-icon" onClick={()=>setHoursNumber(hoursNumber - 1)}/>
                            </div>
                        </div>}
                            
                        {personalizedShifts && 
                        <div>
                            <DayTimeSelector quantity={shiftsNumber} />
                            <div className="add-pill-shift-icon">
                                <FaPlus className="add-icon" onClick={()=>setShiftsNumber(shiftsNumber + 1)}/>
                                <FaMinus className="minus-icon" onClick={()=>setShiftsNumber(shiftsNumber - 1)}/>
                            </div>
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
                            <input type="text" name="" id="" defaultValue={reminderToEdit?.medicine} onChange={(e) => editReminder("medicine", e.target.value)}/>
                        </div>
                        <hr className="separator"/>
                        <div className='inputDate__container'>
                            <span>Fecha inicial:</span>
                            <input type="date" name="" id="" onChange={(e) => editReminder("initial_date", e.target.value)}/>
                        </div>
                        <div className='inputTime__container'>
                            <span>Hora inicial:</span>
                            <input type="datetime" name="" id="" />
                        </div>
                        <div className='inputNumber__container'>
                            <span>Cantidad:</span>
                            <input type="number" name="" id="" onChange={(e) => editReminder("quantity_days", e.target.value)}/>
                        </div>
                        <button
                            className='save__button btn-blue-lg btn'
                            onClick={() => handleSaveReminder()} 
                            >
                            Guardar
                        </button>
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
              <span 
                className="pillbox__btnContainer">
                <button className="pillbox__addBtn">+</button>
                <span className="pillbox__addMsg">Agregar recordatorio</span>
              </span>
            </div>
            </div>
    )

}

export default Pillbox
