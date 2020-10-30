import React from 'react';
import {useHistory} from 'react-router-dom';
import {useSelector} from 'react-redux';
import '../../styles/hisopado/hisopado.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const BuyHisopado = () => {
    const history = useHistory()
    const patient = useSelector((state) => state.queries.patient)

    const buyHisopado = () => {
		window.gtag('event', 'select_item', {
			'item_list_name': 'Hisopado Antígeno'
		  });
        history.push(`/hisopado/${patient.ws}`)
    }
    
    return <section className="hisopado__container" onClick={() => buyHisopado()}>
        <h2 className="hisopado__title">¡Comprá tu hisopado a domicilio!</h2>
        <button className="hisopado__btn">Conocer más <FontAwesomeIcon icon={faArrowRight} /></button>
    </section>
}

export default BuyHisopado;