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
        setLastMr(mr.slice(0, 3))
   }, [mr])

    return (
        <section className="history-container">
            <h5 className="title">Mi historia</h5>
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