import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import GoogleMapReact from 'google-map-react';
import { mapConfig, handleApiLoaded, mapBounds, routeDrawer } from '../Utils/mapsApiHandlers';
import DeliveryResume from './DeliveryResume';
import Marker from '../global/Marker';
import useInterval from '../Hooks/useInterval';
import db from "../../config/DBConnection"

const PackageOnTheWay = ({ active }) => {
	const [userLocation, setUserLocation] = useState({ lng: 0, lat: 0 });
	const {currentHisopadoIndex} = useSelector(state => state.deliveryService)
	const {delivery,  destination} = useSelector(state => state.deliveryService.deliveryInfo[currentHisopadoIndex]);
	const {deliveryLatLongProviders} = useSelector(state => state.deliveryService)
	const [mapBounder, setMapBounder] = useState(undefined);
	const [drawRoute, setDrawRoute] = useState(undefined);
	const [duration, setDuration] = useState(undefined);
	const firestore = db.firestore();
	const dispatch = useDispatch()

	function snapDeliveryLatLon(){
		return firestore
		.collection('providers')
		.doc(`${delivery?.cuit_nurse}`)
		.collection('tracking')
		.doc('geo')
		.onSnapshot((snap) => {
			dispatch({type:'SET_DELIVERY_LAT_LONG_PROVIDERS', payload: {
				lat: parseFloat(snap.data()?.lat),
				lon: parseFloat(snap.data()?.lon)
			}})
		}, err => {
			console.error(err)
		});
	}

	useEffect(() => {
		let snapDelivery = () => {}
		if(delivery){
			snapDelivery = snapDeliveryLatLon()
		}
		return () => snapDelivery()
	}, [delivery])

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
					lng: deliveryLatLongProviders.lon, 
					lat: deliveryLatLongProviders.lat
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
					lat: deliveryLatLongProviders.lat,
					lng: deliveryLatLongProviders.lon
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
					lat={deliveryLatLongProviders.lat}
					lng={deliveryLatLongProviders.lon}
					text='Ubicación del profesional'
					type = 'remis'
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
