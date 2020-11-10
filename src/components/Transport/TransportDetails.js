import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import GoogleMapReact from 'google-map-react';
import { mapConfig, handleApiLoaded, mapBounds, routeDrawer } from '../Utils/mapsApiHandlers';
import { getTransportService } from '../../store/actions/transportActions';
import { useParams } from 'react-router-dom';
import {AiOutlineArrowDown, AiOutlineArrowUp} from 'react-icons/ai';
import useInterval from '../Hooks/useInterval';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

const TransportTracking = () => {
	const [userLocation, setUserLocation] = useState({ lng: 0, lat: 0 });
	const { service } = useSelector(state => state.transport);
	const { patient } = useSelector(state => state.queries);
	const [mapBounder, setMapBounder] = useState(undefined);
	const [drawRoute, setDrawRoute] = useState(undefined);
	const [openTravel, setOpenTravel] = useState(false);
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
	
	useEffect(() => {
		if (typeof mapBounder === 'function') {
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

	useEffect(() => {
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
	}, [drawRoute, service]);

	return (
		<div>
			<div className='transportDetails__map'>
				<GoogleMapReact
					{...mapConfig({ lat: userLocation.lat, lng: userLocation.lng })}
					onGoogleApiLoaded={setMapFunctions}
				/>
			</div>
			<div className='transportDetails__container'>
				<h5 className='transportDetails__container--title'>Tu conductor está en camino</h5>
				<p>Llegará en {service.request?.eta_tramo}.</p>
				<div className="transportDriver">
					<div className="transportDriverImg">
						{/* <img src={}></img> */}
					</div>
					<div className="transportDriverData">
					<p>{service.provider_fullname || ''}</p>
					<p>DNI: {service.provider_id || '' } </p></div>
					</div>
					<div className="openContent">
						{openTravel ?
							<button onClick={() => setOpenTravel(!openTravel)}><FaChevronUp /></button> :
							<button onClick={() => setOpenTravel(!openTravel)}> Ver detalles <FaChevronDown /> </button>
						}
					</div>
					{openTravel &&
						<ul className="driverUl">
							<li className="originLi">
								<p className="originP">Origen:</p> 
								<p className="originText">{service.request?.geo_inicio.address}</p>
							</li>
							<li className="originLi">
								<p className="originP">Destino:</p> 
								<p className="originText">{service.request?.geo_fin.address}</p>
							</li>
							<li className="originLi">
								<p className="originP">Hora de llegada:</p> 
								<p className="originText">{service.hora}</p>
							</li>
							<li className="originLi">
								<p className="originP">Notas:</p> 
								<p className="originText">{service.request?.notas || "No hay notas"}</p>
							</li>
						</ul>
					}
			</div>
		</div>
	);
};

export default TransportTracking;
