import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import GoogleMapReact from 'google-map-react';
import { mapConfig, handleApiLoaded, mapBounds, routeDrawer } from '../Utils/mapsApiHandlers';
import { getTransportService } from '../../store/actions/transportActions';
import { useParams } from 'react-router-dom';
import useInterval from '../Hooks/useInterval';

const TransportTracking = () => {
	const [userLocation, setUserLocation] = useState({ lng: 0, lat: 0 });
	const { service } = useSelector(state => state.transport);
	const { patient } = useSelector(state => state.queries);
	const [mapBounder, setMapBounder] = useState(undefined);
	const [drawRoute, setDrawRoute] = useState(undefined);
	const params = useParams();

	function setMapFunctions({ map, maps }) {
		const dirServ = new maps.DirectionsService();
		const dirRenderer = new maps.DirectionsRenderer();
		dirRenderer.setMap(map);
		setDrawRoute(() => routeDrawer(maps, dirServ, dirRenderer));
		setMapBounder(() => mapBounds(map, maps));
		handleApiLoaded(setUserLocation);
	}

	useEffect(() => {
		let unsubscribe;
		if(patient?.corporate_norm) {
			unsubscribe = getTransportService({ ...params, corporate: patient.corporate_norm });
		}
		return () => {
			if (typeof unsubscribe === 'function') unsubscribe();
		}
	}, [patient]);

	// function generateRoutePoints() {
	// 	return ({
	// 		lng: service.request?.geo_inicio?.lon,
	// 		lat: service.request?.geo_inicio?.lat
	// 	},
	// 	{
	// 		lat: service.request?.geo_fin?.lat,
	// 		lng: service.request?.geo_fin?.lon
	// 	});
	// }

	useInterval(() => {
		if (typeof drawRoute === 'function') {
			drawRoute({
				lng: service.request?.geo_inicio?.lon,
				lat: service.request?.geo_inicio?.lat
			},
			{
				lat: service.request?.geo_fin?.lat,
				lng: service.request?.geo_fin?.lon
			});
		}
	}, 4000);

	console.log(service);
	
	useEffect(() => {
		if (typeof mapBounder === 'function') {
			console.log('IN FUNCTION', service);
			mapBounder([
				{
					lng: service.request?.geo_inicio?.lon,
					lat: service.request?.geo_inicio?.lat
				},
				{
					lat: service.request?.geo_fin?.lat,
					lng: service.request?.geo_fin?.lon
				}
			]);
		}
	}, [mapBounder, service]);

	return (
		<div>
			<div className='transportDetails__map'>
				<GoogleMapReact
					{...mapConfig({ lat: userLocation.lat, lng: userLocation.lng })}
					onGoogleApiLoaded={setMapFunctions}
				/>
			</div>
			<div className='transportDetails__container'>
				<ul>
					<li><span>Origen:</span> {service.request?.geo_inicio.address}.</li>
					<li><span>Destino:</span> {service.request?.geo_fin.address}.</li>
					<li><span>Notas:</span> {service.request?.notas}.</li>
					<li><span>Remis:</span>  {service.provider_fullname}.</li>
					<li><span>Estatus:</span> {service.current_state}</li>
					<li><span>Tiempo estimado:</span> {service.request?.eta_tramo}</li>
					<li><span>Hora de llegada a destino:</span> {service.hora}</li>
				</ul>
			</div>
		</div>
	);
};

export default TransportTracking;
