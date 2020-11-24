import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from "react-router-dom"
import Modal from "../GeneralComponents/Modal/MobileModal"
import "../../styles/pillbox/pillbox.scss"
import Switch from "react-switch"
import { BackButton } from '../GeneralComponents/Headers';

// import 'features/monitoring/style.scss';

const format = 'HH:mm';

const Pillbox = props => {
    // const recipe = useSelector(state => state.pillbox.recipe) 
    const [dates, setDates] = useState([]);
    const [modal, setModal] = useState(false);
    const history = useHistory()

    const recipes = [{
        uid: "",
        treatment: {
            dose: 1,
            frequency_hours: 3,
            quantity_days: 5,
        },
        medicine: "AMOXIDAL",
        notify: true,
        initial_date: "2020-12-12",
        final_date: "2020-05-12",
        active: true
    },
    {
        uid: "",
        treatment: {
            dose: 1,
            frequency_hours: 3,
            quantity_days: 5,
        },
        medicine: "IBUPIRAC",
        notify: true,
        initial_date: "2020-12-12",
        final_date: "2020-05-12",
        active: false
    }]

    const disabledDate = current => {
    //   if (!dates || dates.length === 0) {
    //     return false;
    //   }
    //   const tooLate = dates[0] && current.diff(dates[0], 'days') > recipe.treatment.days;
    //   const tooEarly = dates[1] && dates[1].diff(current, 'days') > recipe.treatment.days;
    //   return tooEarly || tooLate;
    };

    const handleOk = () => {
        // TO DO
    }

    const recipesList = () => {
        const recipeList = [];
        for(var i = 0; i < recipes.length; i++) {
            recipeList.push(
                <div className='recipesList__container' key={i}>
                    <div className='recipesListIndicator__container'>
                        <span className=''>{recipes[i].medicine}</span>
                        <span className=''>{recipes[i].treatment.dose} cada {recipes[i].treatment.frequency_hours} horas por {recipes[i].treatment.quantity_days} días</span>
                    </div>
                        
                    <div className='recipesListSwitch__container' onClick={() => setModal(true)}>
                    <Switch
                        checked={recipes[i].active}
                        onChange={() => "asd"}
                        />
                    </div>
                </div>
            )
        }
        return recipeList
    }

    return (
        <div className="pillbox">
        <BackButton inlineButton={true} action={()=>history.push(`/`)} />
        {modal && <Modal
          callback={() => setModal(false)}>
              <div className='modalContent__container'>
                    <h4 className='modal__title'>Recordatorio</h4>
                    <div className='inputDate__container'>
                        <input type="date" name="" id=""/>
                        <input type="date" name="" id=""/>
                    </div>
                    <div className='inputTime__container'>
                        <input type="datetime" name="" id=""/>
                        <input type="number" name="" id=""/>
                    </div>
                    <button
                        className='save__button btn-blue-lg btn'
                        onClick={() => console.log("añadir")} 
                        >
                        Guardar
                    </button>
                </div>
            </Modal>}
            <div className=''>
                <h2 className="pillbox__title">Monitoreo</h2>
                <div className='pillboxList__container'>
                    <div className='pillboxReminder__header'>
                        <div className=''>
                            Receta
                        </div>
                        <div className=''>
                            Recordatorio
                        </div>
                    </div>
                    {recipesList()}
                </div>
                </div>
                <div className="pillbox__addContainer"
                onClick={() => setModal(true)}>
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
