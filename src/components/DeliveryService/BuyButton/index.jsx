import React from 'react';
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

    const buyHisopado = () => {
		window.gtag('event', 'select_item', {
			'item_list_name': 'Hisopado Antígeno'
		  });
        history.push(`/hisopado/${patient.ws}`)
    }
    
    return <section className="hisopado__container" onClick={() => buyHisopado()}>
        <img src={HomeHisopado} className="hisopado__img" alt="¡Hisopate hoy!"/>
        <div className="hisopado__content">
            <div className="hisopado__info">
                <h2 className="hisopado__title">¡Hisopate hoy!</h2>
                <p className="hisopado__text">Hacete tu testeo a domicilio.</p>
                <button className="hisopado__btn">Conocer más <FontAwesomeIcon icon={faArrowRight} /></button>
            </div>
            <div className="hisopado__price">
                <p>A sólo <span>${price}</span></p>
            </div>
        </div>
    </section>
}

export default BuyHisopado;