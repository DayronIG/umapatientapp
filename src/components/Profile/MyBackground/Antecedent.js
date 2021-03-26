import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RiskFactor, Parents } from '../MyBackground/Questionnaire';
import BackButton from '../../GeneralComponents/Backbutton';
import '../../../styles/profile/antecedents.scss';

const Antecedent =()=> {
    const params = useParams()
    const patient = useSelector(state => state.user)

    const SwitchContent = () => {
		if (params.section === 'risk') {
			return <RiskFactor/>
		} else if (params.section === 'parents') {
                        return <Parents/>
                } else {
			return 'Esta sección aún no se encuentra disponible';
		}
    }

    return (
        <section className='antecedents__container'>
            <BackButton customTarget={`/profile/${patient.core_id}`}/>
            <section className='antecedents__container__generic'>
                <div className='progressBar'></div>
                <article className='mainText'>
                    <h1>¡Comencemos!</h1>
                    <h2>Vamos a hacerte unas preguntas sobre tus antecedentes de salud.</h2>
                </article>
                <SwitchContent/>
            </section>
        </section>
    )
}



export default Antecedent;
