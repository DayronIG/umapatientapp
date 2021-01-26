import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { getDocumentsByFilter } from '../../Utils/firebaseUtils';

const DoctorDelay = ({ cuit, date, time }) => {
    const [queue, setQueue] = useState('0');
    const [delay, setDelay] = useState('5');

    useEffect(() => {
        getDelayAndQueue()
        let interval = setInterval(() => {
            getDelayAndQueue()
        }, 60000)
        return () => interval
    }, [cuit]);

    const getDelayAndQueue = useCallback(() => {
        if (cuit && cuit !== '') {
            let dt = moment().format('YYYYMM');
            let filters = [
                { field: 'cuit', value: cuit, comparator: '==' },
                { field: 'status', value: 'ASSIGN', comparator: '==' }
            ]
            getDocumentsByFilter(`/assignations/online_clinica_medica/${dt}`, filters)
                .then(res => {
                    setQueue(res.length)
                    let pendingTime = moment(`${date} ${time}:00`).diff(new Date(), 'minutes')
                    if (pendingTime <= 0) {
                        pendingTime = 5
                    }
                    console.log(pendingTime)
                    if (res.length >= 1) {
                        setDelay(res.length * 10 + pendingTime)
                    } else {
                        setDelay(pendingTime)
                    }
                })
        }
    }, [cuit, date, time])

    return <div className="appointment__delay--container">
        <div className="appointment__delay">
            <span className="appointment__number">{queue}</span>
            <span className="appointment__detail">pacientes en espera</span>
        </div>
        <div className="appointment__delay">
            <span className="appointment__number">{delay}</span>
            <span className="appointment__detail">minutos de espera aprox.</span>
        </div>
    </div>
}

export default DoctorDelay;