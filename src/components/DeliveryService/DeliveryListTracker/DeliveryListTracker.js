import React, {useState, useEffect} from 'react'
import hisopadosNeg from "../../../assets/img/estamos_con_vos.svg"
import { FaClock, FaArrowRight } from "react-icons/fa"
import { GiTransparentTubes } from "react-icons/gi"
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import db from "../../../config/DBConnection";


export default function ReferredInvitation({finalAction}) {
    const history = useHistory(); 
    const patient = useSelector(state => state.queries.patient)
    const dispatch = useDispatch()
    const [purchases, setPurchases] = useState([])

    const getCurrentService = () => {
        console.log(patient.core_id)
        db.firestore().collection('events/requests/delivery')
        .where('patient.uid', '==', patient?.core_id)
        .where('status', 'in', ['PREASSIGN', 'ASSIGN:DELIVERY', 'ASSIGN:ARRIVED', 'DONE:RESULT'])
        .get()
        .then(res => {
            res.forEach(services => {
                let document = {...services.data(), id: services.id}
                setPurchases([...purchases, document])
            })
        })
    }

    useEffect(() => {
        if(patient.core_id){
            getCurrentService()
        }
        console.log(purchases)
    }, [patient.core_id])

    return (
        <div className="allwhite-hisopados-background hisopados-flux" >
                <div className="results-container">
                    <img src={hisopadosNeg} alt="hisopado_neg" className="estamos_con_vos"/>
                    <p className="hisopados-title">Sigue tu hisopado</p>
                </div>
                <div className="results-menu-map-container">
                    <div className="results-menu-map-item fit_content_item"
                    onClick={() => console.log("ASD")}>
                        <div>
                            <p className="item_address">Av. Melián 2752</p>
                            <p className="item_status">En camino</p>
                            <p className="item_time"><FaClock className="clock_icon" />Entrega estimada: 1 hora</p>
                        </div>
                        <FaArrowRight className="icon-arrow" />
                    </div>
                    
                    <div className="results-menu-map-item highlighted-color"
                        onClick={() => history.push(`/hisopado/${patient.ws}`)}
                        >
                        <div>
                            <GiTransparentTubes className="icon" />
                            Comprar hisopado
                        </div>
                        <FaArrowRight className="icon-arrow" />
                    </div>
                </div>
        </div>
    )
}
