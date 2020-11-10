import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import GoogleMapReact from 'google-map-react';
import { mapConfig, handleApiLoaded, mapBounds, routeDrawer } from '../Utils/mapsApiHandlers';
import { renderMarker, calculateFirstPoint, renderTitle } from '../Utils/transportUtils';
import { getTransportService } from '../../store/actions/transportActions';
import { useParams } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import Marker from '../global/Marker';

const TransportTracking = () => {
	const [userLocation, setUserLocation] = useState({ lng: 0, lat: 0 });
	const { service } = useSelector(state => state.transport);
	const { patient } = useSelector(state => state.queries);
	const [mapBounder, setMapBounder] = useState(undefined);
	const [drawRoute, setDrawRoute] = useState(undefined);
	const [openTravel, setOpenTravel] = useState(false);
	const [eta, setEta] = useState('No hay datos disponibles');
	// const [remis, setRemis] = useState({});
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

	useEffect(() => {
		if (typeof mapBounder === 'function') {
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
		if (typeof drawRoute === 'function') {
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
					{...mapConfig({ lat: userLocation.lat, lng: userLocation.lng })}
					onGoogleApiLoaded={setMapFunctions}
				>
				<Marker
					lat={service.current_position_remis?.lat || 0}
					lng={service.current_position_remis?.lon || 0}
					text='Tú ubicación' type="remis" 
				/>
				<Marker
					{...renderMarker(service)}
				/>
				</GoogleMapReact>
			</div>
			<div className='transportDetails__container'>
				<h4 className='transportDetails__container--title'>{renderTitle(service)}</h4>
				<p>Llegará en {eta}.</p>
				<div className="transportDriver">
					{/*
						<div className="transportDriverImg">
							<img src={}></img> 
						</div> 
					*/}
					<div className="transportDriverData">
						<p>{service.provider_fullname || ''}</p>
						<p>DNI: {service.provider_id || '' } </p>
					</div>
				</div>
				<div className="openContent">
					{openTravel ?
						<button onClick={() => setOpenTravel(!openTravel)}><FaChevronUp /></button> :
						<button onClick={() => setOpenTravel(!openTravel)}>Ver detalles <FaChevronDown /></button>
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
