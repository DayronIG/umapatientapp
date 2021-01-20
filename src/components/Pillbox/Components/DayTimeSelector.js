import React, {useState, useEffect, useCallback} from 'react'
import { useDispatch, useSelector } from "react-redux";
import Cleave from 'cleave.js/react';
import { FaPlus, FaMinus, FaTrashAlt } from "react-icons/fa"

export default function DayTimeSelector({value, medicine = false, defaultValues = false}) {
    const [shiftsToSave, setShiftsToSave] = useState({})
    const { personalizedShifts } = useSelector(state => state.pillbox)
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


    const renderContentTwo = () => {
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

    const renderContent = () => {
        console.log(shiftsToSave)
        const content  = []        
        content.push(
                    <>
                    <div className="daytime-selector" key={"mon"}>
                    <div className='checkButton__container'>
                        <div className='checkText__container'>
                            <input type="checkbox" name="" id="" checked={!!shiftsToSave['mon']}/>
                            <p className='dayLabel'>LUNES</p>
                        </div>
                        <div className='addHour' onClick={addShift}>+</div>
                    </div>
                   {shiftsToSave['mon'] && <div className='checkHours__container'>
                        <Cleave placeholder="Horario"
                            options={{
                                time: true,
                                timePattern: ['h', 'm']
                            }}
                            value={shiftsToSave['mon'][0]}
                            onChange={e => editShift(e.target.value, 0, 'mon')} 
                            className="time-input form-control"/>
                        <FaTrashAlt className="" onClick={() => removeShift(shiftsToSave['mon'].hour, 'mon')}/>
                   </div>}
                    <hr/>
                </div>
                <div className="daytime-selector" key={'tue'}>
                    <div className='checkButton__container'>
                        <div className='checkText__container'>
                            <input type="checkbox" name="" id="" checked={!!shiftsToSave['tue']}/>
                            <p className='dayLabel'>MARTES</p>
                        </div>
                        <div className='addHour' onClick={addShift}>+</div>
                    </div>
                    {shiftsToSave['tue'] &&  <div className='checkHours__container'>
                        <Cleave placeholder="Horario"
                            options={{
                                time: true,
                                timePattern: ['h', 'm']
                            }}
                            value={shiftsToSave['tue'][0]}
                            onChange={e => editShift(e.target.value, 0, 'tue')} 
                            className="time-input form-control"/>
                        <FaTrashAlt className="" onClick={() => removeShift(shiftsToSave['tue'][0], 'tue')}/>
                   </div>}
                    <hr/>
                </div>
                <div className="daytime-selector" key={'wed'}>
                    <div className='checkButton__container'>
                        <div className='checkText__container'>
                            <input type="checkbox" name="" id="" checked={!!shiftsToSave['wed']}/>
                            <p className='dayLabel'>MIÉRCOLES</p>
                        </div>
                        <div className='addHour' onClick={addShift}>+</div>
                    </div>
                    {shiftsToSave['wed'] && <div className='checkHours__container'>
                        <Cleave placeholder="Horario"
                            options={{
                                time: true,
                                timePattern: ['h', 'm']
                            }}
                            value={shiftsToSave['wed'][0]}
                            onChange={e => editShift(e.target.value, 0, 'wed')} 
                            className="time-input form-control"/>
                        <FaTrashAlt className="" onClick={() => removeShift(shiftsToSave['wed'][0], 'wed')}/>
                   </div>}
                    <hr/>
                </div>
                <div className="daytime-selector" key={'thu'}>
                    <div className='checkButton__container'>
                        <div className='checkText__container'>
                            <input type="checkbox" name="" id="" checked={!!shiftsToSave['thu']}/>
                            <p className='dayLabel'>JUEVES</p>
                        </div>
                        <div className='addHour' onClick={addShift}>+</div>
                    </div>
                    {shiftsToSave['thu'] &&  <div className='checkHours__container'>
                        <Cleave placeholder="Horario"
                            options={{
                                time: true,
                                timePattern: ['h', 'm']
                            }}
                            value={shiftsToSave['thu'][0]}
                            onChange={e => editShift(e.target.value, 0, 'thu')} 
                            className="time-input form-control"/>
                        <FaTrashAlt className="" onClick={() => removeShift(shiftsToSave['thu'][0], 'thu')}/>
                   </div>}
                    <hr/>
                </div>
                <div className="daytime-selector" key={'fri'}>
                    <div className='checkButton__container'>
                        <div className='checkText__container'>
                            <input type="checkbox" name="" id="" checked={!!shiftsToSave['fri']}/>
                            <p className='dayLabel'>VIERNES</p>
                        </div>
                        <div className='addHour' onClick={addShift}>+</div>
                    </div>
                    {shiftsToSave['fri'] && <div className='checkHours__container'>
                        <Cleave placeholder="Horario"
                            options={{
                                time: true,
                                timePattern: ['h', 'm']
                            }}
                            value={shiftsToSave['fri'][0]}
                            onChange={e => editShift(e.target.value, 0, 'fri')} 
                            className="time-input form-control"/>
                        <FaTrashAlt className="" onClick={() => removeShift(shiftsToSave['fri'][0], 'fri')}/>
                   </div>}
                    <hr/>
                </div>
                <div className="daytime-selector" key={'sat'}>
                    <div className='checkButton__container'>
                        <div className='checkText__container'>
                            <input type="checkbox" name="" id="" checked={!!shiftsToSave['sat']}/>
                            <p className='dayLabel'>SÁBADO</p>
                        </div>
                        <div className='addHour' onClick={addShift}>+</div>
                    </div>
                    {shiftsToSave['sat'] && <div className='checkHours__container'>
                        <Cleave placeholder="Horario"
                            options={{
                                time: true,
                                timePattern: ['h', 'm']
                            }}
                            value={shiftsToSave['sat'][0]}
                            onChange={e => editShift(e.target.value, 0, 'sat')} 
                            className="time-input form-control"/>
                        <FaTrashAlt className="" onClick={() => removeShift(shiftsToSave['sat'][0], 'sat')}/>
                   </div>}
                    <hr/>
                </div>
                <div className="daytime-selector" key={'sun'}>
                    <div className='checkButton__container'>
                        <div className='checkText__container'>
                            <input type="checkbox" name="" id="" checked={!!shiftsToSave['sun']}/>
                            <p className='dayLabel'>DOMINGO</p>
                        </div>
                        <div className='addHour' onClick={addShift}>+</div>
                    </div>
                    {shiftsToSave['sun'] && <div className='checkHours__container'>
                        <Cleave placeholder="Horario"
                            options={{
                                time: true,
                                timePattern: ['h', 'm']
                            }}
                            value={shiftsToSave['sun'][0]}
                            onChange={e => editShift(e.target.value, 0, 'sun')} 
                            className="time-input form-control"/>
                        <FaTrashAlt className="" onClick={() => removeShift(shiftsToSave['sun'][0], 'sun')}/>
                   </div>}
                    <hr/>
                </div>
                </>
                )
        return content
    }

    const changePersonalized = useCallback(()=>{
        dispatch({type: "SET_PERSONALIZED_SHIFTS", payload: !personalizedShifts})
    },[personalizedShifts])

    return <> 
        <div className='radioButton__container'>
            <div className='radioText'>
                <input type="radio" name="" id="" checked={personalizedShifts} value={personalizedShifts} onClick={()=>changePersonalized()}/> 
                <p>DÍAS ESPECÍFICOS</p>
            </div>
        </div>
        {value && renderContent()}
        {/* <div className="add-pill-shift-icon">
            <FaPlus className="add-icon" onClick={addShift}/>
        </div> */}
        </>
}
