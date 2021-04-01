import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RiskFactor, Parents } from '../MyBackground/Questionnaire';
// import BackButton from '../../GeneralComponents/Backbutton';
import { HistoryHeader } from '../../GeneralComponents/Headers';
import '../../../styles/profile/antecedents.scss';

const Antecedent =()=> {
    const history = useHistory()
    const params = useParams()
    const patient = useSelector(state => state.user)

    const SwitchContent = () => {
		if (params.section === 'risk') {
			return <RiskFactor/>
		} else if (params.section === 'parents') {
            return <Parents/>
        } else {
			history.push()
		}
    }

    return (
        <section className='antecedents__container'>
            <HistoryHeader/>
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
