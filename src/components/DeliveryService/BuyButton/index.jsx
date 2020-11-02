import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {useSelector} from 'react-redux';
import '../../../styles/hisopado/delivery.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import HomeHisopado from '../../../assets/img/home-hisopado.png';
import {getDocumentFB} from "../../Utils/firebaseUtils"

const BuyHisopado = () => {
    const history = useHistory()
    const patient = useSelector((state) => state.queries.patient)
    const price = useSelector((state) => state.deliveryService.params.price);
    const [active, setActive] = useState(false)
    const state = ""

    const buyHisopado = () => {
		window.gtag('event', 'view_promotion', {
            'items': 'Hisopado Antígeno',
            'promotion_id': '1',
            'promotion_name': 'Hisopado',
            'location_id': 'home' 
		  });
        history.push(`/hisopado/${patient.ws}`)
    }

    const getActive = async () => {
        const data = await getDocumentFB("parametros/hisopados")
        if (data.active === "true"){
            setActive(true)
        }
        if (data.active === "false"){
            setActive(false)
        }
    }

    useEffect(() => {
        getActive()
    }, [])

    const renderButtonContentFromState = () => {
        if(active){
            switch (state){
                case(""):
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
            }
        } else{
            return <></>
        }
    }
    
    return renderButtonContentFromState()
}

export default BuyHisopado;