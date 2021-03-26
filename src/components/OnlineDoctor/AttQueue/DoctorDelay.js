import React, {useState, useEffect, useCallback} from 'react';
import {useSelector} from 'react-redux';
import moment from 'moment';
import { getDocumentsByFilter, getDocumentFB } from '../../Utils/firebaseUtils';

const DoctorDelay = ({cuit, date, time}) => {
    const appointment = useSelector(state=> state.queries.assignedAppointment)
    const [active, setActive] = useState(1)
    const [queue, setQueue] = useState(0);
    const [delay, setDelay] = useState(0);

    useEffect(() => {
        getDelayAndQueue();
		let interval = setInterval(() => {
            getDelayAndQueue();
        }, 10000)
        return () => interval
    }, [cuit]);

    const getDelayAndQueue = useCallback(async () => {
        let dt = moment().format('YYYYMM');
        if(cuit && cuit !== undefined && cuit !== '' && cuit !== 'bag'){
			let filters = [
				{field: 'cuit', value: cuit, comparator: '=='},
				{field: 'status', value: 'ASSIGN', comparator: '=='}			
			]
			await getDocumentsByFilter(`/assignations/online_clinica_medica/${dt}`, filters)
				.then(res => {
					setQueue(res.length || 1)
                    let pendingTime = moment(`${date} ${time}:00`).diff(new Date(), 'minutes')
					if(res.length >= 1){
						setDelay(res.length * 10 + pendingTime)
					} else {
						setDelay(pendingTime)
					}
                })
            .catch(err => console.log(err))
		} else {
            let filters = [
                {field: 'state', value: 'ASSIGN', comparator: '=='},
                {field: 'datetime', value: `${appointment.datetime}`, comparator: '<='}
            ]
            let userQueue = await getDocumentsByFilter(`/assignations/online_clinica_medica/bag`, filters)
                .then(res => {
                    setQueue(res.length || 1)
                    return res.length
                })
                .catch(err => setQueue(0))
            await getDocumentFB(`/assignations/guardia/stats/${moment().tz('America/Argentina/Buenos_Aires').subtract(1, 'minutes')
                    .format('YYYYMMDDHHmm')}`).then(res => {
                        if(res) {
                            setActive(res.active_doctors)
                            let calcDelay = parseInt((userQueue / res.active_doctors) * 8.25)
                            !isNaN(calcDelay) ? setDelay(calcDelay) : setDelay(0)
                            setQueue(userQueue)
                            // console.log(res, userQueue)
                        }
                    })
        }
    }, [active])
    
    return <div className="appointment__delay--container">
        {queue >= 1 && <div className="appointment__delay">
            <span className="appointment__number">{queue}</span>
            <span className="appointment__detail">pacientes en espera</span>
        </div>}
        {delay >= 1 && <div className="appointment__delay">
            <span className="appointment__number">{delay}</span>
            <span className="appointment__detail">minutos de espera aprox.</span>
        </div>}
    </div>
}

export default DoctorDelay;