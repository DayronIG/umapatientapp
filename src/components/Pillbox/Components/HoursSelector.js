import React, {useState, useEffect, useRef} from 'react'
import Cleave from 'cleave.js/react';
import { FaPlus, FaMinus } from "react-icons/fa"

export default function HoursSelector({quantity, defaultValues = false, modifyQuantity}) {
    const [hoursToSave, setHoursToSave] = useState([])

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

    const renderHours = () => {
        let content = hoursToSave.map(hour => {
            return (<div className="daytime-selector" key={hour}>
                <span>Hora:</span>
                <Cleave placeholder="hh:mm"
                options={{
                    time: true,
                    timePattern: ['h', 'm']
                }}
                value={hour}
                onChange={e => console.log(e.target.value)} 
                className="time-input"/>
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
