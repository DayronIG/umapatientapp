import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux"
import Events from "./Events";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const HistoryHome = ({ user }) => {
    const [lastMr, setLastMr] = useState([{created_dt: ''}])
    const patient = useSelector(state => state.queries.patient)
    const mr = useSelector(state => state.queries.medicalRecord)

   useEffect(() => {
        setLastMr(mr.filter(el=> {
            return el.mr.destino_final !== "" 
            && el.mr.destino_final !== "Paciente Ausente"
            && el.mr.destino_final !== "Anula por falla de conexión"
            && el.mr.destino_final !== "USER CANCEL"
            && el.mr.destino_final !== "Anula el paciente"
        }).slice(0, 5))
   }, [mr])
    
    return (
        <section className="history__container">
            <h5 className="title">Mi historial</h5>
            {lastMr && lastMr.length === 0 ?
                <div className="text-center p-2">Aún no hay eventos registrados.</div>
                :
                <Events data={lastMr} />}
                <Link to={`/${patient.ws}/history`} className="history-link">
                    Ver todo el historial
                    <FontAwesomeIcon icon={faChevronRight} />
                </Link>
        </section>
    )
}

export default HistoryHome