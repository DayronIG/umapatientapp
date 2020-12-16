import React from 'react'
import {useSelector} from "react-redux";
import {FaArrowRight} from "react-icons/fa"

export default function ButtonStyle({finalAction}) {
    const quantity = useSelector((state) => state.deliveryService.deliveryInfo).filter(el => !["FREE", "FREE:IN_RANGE", "DEPENDANT"].includes(el.status)).length

    return (
        <section className="all_hisopado__container" onClick={() => finalAction()}>
        <div className="all_hisopado__content">
            Seguí {quantity > 1 ? ' tus hisopados': 'tu hisopado'} <FaArrowRight className="icon" />
        </div>
    </section>
    )
}
