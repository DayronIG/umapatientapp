import React from 'react';
import UMAIcon from '../../assets/logo_original.png';
import '../../styles/generalcomponents/Loaders.scss';

export default function CustomUmaLoader() {
	return (
		<div className='umaLoader'>
			<div className='umaLoader__container'>
				<img src={UMAIcon} alt='' className='umaLoader__container--img' />
			</div>
			<div className='umaLoader__container'>
				<div className='umaLoader__container--loader absolute'></div>
			</div>
			<div className='umaLoader__container'>
				<p className='umaLoader__container--text'>Cargando...</p>
			</div>
		</div>
	);
}
export function Loader() {
	return <div className='loader'></div>;
}

export function DeliveryCustomLoader() {
	return (
		<div className='deliveryLoader'>
			<div className='loader' />
			<p>Buscando prestador, por favor espere...</p>
		</div>
	);
}
