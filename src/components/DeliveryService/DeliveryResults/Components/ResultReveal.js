import React from 'react'
import hisopadosList from "../../../../assets/img/hisopados_list.svg"
import { GenericHeader } from '../../../GeneralComponents/Headers';

export default function ResultReveal({finalAction}) {

    return (
        <>
          <GenericHeader children="Resultado hisopado" />
            <div className="allwhite-hisopados-background" >
                    <div className="instructions-container">
                        <img src={hisopadosList} alt="hisopados_list" className="hisopados_cross"/>
                        <p className="hisopados-title">Conocé tu resultado</p>
                        <p>Ya se encuentra a tu disposición el resutlado de tu hisopado</p>
                        <div onClick={() => finalAction()} className="blue-button">
                            Ver resultado
                        </div>
                    </div>
            </div>
        </>
    )
}
