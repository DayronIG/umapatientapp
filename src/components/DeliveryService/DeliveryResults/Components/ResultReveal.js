import React from 'react'
import hisopadosList from "../../../../assets/img/hisopados_list.svg"

export default function EndAssignationHisopado({finalAction}) {

    return (
        <div className="allwhite-hisopados-background" >
                <div className="instructions-container">
                    <img src={hisopadosList} alt="hisopados_list" className="hisopados_cross"/>
                    <p className="hisopados-title">Conocé tu resultado</p>
                    <p>Ya se encuentra a tu disposición el resutlado de tu hisopado</p>
                </div>
                <div onClick={() => finalAction()} className="blue-button">
                    Ver resultado
                </div>
        </div>
    )
}
