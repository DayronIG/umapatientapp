import React from 'react';
import '../../styles/hisopado/hisopado.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const BuyHisopado = () => (
    <section className="hisopado__container">
        <h2 className="hisopado__title">¡Comprá tu hisopado a domicilio!</h2>
        <button className="hisopado__btn">Conocer más <FontAwesomeIcon icon={faArrowRight} /></button>
    </section>
);

export default BuyHisopado;