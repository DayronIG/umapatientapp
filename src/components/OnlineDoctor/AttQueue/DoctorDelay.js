import React, {useState, useEffect, useCallback} from 'react';
import moment from 'moment';
import { getDocumentsByFilter } from '../../Utils/firebaseUtils';

const DoctorDelay = ({cuit, date, time}) => {
    const [queue, setQueue] = useState('1');
    const [delay, setDelay] = useState('5');

    useEffect(() => {
        getDelayAndQueue()
		let interval = setInterval(()=> {
            getDelayAndQueue()
        }, 60000)
        return () => interval
    }, [cuit]);

    const getDelayAndQueue = useCallback(() => {
        let dt = moment().format('YYYYMM');
        if(cuit && cuit !== '' && cuit !== 'bag'){
			let filters = [
				{field: 'cuit', value: cuit, comparator: '=='},
				{field: 'status', value: 'ASSIGN', comparator: '=='}			
			]
			getDocumentsByFilter(`/assignations/online_clinica_medica/${dt}`, filters)
				.then(res => {
					setQueue(res.length || 1)
                    let pendingTime = moment(`${date} ${time}:00`).diff(new Date(), 'minutes')
                    if(pendingTime <= 0) {
                        pendingTime = 5
                    }
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
                {field: 'datetime', value: '202103220558', comparator: '<='}
            ]
            getDocumentsByFilter(`/assignations/online_clinica_medica/bag`, filters)
                .then(res => {
                    setQueue(res.length || 1)
                })
                .catch(err => setQueue(0))
        }
    }, [cuit])
    
    return <div className="appointment__delay--container">
        {(queue && queue.length >= 1) && <div className="appointment__delay">
            <span className="appointment__number">{queue}</span>
            <span className="appointment__detail">pacientes en espera</span>
        </div>}
        {cuit && cuit.length > 5 && <div className="appointment__delay">
            <span className="appointment__number">{delay}</span>
            <span className="appointment__detail">minutos de espera aprox.</span>
        </div>}
    </div>
}

export default DoctorDelay;