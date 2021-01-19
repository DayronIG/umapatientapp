import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FaPills } from "react-icons/fa"
import { BsClock } from "react-icons/bs"
import { MdToday } from "react-icons/md"
import moment from "moment"
import { useHistory } from "react-router-dom"
import { BackButton } from '../GeneralComponents/Headers';
import defaultPillImage from "../../assets/img/pillbox/defaultPillImage.jpg"

export default function PillList({editStatus}) {
    const dispatch = useDispatch()
    const { newReminder, shiftsToPost, reminderToEdit, reminderToEditIndex, recipes} = useSelector(state => state.pillbox)
    const history = useHistory()

    const recipesList = () => {
        const recipeList = [];
        let sortedRecipes = recipes.sort((a, b) =>{return a.medicine > b.medicine})
        for(let recipe of sortedRecipes) {
            recipeList.push(
                <div className='recipesList__container' key={recipe.medicine || Math.random()} 
                onClick={() => {
                    dispatch({type: "SET_REMINDER_TO_EDIT", payload: recipe})
                    dispatch({type: "SET_NEW_REMINDER", payload: recipe})
                    dispatch({type: "SET_REMINDER_TO_EDIT_INDEX", payload: recipes.indexOf(recipe)})
                    dispatch({type: "SET_PERSONALIZED_SHIFTS", payload: recipe.personalized})
                    dispatch({type: "SET_RENDER_STATE", payload:"DETAIL"})
                }}>
                    <img className='pill_image' src={defaultPillImage} alt="defaultPill"/> 
                    <div className='recipesListIndicator__container'>
                        <label className='item_medicine'>{recipe.medicine}</label>
                        <label className='item'><BsClock className="element_icon" />{recipe.personalized? "Horarios personalizados": `${recipe.dose} todos los dias`}</label>
                        <label className='item'><MdToday className="element_icon" />{recipe.quantity_days} días restantes</label>
                        <label className='item'><FaPills className="element_icon" />Quedan {recipe.dose} / Reponer</label>
                    </div>
                    {/* <div className='recipesListEditDelete__container'>
                    <FiEdit3 className="edit__icon"
                    onClick={() => {
                            setEditModal(true)
                            setPersonalizedShifts(recipe.personalized)
                            setReminderToEdit(recipe)
                            setNewReminder(recipe)
                            setReminderToEditIndex(recipes.indexOf(recipe))
                    }}/>
                    <FiTrash className="delete__icon"
                    onClick={() =>{
                        deleteReminderDB(recipe)
                        deleteReminderFront(recipe)}}/>
                    </div> */}
                </div>
            )
        }
        return recipeList
    }

    return (
        <div>
        <BackButton inlineButton={true} action={()=>history.push(`/`)} />
        <div>
            <div className="filterByTime__container">
            <p className="clicked">TODOS</p>
            <p>MAÑANA</p>
            <p>TARDE</p>
            <p>NOCHE</p>
            <p>MADRUGADA</p>
        </div>
            <div className='pillListContainer'>
                <div className="dateTitle">Hoy, 20 de noviembre</div>
                <div className="progressTitle">Progreso diario</div>
                <div className="progressContainer">
                    <progress className="progressBar" value="40" max="100" />
                    <p className="progressText"><p className="blue">2/5</p> tomadas</p>
                </div>
                <div className='pillboxList__container'>
                    <div className='pillboxReminder__header'>
                        <div className=''>
                            {moment().format("hh:mm")}
                        </div>
                    </div>
                    <hr/>
                        {recipes.length > 0 ?
                        recipesList():
                        <div className="spinner__container">
                            <div className="spinner-border text-primary" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>}
                </div>
            </div>
            <div className="pillbox__addContainer" onClick={() => dispatch({type: "SET_RENDER_STATE", payload:"CREATE"})}>
                <label className="pillbox__btnContainer">
                    <button className="pillbox__addBtn"><p>+</p></button>
                </label>
            </div>
        </div>
        </div>
    )
}
