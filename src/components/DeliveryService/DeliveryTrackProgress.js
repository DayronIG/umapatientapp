import React, { useState, useEffect } from 'react';
import { calculateProgressPercentage } from '../Utils/deliveryServicesUtils';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import PackageOnTheWay from './PackageOnTheWay';
import DeliveryProgressBar from './DeliveryProgressBar';
import NotFound from '../GeneralComponents/NotFound';
import Rating from '../OnlineDoctor/Rating/Rating';
import { DeliveryCustomLoader } from '../GeneralComponents/Loading';
import DeliveryResume from './DeliveryResume';
import { GenericHeader } from '../GeneralComponents/Headers';
import { withRouter } from 'react-router-dom';
import '../../styles/deliveryService/trackProgress.scss';

const DeliveryTrackProgress = (props) => {
	// assignations/delivery/bag -> al estilo medicos. Se crea un documento on-demand.
	const [{ ws, service, incidenteId }] = useState(props.match.params);
	const [percent, setPercent] = useState(0);
	const [track, setTrack] = useState({
		active: 'searchingProvider',
		incidente_id: '202008241530_95976131',
		lat: 0,
		lng: 0,
		progress: [
			{ text: 'Buscando prestador', icon: faCircle, active: true },
			{ text: 'Asignado. ETA: 15 mins', icon: faCircle, active: false },
			{ text: 'En vía', icon: faCircle, active: false },
			{ text: 'Llegó a destino', icon: faCircle, active: false },
		],
		deliveryData: {
			service: 'Hisopado a domicilio',
			doctor: 'Gustavo Daquarti',
			cuit: '20959761311',
			enrollment: '142706',
		},
	});

	useEffect(() => {
		// (async function getServiceState() {
		// getDocumentFB('/events/requests/online/props.match.params.incidente_id')
		// setTrack()
		// })();
		setPercent(calculateProgressPercentage(track.progress));
	}, []);

	const renderComponentByTrackProgress = (step) => {
		switch (step) {
			case 'searchingProvider':
				return <DeliveryCustomLoader />;
			case 'packageOnTheWay':
				return (
					<>
						<PackageOnTheWay
							providerCuit={track.providerCuit}
							providerPos={{
								lat: track.lat,
								lng: track.lng,
							}}
						/>
						<DeliveryResume deliveryData={track.deliveryData} />
					</>
				);
			case 'deliverySurvey':
				return <Rating />;
			default:
				return <NotFound />;
		}
	};

	return (
		<>
			<GenericHeader />
			<section className='trackProgress'>
				<div className='trackProgress__container progressBar'>
					<DeliveryProgressBar progress={track.progress} percent={percent} />
				</div>
				<div className='trackProgress__container map'>{renderComponentByTrackProgress(track.active)}</div>
			</section>
		</>
	);
};

export default withRouter(DeliveryTrackProgress);
