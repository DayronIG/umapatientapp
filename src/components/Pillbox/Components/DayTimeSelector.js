import React, {useState} from 'react'
import Cleave from 'cleave.js/react';

export default function DayTimeSelector({quantity, defaultValues = false, modifyQuantity}) {
    const [pillboxShifts, setPillboxShifts] = useState([])

    const renderContent = () => {
        const content  = []
        if(defaultValues){
            modifyQuantity(0)
            for(var day in defaultValues){
                defaultValues[day].map((hour) => content.push(
                        <div className="daytime-selector" key={i}>
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
                    </div>
                    )
                )
            }
        }
        for(var i = 0; i<quantity; i++){
            content.push(
                <div className="daytime-selector" key={i}>
                    <select name="" id="" className="form-control day-input" onChange={e => console.log(e.target.value)} >
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
                        onChange={e => console.log(e.target.value)} 
                        className="time-input"/>
                </div>
            )
        }
        return content
    }

    return renderContent()
}
