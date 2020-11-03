import React from 'react'
import {useSelector} from "react-redux";
import HomeHisopado from '../../../assets/img/home-hisopado.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function ButtonStyle({title, innerText, checkoutText, finalAction, showPrice = false}) {
    const price = useSelector((state) => state.deliveryService.params.price);
    
    return (
        <section className="hisopado__container" onClick={() => finalAction()}>
        <img src={HomeHisopado} className="hisopado__img" alt="¡Hisopate hoy!"/>
        <div className="hisopado__content">
            <div className={`hisopado__info ${showPrice && "active__hisopado"}`}>
            <h2 className="hisopado__title">{title}</h2>
            <p className="hisopado__text">{innerText}</p>
                <button className="hisopado__btn">{checkoutText} <FontAwesomeIcon icon={faArrowRight} /></button>
            </div>
            {showPrice && <div className="hisopado__price">
                <p>A sólo <span>${price}</span></p>
            </div>}
        </div>
    </section>
    )
}
