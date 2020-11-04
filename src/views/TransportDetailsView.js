import React from 'react';
import { useParams } from 'react-router-dom';
import { BackButton, GenericHeader } from '../components/GeneralComponents/Headers';
import TransportTracking from '../components/Transport/TransportDetails';
import '../styles/transport/transportDetails.scss';


function TransportDetailsView() {
	const { ws } = useParams();
	return (
		<section className='transportDetails'>
			<GenericHeader>Estatus del traslado</GenericHeader>
			<div className='transportDetails__backBtn'>
				<BackButton customTarget={`/${ws}/transportUserActive`} />
			</div>
			<TransportTracking />
		</section>
	);
}


export default TransportDetailsView;