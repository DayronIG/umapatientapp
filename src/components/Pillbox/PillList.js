import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FaPills } from "react-icons/fa"
import { BsClock } from "react-icons/bs"
import { MdToday } from "react-icons/md"
import moment from "moment"
import { useHistory } from "react-router-dom"
import { BackButton } from '../GeneralComponents/Headers';
import defaultPillImage from "../../assets/img/pillbox/defaultPillImage.jpg"

export default function PillList({ }) {
    const dispatch = useDispatch()
    const { filteredRecipes, loadingReminders, newReminder, shiftsToPost, reminderToEdit, reminderToEditIndex, recipes} = useSelector(state => state.pillbox)
    const history = useHistory()
    const [filterTime, setFilterTime] = useState('TODOS')
    const [renderRecipes, setRenderRecipes] = useState(null)

    const recipesList = useCallback(() => {
        const recipeList = [];
        let sortedRecipes = []
        if(filteredRecipes.length > 0){
            sortedRecipes = filteredRecipes.sort((a, b) =>{return a.medicine > b.medicine})
        } else {
            sortedRecipes = recipes.sort((a, b) =>{return a.medicine > b.medicine})
        }
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
                </div>
            )
        }
        return recipeList
    }, [recipes, filteredRecipes])

    useEffect(() => {
        setRenderRecipes(recipesList())
    }, [filteredRecipes, recipes, filterTime])

    const renderMonth = (month) => {
        switch(month){
            case('01'):
                return 'Enero'
            case('02'):
                return 'Febrero'
            case('03'):
                return 'Marzo'
            case('04'):
                return 'Abril'
            case('05'):
                return 'Mayo'
            case('06'):
                return 'Junio'
            case('07'):
                return 'Julio'
            case('08'):
                return 'Agosto'
            case('09'):
                return 'Septiembre'
            case('10'):
                return 'Octubre'
            case('11'):
                return 'Noviembre'
            case('12'):
                return 'Diciembre'
            default:
                break
            }
    }

    const filterByTime = (lowCut, highCut, isTodos=false) => {
        let filteredRecipesLocal = []
        if (!isTodos){
        recipes.map(recipe => {
            let reminders = recipe.reminders
            Object.keys(reminders).map((day)=>{
                reminders[day].map(hour =>{
                    if(Number(hour.replace(':', '')) >= lowCut && Number(hour.replace(':', '')) < highCut){
                        if(!filteredRecipesLocal.includes(recipe)){
                            filteredRecipesLocal.push(recipe)
                        }
                    } 
                })
            })
        })} 
        dispatch({type: 'SET_FILTERED_RECIPES', payload: filteredRecipesLocal})
    }

    return (
        <div>
        <BackButton inlineButton={true} action={()=>history.push(`/`)} />
        <div>
            <div className="filterByTime__container">
            <p onClick={() =>{
                filterByTime(0, 2400, true)
                setFilterTime('TODOS')
                }} className={`${filterTime === 'TODOS' ? 'clicked':''}`}>TODOS</p>
            <p onClick={() =>{
                filterByTime(600, 1200)
                setFilterTime('MAÑANA')
                }} className={`${filterTime === 'MAÑANA' ? 'clicked':''}`}>MAÑANA</p>
            <p onClick={() =>{
                filterByTime(1200, 2000)
                setFilterTime('TARDE')
                }} className={`${filterTime === 'TARDE' ? 'clicked':''}`}>TARDE</p>
            <p onClick={() =>{
                filterByTime(2000, 2400)
                setFilterTime('NOCHE')
                }} className={`${filterTime === 'NOCHE' ? 'clicked':''}`}>NOCHE</p>
            <p onClick={() =>{
                filterByTime(100, 600)
                setFilterTime('MADRUGADA')
            }} className={`${filterTime === 'MADRUGADA' ? 'clicked':''}`}>MADRUGADA</p>
        </div>
            <div className='pillListContainer'>
                <div className="dateTitle">{`Hoy, ${moment().format('DD')} de ${renderMonth(moment().format('MM'))}`}</div>
                <div className="progressTitle">Progreso diario</div>
                <div className="progressContainer">
                    <progress className="progressBar" value="40" max="100" />
                    <p className="progressText"><span className="blue">2/5</span> tomadas</p>
                </div>
                <div className='pillboxList__container'>
                    <div className='pillboxReminder__header'>
                        <div className=''>
                            {moment().format("hh:mm")}
                        </div>
                    </div>
                    <hr/>
                        {!loadingReminders ?
                        renderRecipes:
                        <div className="spinner__container">
                            <div className="spinner-border text-primary" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>}
                </div>
            </div>
            <div className="pillbox__addContainer" onClick={() =>{ 
                dispatch({type: "SET_IS_EDITION", payload: false})
                dispatch({type: "SET_RENDER_STATE", payload:"CREATE"})}}>
                <label className="pillbox__btnContainer">
                    <button className="pillbox__addBtn"><p>+</p></button>
                </label>
            </div>
        </div>
        </div>
    )
}
