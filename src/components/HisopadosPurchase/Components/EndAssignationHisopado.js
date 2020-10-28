import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; 
import { useHistory } from 'react-router-dom';
import hisopadosPay from "../../../assets/img/hisopados_pay.png";

export default function EndAssignationHisopado() {
    const [loaderWidth, setLoaderWidth] = useState(50);
    const history = useHistory();
    const { ws } = useSelector(state => state.queries.patient);

    useEffect(() => {
        if(ws) {
            history.push(`/${ws}/delivery/progress/94429191_202010281140/`)
        }
    }, [ws]);
        
    return (
        <div className="allwhite-hisopados-background" >
                <div className="instructions-container">
                    <img src={hisopadosPay} alt="hisopados_tic" className="hisopados_cross"/>
                    <p className="hisopados-title">¡Hemos recibido su pago!</p>
                    <p>Estamos buscando al profesional más cercano para realizar el hisopado</p>
                    <p>Aguarde unos instantes</p>
                    <div className="progress">
                        <div className="progress-blue" style={{width: `${loaderWidth}%`}}></div>
                    </div>
                </div>
        </div>
    )
}
