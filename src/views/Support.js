import React from 'react';
import {useHistory, useParams} from 'react-router-dom';
import BackButton from '../components/GeneralComponents/Backbutton';
import GuardiaSupport from '../components/OnlineDoctor/Support/GuardiaSupport.jsx'
import '../styles/support/Support.scss';

const Support = () => {
    const history = useHistory()
    const {section} = useParams()
    
    const renderSection = () => {
        switch(section){
            case 'guardia':
                return <GuardiaSupport />
            default:
                return <div>Cargando</div>
        }
    }

    return(
        <>
            <BackButton action={()=> history.push(`/`)} />
            <div className="support__container">
                <h2>¿En qué te podemos ayudar?</h2>
                {renderSection()}
            </div>
        </>
    )
}

export default Support;