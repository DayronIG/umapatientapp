import React, { useEffect } from 'react';
import { useSelector } from "react-redux";

export default function Recomendations({goBack}) {
    const patient = useSelector(state => state.queries.patient)
    const discount = useSelector(state => state.deliveryService.params.discount)

    useEffect(() => {
        window.scroll(0,0)
    }, [])

    return (
        <div className="allwhite-hisopados-background" >
            <div className="results-container">
                <p className="hisopados-title">Sigue las siguientes recomendaciones</p>
            </div>
            <ul className="recommendations-ul">
                <li>Resguardarse en casa y evitar estar en contacto con otras personas por al menos 14 días.</li>
                <li>Procurar mantener el distanciamiento físico de familia y mascotas, y en lo posible usar un dormitorio y baño separados.</li>
                <li>No compartir platos, vasos, cubiertos, toallas, almohadas u otros artículos con otras personas, y lavarlos minuciosamente después de usarlos.</li>
                <li>Tomarse la temperatura dos veces al día.</li>
                <li>Toser o estornudar en el pliegue del codo.</li>
                <li>Lavarse las manos de manera frecuente con agua y jabón durante al menos 60 segundos o usar un desinfectante de manos.</li>
                <li>Ventilar regularmente los ambientes.</li>
                <li>Desinfectar superficies comunes con una solución de agua e hipoclorito de sodio (colocar 100 ml de lavandina de uso doméstico en 10 litros de agua).</li>
                <li>Chequear la evolución o aparición de síntomas.</li>
            </ul>
            <div className="hisopados-flux-results-container">
                <p className="bold-text">Informale a tus contactos estrechos para que tomen medidas de prevención</p>
                <div className="blue-button">
                    <a href={`whatsapp://send?text=Hola, he dado positivo en COVID al realizarme un hisopado a domicilio. Te invito a que vos también te realices el hisopado con un 10% de descuento, utilizando el siguiente código: ${discount.code}. Podés además realizar un seguimiento preventivo de tus síntomas ingresando a UMA en el siguiente link https://app.uma-health.com/referredRegister/hisopado`} className="link_whatsapp">
                        Informar a mis contactos
                    </a>
                </div>
                <p>Ingresando el siguiente código, obtienen un descuento para realizarse el hisopado a domicilio:</p>
                <div className="hisopados-flux-results-code-container">
                <p className="hisopados-code">{discount.code}</p>
                </div>
            </div>
            <div onClick={() => goBack()} className="blue-text">
                Volver
            </div>
        </div>
    )
}
