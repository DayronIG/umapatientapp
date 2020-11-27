import React, {useState, useEffect} from 'react'
import { useDispatch } from "react-redux";
import Cleave from 'cleave.js/react';
import { FaPlus, FaMinus } from "react-icons/fa"

export default function DayTimeSelector({medicine = false, defaultValues = false}) {
    const [shiftsToSave, setShiftsToSave] = useState({})
    const dispatch = useDispatch()

    useEffect(() => {
        if(medicine){
            dispatch({type: "SET_SHIFTS_TO_POST", payload: {medicine: medicine, shifts: shiftsToSave}})
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

    useEffect(() => {
        console.log(shiftsToSave)
    }, [shiftsToSave])

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
                    <div className="daytime-selector" key={hour + day}>
                    <select name="" id="" className="form-control day-input" defaultValue={day} onChange={e => console.log(e.target.value)} >
                        <option value="mon">Lunes</option>
                        <option value="tue">Martes</option>
                        <option value="wed">Miércoles</option>
                        <option value="thu">Jueves</option>
                        <option value="fri">Viernes</option>
                        <option value="sat">Sábado</option>
                        <option value="sun">Domingo</option>
                    </select>
                    <Cleave placeholder="Horario"
                        options={{
                            time: true,
                            timePattern: ['h', 'm']
                        }}
                        value={hour}
                        onChange={e => editShift(e.target.value, indexHour, day)} 
                        className="time-input"/>
                    <FaMinus className="minus-icon" onClick={() => removeShift(hour, day)}/>
                </div>
                )
        }
        for(var day in shiftsToSave){
            shiftsToSave[day].map((hour, indexHour) => mapHours(hour, indexHour, day))
        }
        return content
    }

    return <> 
        {renderContent()}
        <div className="add-pill-shift-icon">
            <FaPlus className="add-icon" onClick={addShift}/>
        </div>
        </>
}
