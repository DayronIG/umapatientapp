import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import GoogleMapReact from 'google-map-react';
import { mapConfig, handleApiLoaded, mapBounds, routeDrawer } from '../Utils/mapsApiHandlers';
import DeliveryResume from './DeliveryResume';
import Marker from '../global/Marker';
import useInterval from '../Hooks/useInterval';

const PackageOnTheWay = ({ active }) => {
	const [userLocation, setUserLocation] = useState({ lng: 0, lat: 0 });
	const { delivery,  destination} = useSelector(state => state.deliveryService.deliveryInfo[0]);
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
				lat: destination.user_lat,
				lng: destination.user_lon
			};
			drawRoute(
				{
					lng: delivery.lon_delivery, 
					lat: delivery.lat_delivery
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
					lat: delivery.lat_delivery,
					lng: delivery.lon_delivery
				},
				{
					lat: destination.user_lat,
					lng: destination.user_lng
				}
			]);
		}
	}, [mapBounder, delivery])
	
	return (
		<>
			<GoogleMapReact
				{...mapConfig({ lat: userLocation.lat, lng: userLocation.lng })}
				onGoogleApiLoaded={setMapFunctions}
			>
				<Marker
					lat={delivery.lat_delivery}
					lng={delivery.lon_delivery}
					text='Ubicación del remis'
				/>
				<Marker
					lat={destination.user_lat}
					lng={destination.user_lon}
					text='Tú ubicación'
				/>
			</GoogleMapReact>
			<DeliveryResume duration={duration} active={active} />
		</>
	);
};

export default PackageOnTheWay;
