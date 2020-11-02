import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {useSelector} from 'react-redux';
import '../../../styles/hisopado/delivery.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import HomeHisopado from '../../../assets/img/home-hisopado.png';

const BuyHisopado = () => {
    const history = useHistory()
    const patient = useSelector((state) => state.queries.patient)
    const price = useSelector((state) => state.deliveryService.params.price);
    const deliveryStatus = useSelector((state) => state.deliveryService.deliveryInfo?.status) || "FREE"

    const buyHisopado = () => {
		window.gtag('event', 'view_promotion', {
            'items': 'Hisopado Antígeno',
            'promotion_id': '1',
            'promotion_name': 'Hisopado',
            'location_id': 'home' 
		  });
        history.push(`/hisopado/${patient.ws}`)
    }

    //CAMBIOSANTI MANDAR A MAPA Y A RESULT

    const renderButtonContentFromState = () => {
            switch (deliveryStatus){
                case("FREE"):
                    return (
                        <section className="hisopado__container" onClick={() => buyHisopado()}>
                            <img src={HomeHisopado} className="hisopado__img" alt="¡Hisopate hoy!"/>
                            <div className="hisopado__content">
                                <div className="hisopado__info">
                                    <h2 className="hisopado__title">¡Hisópate hoy!</h2>
                                    <p className="hisopado__text">Hazte tu testeo a domicilio.</p>
                                    <button className="hisopado__btn">Conocer más <FontAwesomeIcon icon={faArrowRight} /></button>
                                </div>
                                <div className="hisopado__price">
                                    <p>A sólo <span>${price}</span></p>
                                </div>
                            </div>
                        </section>
                    )
                case("ASSIGN:DELIVERY"):
                    return (
                        <section className="hisopado__container" onClick={() => history.push(`/`)}>
                            <div className="hisopado__content">
                                <div className="hisopado__info">
                                    <h2 className="hisopado__title">¡Sigue tu hisopado!</h2>
                                    <p className="hisopado__text">En camino</p>
                                    <button className="hisopado__btn">Ver estado <FontAwesomeIcon icon={faArrowRight} /></button>
                                </div>
                            </div>
                        </section>
                    )
                case("DONE:RESULT"):
                    return (
                        <section className="hisopado__container" onClick={() => history.push(`/`)}>
                            <div className="hisopado__content">
                                <div className="hisopado__info">
                                    <h2 className="hisopado__title">¡Están tus resultados!</h2>
                                    <p className="hisopado__text">Mira el resultado de tu hisopado</p>
                                    <button className="hisopado__btn">Ver resultado <FontAwesomeIcon icon={faArrowRight} /></button>
                                </div>
                            </div>
                        </section>
                    )
                default:
                    return <></>
    }}
    
    return renderButtonContentFromState()
}

export default BuyHisopado;