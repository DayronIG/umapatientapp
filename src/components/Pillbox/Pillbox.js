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
        // for (const [index, recipe] of data.diagnostics.recipe.medicines.entries()) {
        //     recipeList.push(
        //         <div className='d-flex bd-highlight' key={index}>
        //             <div className='p-2 flex-grow-1 bd-highlight'>
        //                 <span className='d-block recipe__drug'>{recipe.drug}</span>
        //                 <span className='recipe__treatment'>{recipe.treatment.quantity_per_day} cada {recipe.treatment.periodicity} horas por {recipe.treatment.days} días</span>
        //             </div>
        //             <div className='p-2 bd-highlight'>
        //                 {console.log(recipe.reminder.active)}
        //             {/* <Switch
        //                 checkedChildren={<CheckOutlined />}
        //                 unCheckedChildren={<CloseOutlined />}
        //                 onClick={(checked) => handleReminder(recipe, checked, index)}
        //                 checked = {recipe.reminder.active}
        //                 /> */}
        //             </div>
        //         </div>
        //     )
        // }
        return recipeList
    }

    return (
        <div className="pillbox">
        {modal && <Modal
          title="Monitoreo"
          callback={setModal(true)}>
              <div md={12} className='mt-4 text-center'>
                    <h2 className='text__section mt-2 mb-3'>Recordatorio</h2>
                    <div md={12} className='mt-4 range-picker-container'>
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
                        className='mt-3'
                        format={format}
                        placeholder="Start time"
                    />
                    <div className="button__footer mt-5">
                        <button
                            variant='primary'
                            className='index__button mt-2 mb-3'
                            // onClick={() => props.hide(recipe?.index, true)} 
                            >
                            Añadir Recordatorio
                        </button>
                        <button
                            variant='primary' 
                            className='index__button status' 
                            // onClick={() => props.hide(recipe?.index, false)} 
                            >
                            Cancelar
                        </button>
                    </div>
                </div>
            </Modal>}
            <div className='pillboxList__container'>
                <h2 className="pillbox__title">Pastillero Uma</h2>
                <div md={12}>
                    <div className='d-flex bd-highlight'>
                        <div className='p-2 flex-grow-1 bd-highlight recipe__drug'>
                            Receta
                        </div>
                    </div>
                    <div className='d-flex bd-highlight'>
                    <div className='p-2 flex-grow-1 bd-highlight'>
                        <span className='d-block recipe__drug'>{"AMOXIDAL"}</span>
                        <span className='recipe__treatment'>
                        {1} cada {1} horas por {1}
                        días</span>
                    </div>
                </div>
                <div md={12} className=' mt-4'>
                    {/* mt-3 */}
                    <div className="d-flex bd-highlight mb-5 ">
                        <div className="p-2 bd-highlight">
                            {/* <img src={img} className='ml-3' alt=""/> */}
                        </div>
                        <div className="p-2 ">
                            <h2 className=' mt-2'>Monitoreo</h2>
                        </div>
                    </div>
                    <div className='d-flex bd-highlight'>
                        <div className='p-2 flex-grow-1 bd-highlight'>
                            Receta
                        </div>
                        <div className='p-2 bd-highlight'>
                            Recordatorio
                        </div>
                    </div>
                    {recipesList()}
                </div>
                </div>
                
            </div>
        </div>
    )

}

export default Pillbox
