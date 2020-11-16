import React from 'react'
import {useSelector} from "react-redux";
import {FaArrowRight} from "react-icons/fa"

export default function ButtonStyle({finalAction}) {
    const quantity = useSelector((state) => state.deliveryService.deliveryInfo).length
    
    return (
        <section className="all_hisopado__container" onClick={() => finalAction()}>
        <div className="all_hisopado__content">
            {quantity} Hisopados en curso <FaArrowRight className="icon" />
        </div>
    </section>
    )
}
