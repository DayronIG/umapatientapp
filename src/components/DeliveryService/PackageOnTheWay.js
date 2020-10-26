import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import GoogleMapReact from 'google-map-react';
import { mapConfig, handleApiLoaded, mapBounds, routeDrawer } from '../Utils/mapsApiHandlers';
import DeliveryResume from './DeliveryResume';
import Marker from '../global/Marker';
import useInterval from '../Hooks/useInterval';

const PackageOnTheWay = ({ title, status }) => {
	const [userLocation, setUserLocation] = useState({ lng: 0, lat: 0 });
	const { modifiedObjService } = useSelector(state => state.deliveryService);
	const [mapBounder, setMapBounder] = useState(undefined);
	const [drawRoute, setDrawRoute] = useState(undefined);
	const [duration, setDuration] = useState(undefined);

	function setMapFunctions({ map, maps }) {
		const dirServ = new maps.DirectionsService();
		const dirRenderer = new maps.DirectionsRenderer();
		dirRenderer.setMap(map);
		setDrawRoute(() => routeDrawer(maps, dirServ, dirRenderer));
		setMapBounder(() => mapBounds(map, maps));
		handleApiLoaded(setUserLocation);
	}

	useInterval(() => {
		if (typeof drawRoute === 'function') {
			const userPos = {
				lat: modifiedObjService.user_lat,
				lng: modifiedObjService.user_lng
			};
			drawRoute(
				{
					lng: modifiedObjService.delivery_lng, 
					lat: modifiedObjService.delivery_lat
				}, 
				userPos
			)
			.then(res => setDuration(res))
			.catch(err => console.error(err));
		}
	}, 5000);

	useEffect(() => {
		if (typeof mapBounder === 'function') {
			mapBounder([
				{
					lat: modifiedObjService.delivery_lat,
					lng: modifiedObjService.delivery_lng
				},
				{
					lat: modifiedObjService.user_lat,
					lng: modifiedObjService.user_lng
				}
			]);
		}
	}, [mapBounder, modifiedObjService])
	
	return (
		<>
			<GoogleMapReact
				{...mapConfig({ lat: userLocation.lat, lng: userLocation.lng })}
				onGoogleApiLoaded={setMapFunctions}
			>
				<Marker
					lat={modifiedObjService.delivery_lat}
					lng={modifiedObjService.delivery_lng}
					text='Ubicación del remis'
				/>
				<Marker
					lat={modifiedObjService.user_lat}
					lng={modifiedObjService.user_lng}
					text='Tú ubicación'
				/>
			</GoogleMapReact>
			<DeliveryResume state={title} duration={duration} />
		</>
	);
};

export default PackageOnTheWay;
