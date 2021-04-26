import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import RiskFactor from './Questionnaire/RiskFactor';
import Allergy from './Questionnaire/Allergy';
import Operations from './Questionnaire/Operations';
import Fractures from './Questionnaire/Fractures';
import AnotherConditions from './Questionnaire/AnotherConditions';
import FamilyBackground from './Questionnaire/FamilyBackground';
import { HistoryHeader } from '../../GeneralComponents/Headers';
import '../../../styles/profile/antecedents.scss';

const AntecedentScreen = () => {
    const history = useHistory()
    const params = useParams() 

    const SwitchContent = () => {
        switch (params.section) {
            case 'risk':
                return <RiskFactor/>;
            case 'allergy':
                return <Allergy/>;
            case 'operations':
                return <Operations/>;
            case 'fracture':
                return <Fractures/>;
            case 'otherconditions':
                return <AnotherConditions/>;
            case 'familybackground':
                return <FamilyBackground/>;
            default:
                return history.goBack();
        }
    }

    return (
        <section className='antecedents__container'>
            <HistoryHeader />
            <section className='antecedents__container__generic'>
                <div className={`progressBar ${params.section}`}></div>
                    <article className='mainText'>
                        {params.section === 'risk' && <h1>¡Comencemos!</h1>}
                        {params.section === 'familybackground' && <h1>¡Ya casi terminamos!</h1>}
                        <h2>Vamos a hacerte unas preguntas sobre tus antecedentes de salud.</h2>
                    </article>
                <SwitchContent/>
            </section>
        </section>
    )
}

export default AntecedentScreen;
