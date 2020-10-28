import React from 'react';
import iconTraslados from '../../../assets/icons/icon-traslados.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import '../../../styles/home/traslados.scss';

const TrasladosHome = () => (
    <section className="traslados__container">
        <div className="title__container">
            <img src={iconTraslados} alt="UMA Care"/>
            <h2 className="title">Traslados</h2>        
        </div>
        <div className="content__container">
            <p className="text__nothing">Aún no tienes ningún traslado programado</p>
        </div>
        <button className="traslados__btn">
            Programar traslado
            <FontAwesomeIcon icon={faChevronRight} />
        </button>
    </section>
);

export default TrasladosHome;