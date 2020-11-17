import React, { useEffect } from 'react'
import hisopadosNeg from "../../../assets/img/estamos_con_vos.svg"
import { FaClock, FaArrowRight } from "react-icons/fa"
import { GiTransparentTubes } from "react-icons/gi"
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import db from "../../../config/DBConnection";

export default function ReferredInvitation({finalAction}) {
    const history = useHistory(); 
    const patient = useSelector(state => state.queries.patient)
    const purchases = useSelector(state => state.deliveryService.deliveryInfo)
    const dispatch = useDispatch()

    const getCurrentServices = () => {
        db.firestore().collection('events/requests/delivery')
        .where('patient.uid', '==', patient?.core_id)
        .where('status', 'in', ["PREASSIGN",'ASSIGN:DELIVERY', 'ASSIGN:ARRIVED', "DONE:RESULT"])
        .get()
        .then(res => {
            res.forEach(services => {
                let document = {...services.data(), id: services.id}
                console.log(document)
                dispatch({type: 'SET_DELIVERY_CURRENT', payload: document})
                dispatch({type: 'SET_DELIVERY', payload: document})
            })
        })
    }

    useEffect(()=>{
        getCurrentServices()
    },[])

    return (
        <div className="allwhite-hisopados-background list_purchased hisopados-flux" >
                <div className="results-container">
                    <img src={hisopadosNeg} alt="hisopado_neg" className="estamos_con_vos"/>
                    <p className="hisopados-title">Sigue tus hisopados</p>
                </div>
                <div className="results-menu-map-container">
                    {purchases.map((purchase, index) => {
                    return (<div className="results-menu-map-item"
                        onClick={() => dispatch({type: "SET_CURRENT_INDEX", payload: index})}
                    >
                            {purchase.destination.user_address} 
                            En camino
                            < FaClock /> Entrega estimada 1 hora 
                            <FaArrowRight className="icon-arrow" />
                    </div>)
                    })}

{/*                     <div className="results-menu-map-item highlighted-color"
                        onClick={() => history.push(`/hisopado/${patient.ws}`)}
                        >
                        <div>
                            <GiTransparentTubes className="icon" />
                            Comprar hisopado
                        </div>
                        <FaArrowRight className="icon-arrow" />
                    </div> */}

                </div>
        </div>
    )
}
