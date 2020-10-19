import React from 'react';
import { useSelector } from 'react-redux';
import '../../styles/deliveryService/deliveryResume.scss';

function DeliveryResume({ deliveryData }) {
	const { patient } = useSelector((state) => state.queries);
	return (
		<section className='deliveryResume'>
			<div className='deliveryResume__container'>
				<h5 className='deliveryResume__container--title'>Servicio</h5>
				<ul className='deliveryResume__container--list'>
					<li>Servicio: {deliveryData.service}</li>
					<li>Doctor: {deliveryData.doctor}</li>
					<li>Cuit: {deliveryData.cuit}</li>
					<li>Matrícula: {deliveryData.enrollment}</li>
				</ul>
			</div>
			<div className='deliveryResume__container'>
				<h5 className='deliveryResume__container--title'>Paciente:</h5>
				<ul className='deliveryResume__container--list'>
					<li>Nombre: {patient.fullname}</li>
					<li>Dirección: {patient.address}</li>
					<li>Fecha de nacimiento: patient.dob</li>
				</ul>
			</div>
		</section>
	);
}

export default DeliveryResume;
