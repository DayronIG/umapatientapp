import React, {useState, useEffect} from 'react'
import { useDispatch } from "react-redux";
import Cleave from 'cleave.js/react';
import { FaPlus, FaMinus, FaTrashAlt } from "react-icons/fa"

export default function DayTimeSelector({value, medicine = false, defaultValues = false}) {
    const [shiftsToSave, setShiftsToSave] = useState({})
    const dispatch = useDispatch()

    useEffect(() => {
        if(medicine){
            dispatch({type: "SET_SHIFTS_TO_POST", payload: {medicine: medicine, shifts: shiftsToSave, personalized:true}})
        }
        console.log(shiftsToSave)
    }, [medicine, shiftsToSave])

    useEffect(()=>{
        if(defaultValues){
            const values = {}
            for(var day in defaultValues){
                values[day] = defaultValues[day]
            }
            setShiftsToSave(values)
        } else {
            setShiftsToSave({mon:["00:00"]})
        }
    },[])

    const addShift = () => {
        if(shiftsToSave.sun?.length > 0){
            setShiftsToSave({...shiftsToSave, sun:[...shiftsToSave.sun, "00:00"]})
        } else {
            setShiftsToSave({...shiftsToSave, sun:["00:00"]})
        }
    }

    const removeShift = (hour, day) => {
        setShiftsToSave({...shiftsToSave, [day]: shiftsToSave[day]?.filter(el => el !== hour)})
    }

    const editShift = (hour, indexHour, day) => {
        var shifts = shiftsToSave
        shifts[day][indexHour] = hour
        setShiftsToSave(shifts)
    }


    const renderContent = () => {
        const content  = []        
        const mapHours = (hour, indexHour, day) => {
                return content.push(
                    <>
                    <div className="daytime-selector" key={hour + day}>
                    {/* <select name="" id="" className="form-control day-input" defaultValue={day} onChange={e => editShift(hour, indexHour, e.target.value)} >
                        <option value="mon">Lunes</option>
                        <option value="tue">Martes</option>
                        <option value="wed">Miércoles</option>
                        <option value="thu">Jueves</option>
                        <option value="fri">Viernes</option>
                        <option value="sat">Sábado</option>
                        <option value="sun">Domingo</option>
                    </select> */}
                    <div className='checkButton__container'>
                        <div className='checkText__container'>
                            <input type="checkbox" name="" id=""/>
                            <p className='dayLabel'>LUNES</p>
                        </div>
                        <div className='addHour' onClick={addShift}>+</div>
                    </div>
                   <div className='checkHours__container'>
                        <Cleave placeholder="Horario"
                            options={{
                                time: true,
                                timePattern: ['h', 'm']
                            }}
                            value={hour}
                            onChange={e => editShift(e.target.value, indexHour, day)} 
                            className="time-input form-control"/>
                        <FaTrashAlt className="" onClick={() => removeShift(hour, day)}/>
                   </div>
                    <hr/>
                </div>
                <div className="daytime-selector" key={hour + day}>
                    <div className='checkButton__container'>
                        <div className='checkText__container'>
                            <input type="checkbox" name="" id=""/>
                            <p className='dayLabel'>MARTES</p>
                        </div>
                        <div className='addHour' onClick={addShift}>+</div>
                    </div>
                   <div className='checkHours__container'>
                        <Cleave placeholder="Horario"
                            options={{
                                time: true,
                                timePattern: ['h', 'm']
                            }}
                            value={hour}
                            onChange={e => editShift(e.target.value, indexHour, day)} 
                            className="time-input form-control"/>
                        <FaTrashAlt className="" onClick={() => removeShift(hour, day)}/>
                   </div>
                    <hr/>
                </div>
                <div className="daytime-selector" key={hour + day}>
                    <div className='checkButton__container'>
                        <div className='checkText__container'>
                            <input type="checkbox" name="" id=""/>
                            <p className='dayLabel'>MIÉRCOLES</p>
                        </div>
                        <div className='addHour' onClick={addShift}>+</div>
                    </div>
                   <div className='checkHours__container'>
                        <Cleave placeholder="Horario"
                            options={{
                                time: true,
                                timePattern: ['h', 'm']
                            }}
                            value={hour}
                            onChange={e => editShift(e.target.value, indexHour, day)} 
                            className="time-input form-control"/>
                        <FaTrashAlt className="" onClick={() => removeShift(hour, day)}/>
                   </div>
                    <hr/>
                </div>
                <div className="daytime-selector" key={hour + day}>
                    <div className='checkButton__container'>
                        <div className='checkText__container'>
                            <input type="checkbox" name="" id=""/>
                            <p className='dayLabel'>JUEVES</p>
                        </div>
                        <div className='addHour' onClick={addShift}>+</div>
                    </div>
                   <div className='checkHours__container'>
                        <Cleave placeholder="Horario"
                            options={{
                                time: true,
                                timePattern: ['h', 'm']
                            }}
                            value={hour}
                            onChange={e => editShift(e.target.value, indexHour, day)} 
                            className="time-input form-control"/>
                        <FaTrashAlt className="" onClick={() => removeShift(hour, day)}/>
                   </div>
                    <hr/>
                </div>
                <div className="daytime-selector" key={hour + day}>
                    <div className='checkButton__container'>
                        <div className='checkText__container'>
                            <input type="checkbox" name="" id=""/>
                            <p className='dayLabel'>VIERNES</p>
                        </div>
                        <div className='addHour' onClick={addShift}>+</div>
                    </div>
                   <div className='checkHours__container'>
                        <Cleave placeholder="Horario"
                            options={{
                                time: true,
                                timePattern: ['h', 'm']
                            }}
                            value={hour}
                            onChange={e => editShift(e.target.value, indexHour, day)} 
                            className="time-input form-control"/>
                        <FaTrashAlt className="" onClick={() => removeShift(hour, day)}/>
                   </div>
                    <hr/>
                </div>
                <div className="daytime-selector" key={hour + day}>
                    <div className='checkButton__container'>
                        <div className='checkText__container'>
                            <input type="checkbox" name="" id=""/>
                            <p className='dayLabel'>SÁBADO</p>
                        </div>
                        <div className='addHour' onClick={addShift}>+</div>
                    </div>
                   <div className='checkHours__container'>
                        <Cleave placeholder="Horario"
                            options={{
                                time: true,
                                timePattern: ['h', 'm']
                            }}
                            value={hour}
                            onChange={e => editShift(e.target.value, indexHour, day)} 
                            className="time-input form-control"/>
                        <FaTrashAlt className="" onClick={() => removeShift(hour, day)}/>
                   </div>
                    <hr/>
                </div>
                <div className="daytime-selector" key={hour + day}>
                    <div className='checkButton__container'>
                        <div className='checkText__container'>
                            <input type="checkbox" name="" id=""/>
                            <p className='dayLabel'>DOMINGO</p>
                        </div>
                        <div className='addHour' onClick={addShift}>+</div>
                    </div>
                   <div className='checkHours__container'>
                        <Cleave placeholder="Horario"
                            options={{
                                time: true,
                                timePattern: ['h', 'm']
                            }}
                            value={hour}
                            onChange={e => editShift(e.target.value, indexHour, day)} 
                            className="time-input form-control"/>
                        <FaTrashAlt className="" onClick={() => removeShift(hour, day)}/>
                   </div>
                    <hr/>
                </div>
                </>
                )
        }
        for(var day in shiftsToSave){
            shiftsToSave[day].map((hour, indexHour) => mapHours(hour, indexHour, day))
        }
        return content
    }

    return <> 
        <div className='radioButton__container'>
            <div className='radioText'>
                <input type="radio" name="" id="" value={value}/> 
                <p>DÍAS ESPECÍFICOS</p>
            </div>
        </div>
        {value && renderContent()}
        {/* <div className="add-pill-shift-icon">
            <FaPlus className="add-icon" onClick={addShift}/>
        </div> */}
        </>
}
