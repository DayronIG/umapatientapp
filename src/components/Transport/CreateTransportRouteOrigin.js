import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GoogleMapReact from 'google-map-react';
import { mapConfig, errorHandler, currentPositionHandler } from '../Utils/mapsApiHandlers';
import Loader from '../GeneralComponents/Loading';
import FooterBtn from '../GeneralComponents/FooterBtn';
import Marker from '../global/Marker';
import SearchBox from '../GeneralComponents/SearchBox';
import {
	setInitialOriginPoint,
	handlePoints,
	handleInputs,
	setNextPoint
} from '../../store/actions/transportActions';
import '../../styles/deliveryService/selectDestiny.scss';

const CreateTransportRoute = () => {
	const { patient } = useSelector(state => state.queries);
	const { loading } = useSelector(state => state.front);
	const { origin, pointSelector } = useSelector(state => state.transport);
	const [mapInstance, setMapInstance] = useState(undefined);
	const [mapApi, setMapApi] = useState(undefined);
	const [geocoder, setGeocoder] = useState(undefined);
	
	useEffect(() =>{
		window.gtag('event', 'select_content', {content_type: "CREATE_TRANSPORT_ROUTE_ORIGIN", item: ['CREATE_TRANSPORT_ROUTE_ORIGIN']})
	},[])

	useEffect(() => {
		setInitialOriginPoint(patient);
	}, [patient]);

	const handleApiLoaded = (map, maps) => {
		if (!map || !maps) return null;
		setMapInstance(map);
		setMapApi(maps);
		setGeocoder(new maps.Geocoder());
		if (!navigator.geolocation) return null;
		navigator.geolocation.getCurrentPosition((pos) => handlePoints(pointSelector)(currentPositionHandler(pos)), errorHandler);
	};

	const handleChangePlace = (place) => {
		const pos = {
			lat: place?.lat || place?.geometry?.location?.lat(),
			lng: place?.lng || place?.geometry?.location?.lng(),
			address: place?.formatted_address,
			text: place?.formatted_address,
		};
		if (!pos.lng || !pos.lat) return null;
		return handlePoints(pointSelector)(pos);
	};

	function geocodeLatLng({ lat, lng }) {
		if (!geocoder) return null;
		let result;
		const latlng = {
			lat: parseFloat(lat),
			lng: parseFloat(lng),
		};
		geocoder.geocode({ location: latlng }, (results, status) => {
			if (status === 'OK') {
				if (results[0]) {
					result = results[0];
					handleChangePlace(result);
				}
			}
		});
	};

	async function handleSubmit(e) {
		e.preventDefault();
		setNextPoint();
	};

	return (
		<form className='selectDestiny' onSubmit={handleSubmit}>
			{loading && <Loader />}
			<div className='selectDestiny__container map' style={{ zIndex: -1 }}>
				<GoogleMapReact
					{...mapConfig(
						{ lat: parseFloat(origin.lat), lng: parseFloat(origin.lng) },
						geocodeLatLng
					)}
					onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
				>
					{origin.lat && <Marker {...origin} />}
				</GoogleMapReact>
			</div>
			<div className='selectDestiny__container formInputs'>
				<div className='selectDestiny__container--title'>
					<h5>¿De dónde sales?</h5>
				</div>
				<div className='selectDestiny__container--text'>
					<p>Ingresa la dirección de donde saldrás</p>
				</div>
				<div className='selectDestiny__container--row'>
					{(mapInstance && mapApi) && (
						<SearchBox
							map={mapInstance}
							mapApi={mapApi}
							handleChangePlace={handleChangePlace}
							placeholder='Ingresa el punto de origen'
						/>
					)}
				</div>
				<div className='selectDestiny__container--row'>
					<input
						onChange={handleInputs(pointSelector)}
						placeholder='Piso'
						type='number'
						name='piso'
						id='piso'
						value={origin.piso}
					/>
					<input
						onChange={handleInputs(pointSelector)}
						placeholder='Departamento'
						type='text'
						name='depto'
						id='depto'
						value={origin.depto}
					/>
				</div>
				<div className='selectDestiny__container--row'>
					<button type='button' onClick={handleSubmit}>
						Continuar
					</button>
				</div>
			</div>
		</form>
	);
};

export default CreateTransportRoute;
