import React, {useState, useEffect} from 'react'
import Cleave from 'cleave.js/react';
import { FaPlus, FaMinus } from "react-icons/fa"

export default function DayTimeSelector({defaultValues = false}) {
    const [shiftsToSave, setShiftsToSave] = useState({})

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
        if(shiftsToSave.mon?.length > 0){
            setShiftsToSave({...shiftsToSave, mon:[...shiftsToSave.mon, "00:00"]})
        } else {
            setShiftsToSave({...shiftsToSave, mon:["00:00"]})
        }
    }

    const removeShift = (hour, day) => {
        setShiftsToSave({...shiftsToSave, [day]: shiftsToSave[day]?.filter(el => el !== hour)})
    }


    const renderContent = () => {
        const content  = []        
        const mapHours = (hour, day) => {
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
                        onChange={e => console.log(e.target.value)} 
                        className="time-input"/>
                    <FaMinus className="minus-icon" onClick={() => removeShift(hour, day)}/>
                </div>
                )
        }
        for(var day in shiftsToSave){
            shiftsToSave[day].map((hour) => mapHours(hour, day))
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
