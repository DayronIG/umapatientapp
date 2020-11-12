import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import GoogleMapReact from 'google-map-react';
import { mapConfig, mapBounds, routeDrawer } from '../Utils/mapsApiHandlers';
import { renderMarker, calculateFirstPoint, renderTitle, renderTimeMessage } from '../Utils/transportUtils';
import { getTransportService } from '../../store/actions/transportActions';
import { useParams, useHistory } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import Marker from '../global/Marker';

const TransportTracking = () => {
	const { service } = useSelector(state => state.transport);
	const { patient } = useSelector(state => state.queries);
	const [mapBounder, setMapBounder] = useState(undefined);
	const [drawRoute, setDrawRoute] = useState(undefined);
	const [openTravel, setOpenTravel] = useState(false);
	const [eta, setEta] = useState('No hay datos disponibles');
	const params = useParams();
	const history = useHistory();
	// const [remis, setRemis] = useState({});

	function setMapFunctions({ map, maps }) {
		const dirServ = new maps.DirectionsService();
		const dirRenderer = new maps.DirectionsRenderer();
		dirRenderer.setMap(map);
		setDrawRoute(() => routeDrawer(maps, dirServ, dirRenderer));
		setMapBounder(() => mapBounds(map, maps));
	}

	useEffect(() => {
		if(service.status_tramo === 'FINISHED') {
			history.replace(`/${patient.ws}/transportRating/${params.assignation_id}`);
		}
	}, [service]);
	
	useEffect(() => {
		let unsubscribe;
		if (patient?.corporate_norm) {
			unsubscribe = getTransportService({ ...params, corporate: patient.corporate_norm });
		}
		return () => {
			if (typeof unsubscribe === 'function') unsubscribe();
		}
	}, [patient]);

	useEffect(() => {
		if (typeof mapBounder === 'function' && service?.current_position_remis) {
			mapBounder([
				calculateFirstPoint(service),
				{
					lat: service.current_position_remis?.lat,
					lng: service.current_position_remis?.lon
				}
			]);
		}
	}, [mapBounder, service]);

	useEffect(() => {
		if (typeof drawRoute === 'function' && service?.current_position_remis) {
			drawRoute(
				calculateFirstPoint(service),
				{
					lat: service.current_position_remis?.lat,
					lng: service.current_position_remis?.lon
				}
			).then(eta => setEta(eta));
		}
	}, [drawRoute, service]);

	return (
		<div>
			<div className='transportDetails__map'>
				<GoogleMapReact
					{...mapConfig({ 
						lat: service?.current_position_remis?.lat || 0, 
						lng: service?.current_position_remis?.lon  || 0 
					})}
					onGoogleApiLoaded={setMapFunctions}
				>
					{service?.current_position_remis?.lat && 
						<Marker
							lat={service?.current_position_remis?.lat || 0}
							lng={service?.current_position_remis?.lon || 0}
							text='Ubicacion del remis' type='remis' 
						/>
					}
					<Marker {...renderMarker(service)} />
				</GoogleMapReact>
			</div>
			<div className='transportDetails__container'>
				<h4 className='transportDetails__container--title'>{renderTitle(service?.status_tramo)}</h4>
				<p>Tiempo estimado: {eta ? eta : 'No hay datos disponibles.'}</p>
				<div className='transportDriver'>
					<div className='transportDriverData'>
						<p>Conductor: {service.provider_fullname || ''}</p>
						<p>CUIT: {service.provider_id || '' } </p>
					</div>
				</div>
				<div className='openContent'>
					{openTravel ?
						<button onClick={() => setOpenTravel(!openTravel)}><FaChevronUp /></button> :
						<button onClick={() => setOpenTravel(!openTravel)}>Ver detalles <FaChevronDown /></button>
					}
				</div>
				{openTravel &&
					<ul className='driverUl'>
						<li className='originLi'>
							<p className='originP'>Origen:</p> 
							<p className='originText'>{service.request?.geo_inicio.address}</p>
						</li>
						<li className='originLi'>
							<p className='originP'>Destino:</p> 
							<p className='originText'>{service.request?.geo_fin.address}</p>
						</li>
						<li className='originLi'>
							<p className='originP'>{renderTimeMessage(service.trip_type)}:</p> 
							<p className='originText'>{service.hora}</p>
						</li>
						<li className='originLi'>
							<p className='originP'>Notas:</p> 
							<p className='originText'>{service.request?.notas || 'No hay notas'}</p>
						</li>
					</ul>
				}
			</div>
		</div>
	);
};

export default TransportTracking;
