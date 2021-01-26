import React from 'react';
import {BackButton} from '../GeneralComponents/Headers';
import '../../styles/hisopado/Corporate.scss';
import { useSelector } from "react-redux";
import {useHistory} from 'react-router-dom';
import {FaChevronRight} from 'react-icons/fa'

const HisopadoCorporate = () => {
    const history = useHistory();
    const {dni, ws} = useSelector((state) => state.user);
    const price = useSelector((state) => state.deliveryService.params?.price);

    return (
        <>
            <BackButton />
            <section className="hisopado__corporate">
                <h2>¿Cómo tener mi hisopado?</h2>

                <article>
                    <h3>¿Tienes obra social?</h3>

                    <p>Para que la obra social autorice el hisopado, debes realizar una videoconsulta con un <strong>médico de guardia.</strong></p>

                    <p>Puedes hacerlo a través de la aplicación de ÜMA.</p>

                    <button onClick={() => history.push(`/onlinedoctor/who/${dni}`)}>Atenderme por guardia <FaChevronRight /></button>
                </article>

                <article>
                    <h3>¿Eres particular?</h3>

                    <p>Si tu obra social <strong><u>no</u></strong> te cubre el hisopado, puedes realizártelo con ÜMA a sólo ${price}.</p>

                    <p>¡Pídelo ahora y tendrás tu resultado mañana!</p>

                    <button onClick={() => history.push(`/hisopado/${ws}`)}>Comprar hisopado <FaChevronRight /></button>
                </article>
            </section>
        </>
    )
}

export default HisopadoCorporate;