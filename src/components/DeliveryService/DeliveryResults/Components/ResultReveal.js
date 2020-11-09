import React, {useRef, useState} from 'react'
import { useSelector }from 'react-redux'
import hisopadosList from "../../../../assets/img/hisopados_list.svg"
import { GenericHeader } from '../../../GeneralComponents/Headers';
import {useHistory} from "react-router-dom";
import ConstancyHisopado from "./Constancy/ConstancyHisopado"
import ReactToPrint from 'react-to-print';

export default function ResultReveal({finalAction}) {
    const history = useHistory();
    const constRef = useRef()
    const { patient } = useSelector(state => state.queries)
    const date = useSelector(state => state.deliveryService?.deliveryInfo[0]?.docId)?.split("_")[1].slice(0,8)
    const result = useSelector(state => state.deliveryService?.deliveryInfo[0]?.lab?.result_lab)

    return (
        <>
          <GenericHeader children="Resultado hisopado" />
            <div className="allwhite-hisopados-background" >
                    <div className="instructions-container">
                        <img src={hisopadosList} alt="hisopados_list" className="hisopados_cross"/>
                        <p className="hisopados-title">Conoce tu resultado</p>
                        <p>Ya se encuentra a tu disposición el resutlado de tu hisopado</p>
                        <div onClick={() => finalAction()} className="blue-button">
                            Ver resultado
                        </div>
                        <ReactToPrint
						trigger={() => (
                            <div className="blue-text">Descargar constancia</div>
						)}
						content={() => constRef.current}
					/>
                    <div className="hisopado-results-contancy-dowloader">
                        <ConstancyHisopado patient={patient} date={date} result={result} ref={constRef}/>
                    </div>
                    </div>
            </div>
        </>
    )
}
