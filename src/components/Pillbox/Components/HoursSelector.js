import React, {useState, useEffect, useRef} from 'react'
import { useDispatch } from "react-redux";
import Cleave from 'cleave.js/react';
import { FaPlus, FaMinus } from "react-icons/fa"

export default function HoursSelector({medicine = false, defaultValues = false}) {
    const [hoursToSave, setHoursToSave] = useState([])
    const dispatch = useDispatch()

    useEffect(() => {
        if(medicine){
            dispatch({type: "SET_SHIFTS_TO_POST", payload: {medicine: medicine, shifts: hoursToSave}})
        }
    }, [medicine, hoursToSave])

    useEffect(()=>{
        if(defaultValues){
            const values = []
            for(var hour of defaultValues){
                values.push(hour)
            }
            setHoursToSave(values)
        } else {
            setHoursToSave(["00:00"])
        }
    },[])

    useEffect(() => {
        console.log(hoursToSave)
    }, [hoursToSave])

    const addHour = () => {
        setHoursToSave([...hoursToSave, "00:00"])
    }

    const removeHour = () => {
        let hours = hoursToSave.slice(0, -1)
        setHoursToSave(hours)
    }

    const editHour = (hour, indexHour) => {
        var hours = hoursToSave
        hours[indexHour] = hour
        console.log(hours)
        setHoursToSave(hours)
    }

    const renderHours = () => {
        let content = hoursToSave.map((hour, indexHour) => {
            return (<div className="daytime-selector" key={hour}>
                <span>Hora:</span>
                <Cleave placeholder="hh:mm"
                options={{
                    time: true,
                    timePattern: ['h', 'm']
                }}
                value={hour}
                onChange={e => editHour(e.target.value, indexHour)} 
                className="time-input form-control"/>
            </div>)}
        )
        return content
    }

    return <>
        {renderHours()}
        <div className="add-pill-shift-icon">
            <FaPlus className="add-icon" onClick={addHour}/>
            <FaMinus className="minus-icon" onClick={removeHour}/>
        </div>
        </>
}            
