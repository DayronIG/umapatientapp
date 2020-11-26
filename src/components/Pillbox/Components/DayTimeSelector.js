import React, {useState} from 'react'
import Cleave from 'cleave.js/react';

export default function DayTimeSelector({quantity}) {
    const [pillboxShifts, setPillboxShifts] = useState([])

    const renderContent = () => {
        const content  = []
        for(var i = 0; i<quantity; i++){
            content.push(
                <div className="daytime-selector" key={i}>
                    <select name="" id="" className="form-control day-input" onChange={e => console.log(e.target.value)} >
                        <option value="lu">Lunes</option>
                        <option value="ma">Martes</option>
                        <option value="mi">Miércoles</option>
                        <option value="ju">Jueves</option>
                        <option value="vi">Viernes</option>
                        <option value="sa">Sábado</option>
                        <option value="do">Domingo</option>
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
