import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import GoogleMapReact from 'google-map-react';
import { mapConfig, errorHandler, currentPositionHandler } from '../Utils/mapsApiHandlers';
import Loader from '../GeneralComponents/Loading';
import FooterBtn from '../GeneralComponents/FooterBtn';
import Marker from '../global/Marker';
import SearchBox from '../GeneralComponents/SearchBox';
import { useHistory, useParams } from 'react-router-dom';
import {
	setInitialOriginPoint,
	handlePoints,
	handleInputs,
} from '../../store/actions/transportActions';
import '../../styles/deliveryService/selectDestiny.scss';

const CreateTransportRoute = () => {
	const user = useSelector(state => state.user);
	const { loading } = useSelector(state => state.front);
	const { destiny, pointSelector } = useSelector(state => state.transport);
	const [mapInstance, setMapInstance] = useState(undefined);
	const [mapApi, setMapApi] = useState(undefined);
	const [geocoder, setGeocoder] = useState(undefined);
	const { ws } = useParams();
	const history = useHistory();

	useEffect(() => {
		setInitialOriginPoint(user);
	}, [user]);

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
		console.log(pointSelector);
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
		history.push(`/${ws}/scheduleTransport`);
	};

	return (
		<form className='selectDestiny' onSubmit={handleSubmit}>
			{loading && <Loader />}
			<div className='selectDestiny__container'>
				<h5 className='selectDestiny__container--title'>
					{pointSelector === 'origin' ? 'Seleccione punto de partida' : 'Seleccione punto de llegada'}
				</h5>
			</div>
			<div className='selectDestiny__container'>
				<div className='selectDestiny__container--row'>
					{(mapInstance && mapApi) && (
						<SearchBox
							map={mapInstance}
							mapApi={mapApi}
							handleChangePlace={handleChangePlace}
						/>
					)}
				</div>
			</div>
			<div className='selectDestiny__container map'>
				<GoogleMapReact
					{...mapConfig(
						{ lat: parseFloat(destiny.lat), lng: parseFloat(destiny.lng) },
						geocodeLatLng
					)}
					onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
				>
					{destiny.lat && (
						<Marker {...destiny} />
					)}
				</GoogleMapReact>
			</div>
			<div className='selectDestiny__container'>
				<input
					placeholder='Dirección'
					type='text'
					name='address'
					id='address'
					disabled
					value={destiny.address}
				/>
			</div>
			<div className='selectDestiny__container'>
				<div className='selectDestiny__container--row'>
					<input
						onChange={handleInputs(pointSelector)}
						placeholder='Piso'
						type='number'
						name='floor'
						id='floor'
						value={destiny.floor}
					/>
					<input
						onChange={handleInputs(pointSelector)}
						placeholder='Departamento'
						type='text'
						name='department'
						id='department'
						value={destiny.department}
					/>
				</div>
			</div>
			<FooterBtn callback={handleSubmit} text='Continuar' />
		</form>
	);
};

export default CreateTransportRoute;
