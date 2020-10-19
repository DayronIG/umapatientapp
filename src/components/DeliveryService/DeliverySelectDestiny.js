import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import GoogleMapReact from 'google-map-react';
import SearchBox from '../GeneralComponents/SearchBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import FooterBtn from '../GeneralComponents/FooterBtn';
import { currentPositionHandler, errorHandler } from '../Utils/mapsApiHandlers';
import { useDispatch } from 'react-redux';
import { handleDeliveryForm } from '../../store/actions/deliveryActions';
import swal from 'sweetalert';
import Axios from 'axios';
import { GenericHeader } from '../GeneralComponents/Headers';
import { node_patient } from '../../config/endpoints';
import '../../styles/deliveryService/selectDestiny.scss';

const DeliverySelectDestiny = (props) => {
	const dispatch = useDispatch();
	const [{ ws, service, serviceId }] = useState(props.match.params);
	const [mapInstance, setMapInstance] = useState();
	const [mapApi, setMapApi] = useState();
	const [geocoder, setGeocoder] = useState();
	const [marker, setMarker] = useState({ lat: 0, lng: 0, text: '' });
	const [schemaValidation] = useState(['lat', 'lng', 'address']);
	const { patient } = useSelector((state) => state.queries);
	const [formState, setFormState] = useState({
		piso: patient?.piso || '',
		depto: patient?.depto || '',
		address: patient?.address || '',
		lat: patient?.lat || 0,
		lng: patient?.lng || 0,
	});

	const handleApiLoaded = (map, maps) => {
		console.log(map, maps);
		setMapInstance(map);
		setMapApi(maps);
		setGeocoder(new maps.Geocoder());
		if (!navigator.geolocation) return null;
		navigator.geolocation.getCurrentPosition((pos) => handleForm(currentPositionHandler(pos), true), errorHandler);
	};

	const handleForm = (event, isCoords = false) => {
		if (!isCoords) {
			const { value, key } = event.target;
			return setFormState({ ...formState, [key]: value });
		} else {
			return setFormState({ ...formState, ...event });
		}
	};

	const handleChangePlace = (place) => {
		const pos = {
			lat: place.lat || place.geometry.location.lat(),
			lng: place.lng || place.geometry.location.lng(),
			address: place.formatted_address,
		};
		return handleForm(pos, true);
	};

	useEffect(() => {
		if (mapInstance) {
			const latlng = {
				lat: parseFloat(formState.lat),
				lng: parseFloat(formState.lng),
			};
			setMarker({ ...latlng, text: formState.formatted_address });
		}
	}, [formState.lat, formState.lng]);

	function geocodeLatLng(lat, lng) {
		if (!geocoder) return null;
		let result;
		const latlng = {
			lat: parseFloat(lat),
			lng: parseFloat(lng),
		};
		console.log(latlng);
		geocoder.geocode({ location: latlng }, (results, status) => {
			if (status === 'OK') {
				if (results[0]) {
					result = results[0];
					handleChangePlace(result);
				} else {
					console.log('No results found');
				}
			} else {
				console.log('Geocoder failed due to: ' + status);
			}
		});
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		const isValidForm = schemaValidation.some((key) => !formState[key]);
		if (!isValidForm) return swal('Error', 'Por favor, vuelva a seleccionar la dirección', 'warning');
		dispatch(handleDeliveryForm(formState));
		const data = { newValues: formState };
		try {
			const res = await Axios.patch(`${node_patient}/${patient.dni}`, data, {headers: { 'Content-Type': 'Application/json', Authorization: localStorage.getItem('token') }});
			if (res.status !== 200) throw new Error('Error al enviar la request');
			return props.history.push(`/${ws}/deliveryService/trackProgress/${service}/${serviceId}`);
		} catch (error) {
			console.error(error);
			swal('Error', error.message, 'warning');
			return props.history.replace(`/${ws}`);
		}
	};

	return (
		<>
			<GenericHeader />
			<form className='selectDestiny' onSubmit={handleSubmit}>
				<div className='selectDestiny__container'>
					<div className='selectDestiny__container--row'>
						{mapInstance && mapApi && <SearchBox map={mapInstance} mapApi={mapApi} handleChangePlace={handleChangePlace} />}
						<button type='button'>Buscar</button>
					</div>
				</div>
				<div className='selectDestiny__container map'>
					<GoogleMapReact
						bootstrapURLKeys={{
							key: 'AIzaSyDLnpXWJx1qKAfHtTeYWa30b9jGH2GeXfs',
							libraries: ['places'],
						}}
						yesIWantToUseGoogleMapApiInternals
						center={{ lat: formState.lat, lng: formState.lng }}
						onClick={({ lat, lng }) => geocodeLatLng(lat, lng)}
						zoom={15}
						options={{
							streetViewControl: false,
							disableDefaultUI: false,
							mapTypeControl: false,
							styles: [
								{
									featureType: 'poi',
									elementType: 'labels',
									stylers: [{ visibility: 'on' }],
								},
							],
						}}
						onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
					>
						<FontAwesomeIcon className='selectDestiny__container--marker' {...marker} icon={faMapMarkerAlt} />
					</GoogleMapReact>
				</div>
				<div className='selectDestiny__container'>
					<input
						onChange={handleForm}
						placeholder='Dirección'
						type='text'
						name='address'
						id='address'
						required
						value={formState.address}
					/>
				</div>
				<div className='selectDestiny__container'>
					<div className='selectDestiny__container--row'>
						<input onChange={handleForm} placeholder='Piso' type='number' name='piso' id='piso' value={formState.piso} />
						<input
							onChange={handleForm}
							placeholder='Departamento'
							type='text'
							name='depto'
							id='depto'
							value={formState.depto}
						/>
					</div>
				</div>
				<FooterBtn type='submit' text='Continuar' />
			</form>
		</>
	);
};

export default withRouter(DeliverySelectDestiny);
