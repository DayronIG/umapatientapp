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

    const addShift = (day) => {
        // if(shiftsToSave.sun?.length > 0){
        //     setShiftsToSave({...shiftsToSave, sun:[...shiftsToSave.sun, "00:00"]})
        // } else {
        //     setShiftsToSave({...shiftsToSave, sun:["00:00"]})
        // }
        if(shiftsToSave[day]?.length > 0){
            setShiftsToSave({...shiftsToSave, [day]:[...shiftsToSave?.[day], "00:00"]})
        } else {
            setShiftsToSave({...shiftsToSave, [day]:["00:00"]})
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

    const checkUncheckShift = (day) => {
        if(!!shiftsToSave[day]){
            setShiftsToSave({...shiftsToSave, [day]:null})
        } else {
            setShiftsToSave({...shiftsToSave, [day]:['00:00']})
        }
    }

    const renderContent = () => {
        const content  = []        
        content.push(
                    <>
                    <div className="daytime-selector" key={"mon"}>
                    <div className='checkButton__container'>
                        <div className='checkText__container'>
                            <input type="checkbox" name="" id="" checked={!!shiftsToSave['mon']} onClick={()=>checkUncheckShift('mon')}/>
                            <p className='dayLabel'>LUNES</p>
                        </div>
                        <div className='addHour' onClick={()=>addShift('mon')}>+</div>
                    </div>
                   {shiftsToSave['mon'] && 
                   shiftsToSave['mon'].map((hour, indexHour) =>
                    <div className='checkHours__container'>
                        <Cleave placeholder="-"
                            options={{
                                time: true,
                                timePattern: ['h', 'm']
                            }}
                            value={hour}
                            onChange={e => editShift(e.target.value, indexHour, 'mon')} 
                            className="time-input form-control"/>
                        <FaTrashAlt className="" onClick={() => removeShift(hour, 'mon')}/>
                   </div>)}
                    <hr/>
                </div>
                <div className="daytime-selector" key={'tue'}>
                    <div className='checkButton__container'>
                        <div className='checkText__container'>
                            <input type="checkbox" name="" id="" checked={!!shiftsToSave['tue']} onClick={()=>checkUncheckShift('tue')}/>
                            <p className='dayLabel'>MARTES</p>
                        </div>
                        <div className='addHour' onClick={()=>addShift('tue')}>+</div>
                    </div>
                    {shiftsToSave['tue'] && 
                   shiftsToSave['tue'].map((hour, indexHour) =>
                    <div className='checkHours__container'>
                        <Cleave placeholder="-"
                            options={{
                                time: true,
                                timePattern: ['h', 'm']
                            }}
                            value={hour}
                            onChange={e => editShift(e.target.value, indexHour, 'tue')} 
                            className="time-input form-control"/>
                        <FaTrashAlt className="" onClick={() => removeShift(hour, 'tue')}/>
                   </div>)}
                    <hr/>
                </div>
                <div className="daytime-selector" key={'wed'}>
                    <div className='checkButton__container'>
                        <div className='checkText__container'>
                            <input type="checkbox" name="" id="" checked={!!shiftsToSave['wed']} onClick={()=>checkUncheckShift('wed')}/>
                            <p className='dayLabel'>MIÉRCOLES</p>
                        </div>
                        <div className='addHour' onClick={()=>addShift('wed')}>+</div>
                    </div>
                    {shiftsToSave['wed'] && 
                   shiftsToSave['wed'].map((hour, indexHour) =>
                    <div className='checkHours__container'>
                        <Cleave placeholder="-"
                            options={{
                                time: true,
                                timePattern: ['h', 'm']
                            }}
                            value={hour}
                            onChange={e => editShift(e.target.value, indexHour, 'wed')} 
                            className="time-input form-control"/>
                        <FaTrashAlt className="" onClick={() => removeShift(hour, 'wed')}/>
                   </div>)}
                    <hr/>
                </div>
                <div className="daytime-selector" key={'thu'}>
                    <div className='checkButton__container'>
                        <div className='checkText__container'>
                            <input type="checkbox" name="" id="" checked={!!shiftsToSave['thu']} onClick={()=>checkUncheckShift('thu')}/>
                            <p className='dayLabel'>JUEVES</p>
                        </div>
                        <div className='addHour' onClick={()=>addShift('thu')}>+</div>
                    </div>
                    {shiftsToSave['thu'] && 
                   shiftsToSave['thu'].map((hour, indexHour) =>
                    <div className='checkHours__container'>
                        <Cleave placeholder="-"
                            options={{
                                time: true,
                                timePattern: ['h', 'm']
                            }}
                            value={hour}
                            onChange={e => editShift(e.target.value, indexHour, 'thu')} 
                            className="time-input form-control"/>
                        <FaTrashAlt className="" onClick={() => removeShift(hour, 'thu')}/>
                   </div>)}
                    <hr/>
                </div>
                <div className="daytime-selector" key={'fri'}>
                    <div className='checkButton__container'>
                        <div className='checkText__container'>
                            <input type="checkbox" name="" id="" checked={!!shiftsToSave['fri']} onClick={()=>checkUncheckShift('fri')}/>
                            <p className='dayLabel'>VIERNES</p>
                        </div>
                        <div className='addHour' onClick={()=>addShift('fri')}>+</div>
                    </div>
                    {shiftsToSave['fri'] && 
                   shiftsToSave['fri'].map((hour, indexHour) =>
                    <div className='checkHours__container'>
                        <Cleave placeholder="-"
                            options={{
                                time: true,
                                timePattern: ['h', 'm']
                            }}
                            value={hour}
                            onChange={e => editShift(e.target.value, indexHour, 'fri')} 
                            className="time-input form-control"/>
                        <FaTrashAlt className="" onClick={() => removeShift(hour, 'fri')}/>
                   </div>)}
                    <hr/>
                </div>
                <div className="daytime-selector" key={'sat'}>
                    <div className='checkButton__container'>
                        <div className='checkText__container'>
                            <input type="checkbox" name="" id="" checked={!!shiftsToSave['sat']} onClick={()=>checkUncheckShift('sat')}/>
                            <p className='dayLabel'>SÁBADO</p>
                        </div>
                        <div className='addHour' onClick={()=>addShift('sat')}>+</div>
                    </div>
                    {shiftsToSave['sat'] && 
                   shiftsToSave['sat'].map((hour, indexHour) =>
                    <div className='checkHours__container'>
                        <Cleave placeholder="-"
                            options={{
                                time: true,
                                timePattern: ['h', 'm']
                            }}
                            value={hour}
                            onChange={e => editShift(e.target.value, indexHour, 'sat')} 
                            className="time-input form-control"/>
                        <FaTrashAlt className="" onClick={() => removeShift(hour, 'sat')}/>
                   </div>)}
                    <hr/>
                </div>
                <div className="daytime-selector" key={'sun'}>
                    <div className='checkButton__container'>
                        <div className='checkText__container'>
                            <input type="checkbox" name="" id="" checked={!!shiftsToSave['sun']} onClick={()=>checkUncheckShift('sun')}/>
                            <p className='dayLabel'>DOMINGO</p>
                        </div>
                        <div className='addHour' onClick={()=>addShift('sun')}>+</div>
                    </div>
                    {shiftsToSave['sun'] && 
                   shiftsToSave['sun'].map((hour, indexHour) =>
                    <div className='checkHours__container'>
                        <Cleave placeholder="-"
                            options={{
                                time: true,
                                timePattern: ['h', 'm']
                            }}
                            value={hour}
                            onChange={e => editShift(e.target.value, indexHour, 'sun')} 
                            className="time-input form-control"/>
                        <FaTrashAlt className="" onClick={() => removeShift(hour, 'sun')}/>
                   </div>)}
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
