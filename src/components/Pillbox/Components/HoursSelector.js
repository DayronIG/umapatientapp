import React from 'react'
import Cleave from 'cleave.js/react';

export default function HoursSelector({quantity, defaultValues = false, modifyQuantity}) {

    const renderHours = () => {
        const content = []
        if(defaultValues){
            modifyQuantity(0)
            for(var i = 0; i < defaultValues.length; i++){
                content.push(
                    <div className="daytime-selector" key={i}>
                        <span>Hora:</span>
                        <Cleave placeholder="Horario"
                        options={{
                            time: true,
                            timePattern: ['h', 'm']
                        }}
                        value={defaultValues[i]}
                        onChange={e => console.log(e.target.value)} 
                        className="time-input"/>
                    </div>
                )
            }
        }
        for(var i = 0; i < quantity; i++){
            content.push(
                <div className="daytime-selector" key={i}>
                    <span>Hora:</span>
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

    return renderHours()
}            
