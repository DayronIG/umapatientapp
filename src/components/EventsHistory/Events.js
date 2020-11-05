import React from 'react'
import {withRouter} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment-timezone';
import { faBus, faUserNurse } from '@fortawesome/free-solid-svg-icons'


const Events = (props) => {
    let { data, display } = props
    
    const renderEvents = () => {
        return (
            <>
            {data.map((record, index) => {
                return (record.mr && record.mr.destino_final !== "" && 
                <div className="event" key={index} 
                    onClick={(e) => props.history.push(`/${record.patient.ws}/history/${record.patient.dni}/${record.assignation_id}`)}>
                    <div>
                        <FontAwesomeIcon icon={faUserNurse} />
                        <span>Consulta Online</span>
                    </div>
                    <strong>
                        {moment(record.created_dt).format("DD-MM-YYYY")}
                    </strong>
                </div>)
            })}
            </>
        )
    }
    return (
        <>
            {renderEvents()}
        </>
    )
}

export default withRouter(Events);