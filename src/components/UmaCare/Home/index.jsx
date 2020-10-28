import React from 'react';
import iconUmaCare from '../../../assets/icons/icon-umaCare.svg';
import '../../../styles/home/umaCare.scss';

const UmaCareHome = () => (
    <section className="uma__container">
        <div className="title__container">
            <img src={iconUmaCare} alt="UMA Care"/>
            <h2 className="title">UMA Care</h2>        
        </div>
        <div className="content__container">
            <p className="text__nothing">Aún no tienes ningún tratamiento en curso.</p>
        </div>
    </section>
);

export default UmaCareHome;