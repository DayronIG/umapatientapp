import React, { useState, useEffect } from 'react'
import hisopadosPay from "../../../assets/img/hisopados_pay.png"

export default function EndAssignationHisopado() {
    const [loaderWidth, setLoaderWidth] = useState(0)
    const [varInterval, setVarInterval] = useState(null)

    useEffect(()=>{
        var intervalEffect = setInterval(()=>{
                setLoaderWidth(loaderWidth + 1)
            }, 100)
        setVarInterval(intervalEffect)
    },[loaderWidth])
    
    useEffect(() => {
        if(loaderWidth===100){clearInterval(varInterval)}
    }, [loaderWidth])
        
    return (
        <div className="allwhite-hisopados-background" >
                <div className="instructions-container">
                    <img src={hisopadosPay} alt="hisopados_tic" className="hisopados_cross"/>
                    <p className="hisopados-title">¡Hemos recibido su pago!</p>
                    <p>Estamos buscando al profesional más cercano para realizar el hisopado</p>
                    <p>Aguarde unos instantes</p>
                    <div className="progress">
                        {console.log(loaderWidth)}
                        <div className="progress-blue" style={{width: `${loaderWidth}vw`}}></div>
                    </div>
                </div>
        </div>
    )
}
