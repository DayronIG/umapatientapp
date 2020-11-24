import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
// import { div, Row, Button } from 'react-bootstrap';
// import { input, TimePicker } from 'antd';
import Modal from "../GeneralComponents/Modal/MobileModal"
import "../../styles/pillbox/pillbox.scss"

// import 'features/monitoring/style.scss';

const format = 'HH:mm';

const Pillbox = props => {
    // const recipe = useSelector(state => state.pillbox.recipe) 
    const [dates, setDates] = useState([]);
    const [modal, setModal] = useState(false);

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
        final_date: "2020-05-12"
    },
    {
        uid: "",
        treatment: {
            dose: 1,
            frequency_hours: 3,
            quantity_days: 5,
        },
        medicine: "AMOXIDAL",
        notify: true,
        initial_date: "2020-12-12",
        final_date: "2020-05-12"
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
                        <span className=''>{recipes[i].treatment.dose} cada {recipes[i].treatment.frecuency_hours} horas por {recipes[i].treatment.quantity_days} días</span>
                    </div>
                    <div className='recipesListSwitch__container'>
                    {/* <Switch
                        checkedChildren={<CheckOutlined />}
                        unCheckedChildren={<CloseOutlined />}
                        onClick={(checked) => handleReminder(recipe, checked, index)}
                        checked = {recipe.reminder.active}
                        /> */}
                    </div>
                </div>
            )
        }
        return recipeList
    }

    return (
        <div className="pillbox">
        {modal && <Modal
          title="Monitoreo"
          callback={setModal(true)}>
              <div className=''>
                    <h2 className=''>Recordatorio</h2>
                    <div className=''>
                        <input
                        disabledDate={disabledDate}
                        className="range-picker"
                        placeholder="Start date"
                        onCalendarChange = { value => {
                        setDates(value);
                        }}
                        />
                        <input
                        disabledDate={disabledDate}
                        className="range-picker"
                        placeholder="End date"
                        onCalendarChange = { value => {
                        setDates(value);
                        }}
                        />
                    </div>
                    <input
                        className=''
                        format={format}
                        placeholder="Start time"
                    />
                    <div className="">
                        <button
                            variant='primary'
                            className=''
                            // onClick={() => props.hide(recipe?.index, true)} 
                            >
                            Añadir Recordatorio
                        </button>
                        <button
                            variant='primary' 
                            className='' 
                            // onClick={() => props.hide(recipe?.index, false)} 
                            >
                            Cancelar
                        </button>
                    </div>
                </div>
            </Modal>}
            <div className=''>
                <h2 className="pillbox__title">Pastillero Uma</h2>
                <div className='pillboxList__container'>
                    <div className="">
                        <h2 className='pillbox__title'>Monitoreo</h2>
                    </div>
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
            </div>
    )

}

export default Pillbox
