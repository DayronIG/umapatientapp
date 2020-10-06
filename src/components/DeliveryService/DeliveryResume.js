import React, { useState, useEffect } from 'react';
import db from '../../config/DBConnection';
import { useSelector } from 'react-redux';
import { get_provider } from '../../config/endpoints';
import Axios from 'axios';
import '../../styles/deliveryService/deliveryResume.scss';

function DeliveryResume({ state, duration }) {
	const { modifiedObjService = {}, currentService = {} } = useSelector(state => state.deliveryService);
	const { deliveryData = {}, status_derivacion } = modifiedObjService;
	const [nurseData, setNurseData] = useState(null);

	useEffect(() => {
		if(!deliveryData.cuit_nurse) return;
		Axios.get(`${get_provider}/${deliveryData.cuit_nurse}`)
		.then(res => setNurseData(res.data))
		.catch(err => console.log(err));
	},[])
	  
	return (
		<>
			{nurseData && <section className='deliveryResume'>
				<div className='deliveryResume__container'>
					<ul className='deliveryResume__container--list'>
						<li><span className="deliveryResume__container--item">Profesional asignado: </span>{nurseData.fullname}</li>
						<li><span className="deliveryResume__container--item">Estado: </span>{state}</li>
						{status_derivacion === 'ASSIGN' && duration && <li><span className="deliveryResume__container--item">Tiempo estimado: </span>{duration}</li>}

					</ul>
				</div>
			</section>}
		</>
	);
}

export default DeliveryResume;
