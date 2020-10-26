/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import GoogleMapReact from 'google-map-react';
import SearchBox from '../GeneralComponents/SearchBox';
import FooterBtn from '../GeneralComponents/FooterBtn';
import { currentPositionHandler, errorHandler, mapConfig } from '../Utils/mapsApiHandlers';
import { useDispatch } from 'react-redux';
import { handleDeliveryForm } from '../../store/actions/deliveryActions';
import swal from 'sweetalert';
import Axios from 'axios';
import Loader from '../GeneralComponents/Loading';
import Marker from '../global/Marker';
import { mobility_address, node_patient } from '../../config/endpoints';
import '../../styles/deliveryService/selectDestiny.scss';

const DeliverySelectDestiny = () => {
	const dispatch = useDispatch();
	const { ws, incidente_id } = useParams();
	const [mapInstance, setMapInstance] = useState(undefined);
	const [mapApi, setMapApi] = useState(undefined);
	const [geocoder, setGeocoder] = useState(undefined);
	const [marker, setMarker] = useState({ lat: 0, lng: 0, text: '' });
	const { patient } = useSelector(state => state.queries);
	const { loading } = useSelector(state => state.front);
	const [formState, setFormState] = useState({
		piso: patient?.piso || '',
		depto: patient?.depto || '',
		address: patient?.address || '',
		lat: patient?.lat || 0,
		lng: patient?.lng || 0,
	});

	useEffect(() => {
		if (mapInstance) {
			const latlng = {
				lat: parseFloat(formState.lat),
				lng: parseFloat(formState.lng),
			};
			setMarker({ ...latlng, text: formState.address });
		}
	}, [formState.lat, formState.lng]);

	const handleApiLoaded = (map, maps) => {
		setMapInstance(map);
		setMapApi(maps);
		setGeocoder(new maps.Geocoder());
		if (!navigator.geolocation) return null;
		navigator.geolocation.getCurrentPosition((pos) => handleForm(currentPositionHandler(pos), true), errorHandler);
	};

	const handleForm = (event, isCoords = false) => {
		if (!isCoords) {
			const { value, id } = event.target;
			return setFormState({ ...formState, [id]: value });
		} else {
			return setFormState({ ...formState, ...event });
		}
	};

	const handleChangePlace = (place) => {
		const pos = {
			lat: place?.lat || place?.geometry?.location?.lat() || -34.5633064,
			lng: place?.lng || place?.geometry?.location?.lng() || -58.4759768,
			address: place?.formatted_address,
		};
		return handleForm(pos, true);
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
	}

	async function handleSubmit(e) {
		e.preventDefault();
		if (['lat', 'lng', 'address'].some((key) => !formState[key] || formState[key] === "")) {
			return swal('Error', 'Por favor, seleccione una dirección', 'warning');
		}
		dispatch({ type: 'LOADING', payload: true });
		dispatch(handleDeliveryForm(formState));
		const headers = { 'Content-Type': 'Application/json', 'Authorization': localStorage.getItem('token') };
		const data = { newValues: formState };
		const data2 = {
			'key': 'HISOPADO',
			'ws': ws,
			'dni': patient.dni,
			'format_address': formState.address,
			'user_address': formState.address,
			'lat': formState.lat,
			'lon': formState.lng,
			'piso_dpto': `${formState.depto} ${formState.piso}`,
			'incidente_id': incidente_id
		};
		try {
			// Primera request
			await Axios.patch(`${node_patient}/${patient.dni}`, data, { credentials: 'include', headers });
			// Segunda request
			await Axios.post(mobility_address, data2, headers);

			dispatch({ type: 'LOADING', payload: false });
		} catch (error) {
			dispatch({ type: 'LOADING', payload: false });
			console.error(error.message);
			swal('Error', 'Hubo un error inesperado, por favor intente nuevamente', 'error');
			return;
		}
	};

	return (
		<form className='selectDestiny' onSubmit={handleSubmit}>
			{loading && <Loader />}
			<h3 className="selectDestiny__header">Confirma tu domicilio</h3>
			<div className='selectDestiny__container'>
				<div className='selectDestiny__container--row'>
					{mapInstance && mapApi && <SearchBox map={mapInstance} mapApi={mapApi} handleChangePlace={handleChangePlace} />}
				</div>
			</div>
			<div className='selectDestiny__container map'>
				<GoogleMapReact
					{...mapConfig(
						{ lat: formState.lat, lng: formState.lng },
						geocodeLatLng
					)}
					onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
				>
					<Marker  {...marker} />
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
			<FooterBtn callback={handleSubmit} text='Continuar' />
		</form>
	);
};

export default DeliverySelectDestiny;
