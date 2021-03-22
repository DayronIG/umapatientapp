import React, {useRef, useState, useEffect} from 'react'
import { useSelector }from 'react-redux'
import hisopadosList from "../../../../assets/img/hisopados_list.svg"
import { GenericHeader } from '../../../GeneralComponents/Headers';
import {useHistory} from "react-router-dom";
import ConstancyHisopado from "./Constancy/ConstancyHisopado"
import ReactToPrint from 'react-to-print';
import moment from 'moment';

export default function ResultReveal({finalAction}) {
    const constRef = useRef()
    // const user = useSelector(state => state.user)
    const {currentHisopadoIndex} = useSelector(state => state.deliveryService)
    const hisopado = useSelector(state => state.deliveryService?.deliveryInfo[currentHisopadoIndex])
	const user = useSelector(state => state.deliveryService?.deliveryInfo[currentHisopadoIndex]?.patient)
    const docId = useSelector(state => state.deliveryService?.deliveryInfo[currentHisopadoIndex]?.docId)
    const [date, setDate] = useState(docId?.split("_")[1].slice(0,8))
    const result = useSelector(state => state.deliveryService?.deliveryInfo[currentHisopadoIndex]?.lab?.result_lab);
    const [constancy, showConstancy] = useState(false);
    const history = useHistory()

    useEffect(() => {
        console.log(result)
        if(docId !== undefined && result !== 'CANCEL') {
            showConstancy(true);
            console.log(hisopado.dt_arrived)
            if(hisopado.dt_arrived && hisopado.dt_arrived !== "") {
                console.log(docId?.split("_")[1].slice(0,8), hisopado.dt_arrived.toDate(), moment(new Date(hisopado.dt_arrived.toDate())).format('DD-MM-YYYY'))
                setDate(hisopado.dt_arrived.toDate())
            }
        }
    }, [docId])

    return (
        <>
          <GenericHeader children="Resultado hisopado" />
            <div className="allwhite-hisopados-background" >
                <div className="instructions-container">
                    <img src={hisopadosList} alt="hisopados_list" className="hisopados_cross"/>
                    {result !== 'CANCEL' && 
                    <>
                    <p className="hisopados-title">Conoce tu resultado</p>
                    <p>Ya se encuentra a tu disposición el resutlado de tu hisopado</p>
                    </>
                    }
                    {
                        constancy ?
                    <div onClick={() => finalAction()} className="blue-button">
                        Ver resultado
                    </div>:
                    <div onClick={() => history.push('/')} className="blue-button">
                        Ir al inicio
                    </div>                
                    }
                    {
                        constancy &&
                        <ReactToPrint
                            trigger={() => (
                                <div className="blue-text">Descargar constancia</div>
                            )}
                            content={() => constRef.current}
                        />
                    }
                    {
                        constancy && docId && 
                        <div className="hisopado-results-contancy-dowloader">
                            <ConstancyHisopado id={docId} patient={user} date={date} result={result} ref={constRef}/>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}
