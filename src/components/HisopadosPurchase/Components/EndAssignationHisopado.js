import React, { useState, useEffect } from 'react'
import hisopadosPay from "../../../assets/img/hisopados_payment.svg"

export default function EndAssignationHisopado() {
    const [loaderWidth, setLoaderWidth] = useState(50)
        
    return (
        <div className="allwhite-hisopados-background" >
                <div className="instructions-container">
                    <img src={hisopadosPay} alt="hisopados_tic" className="hisopados_cross"/>
                    <p className="hisopados-title">¡Hemos recibido su pago!</p>
                    <p>Estamos buscando al profesional más cercano para realizar el hisopado</p>
                    <p>Aguarde unos instantes</p>
                    <div className="progress">
                        {console.log(loaderWidth)}
                        <div className="progress-blue" style={{width: `${loaderWidth}%`}}></div>
                    </div>
                </div>
        </div>
    )
}
