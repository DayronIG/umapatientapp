/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import GoogleMapReact from 'google-map-react';
import SearchBox from '../GeneralComponents/SearchBox';
import { currentPositionHandler, errorHandler, mapConfig } from '../Utils/mapsApiHandlers';
import { useDispatch } from 'react-redux';
import { handleDeliveryForm, setAddressLatLongHisopado } from '../../store/actions/deliveryActions';
import swal from 'sweetalert';
import Axios from 'axios';
import Loader from '../GeneralComponents/Loading';
import Marker from '../global/Marker';
import { mobility_address, node_patient } from '../../config/endpoints';
import { handleAddressValidForHisopado } from "../../store/actions/deliveryActions"
import MobileModal from "../GeneralComponents/Modal/MobileModal"
import '../../styles/deliveryService/selectDestiny.scss';

const DeliverySelectDestiny = ({isModal=false}) => {
	const dispatch = useDispatch();
	const { ws, incidente_id } = useParams();
	const [mapInstance, setMapInstance] = useState(undefined);
	const [mapApi, setMapApi] = useState(undefined);
	const [geocoder, setGeocoder] = useState(undefined);
	const [marker, setMarker] = useState({ lat: 0, lng: 0, text: '' });
	const user = useSelector(state => state.user);
	const { loading } = useSelector(state => state.front);
	const { addressLatLongHisopado, isAddressValidForHisopado, params, deliveryInfo, current, deliveryType } = useSelector(state => state.deliveryService);
	const [formState, setFormState] = useState({
		piso: user?.piso || '',
		depto: user?.depto || '',
		address: user?.address || '',
		lat: user?.lat || addressLatLongHisopado.lat || -34.6037389,
		lng: user?.lng || addressLatLongHisopado.lng || -58.3815704,
		searchBox: '',
	});
	const [userGeoguessedAddress, setUserGeoguessedAddress] = useState("")
	const history = useHistory()

	useEffect(() => {
		if(mapApi && mapInstance){
			async function fetchData() {
                let coords = [];
                if(params.zones?.caba) {
                    // eslint-disable-next-line array-callback-return
                    params.zones.caba.map(coord => {
                        let coordToNumber = {
                            lat: Number(coord.lat),
                            lng: Number(coord.lng)
                        }
                        coords.push(coordToNumber);
                    })
                }
                let coverage = new mapApi.Polygon({
                    paths: coords,
                    strokeColor: "#009042",
                    strokeOpacity: 0,
                    fillColor: "#009042",
                    fillOpacity: 0
				  });

				dispatch({type: "SET_DELIVERY_COVERAGE", payload: coords})

				let resultPath;
				setTimeout(()=>{
					resultPath = mapApi.geometry?.poly.containsLocation(
						new mapApi.LatLng(addressLatLongHisopado.lat, addressLatLongHisopado.lng),
						coverage
					)
					dispatch(handleAddressValidForHisopado(resultPath))
				}, 500)

            }
			fetchData();
		}
		setFormState({...formState, lat: addressLatLongHisopado.lat, lng: addressLatLongHisopado.lng})
	}, [mapApi, mapInstance, addressLatLongHisopado])

	useEffect(() => {
			const latlng = {
				lat: parseFloat(formState.lat),
				lng: parseFloat(formState.lng),
			};
			dispatch({type: "SET_ADDRESS_LAT_LONG_HISOPADO", payload: latlng})
			setMarker({ ...latlng, text: formState.address });
			setFormState({...formState, searchBox: userGeoguessedAddress, address: userGeoguessedAddress})
	}, [formState.lat, formState.lng, userGeoguessedAddress]);

	const handleApiLoaded = (map, maps) => {
		setMapInstance(map);
		setMapApi(maps);
		setGeocoder(new maps.Geocoder());
		if (!navigator.geolocation) return null;
		navigator.geolocation.getCurrentPosition((pos) => {
			console.log(pos)
			fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${pos.coords.latitude},${pos.coords.longitude}&key=AIzaSyDLnpXWJx1qKAfHtTeYWa30b9jGH2GeXfs`)
				.then(response => response.json())
				.then(apiData => {
					setUserGeoguessedAddress(apiData.results[0].formatted_address)
				})
			handleForm(currentPositionHandler(pos), true)}, errorHandler);

	};

	const handleForm = (event, isCoords = false) => {
		if (!isCoords) {
			const { value, id } = event.target;
			return setFormState({ ...formState, [id]: value });
		} else {
			return setFormState({ ...formState, ...event, searchBox: event.address });
		}
	};

	const handleChangePlace = (place) => {
		const pos = {
			lat: place?.lat || place?.geometry?.location?.lat() || "",
			lng: place?.lng || place?.geometry?.location?.lng() || "",
			address: place?.formatted_address,
		};
		dispatch(setAddressLatLongHisopado({lat: pos.lat, lng: pos.lng}))
		dispatch({type: 'SET_HISOPADO_USER_ADDRESS', payload:  place.formatted_address})
		return handleForm(pos, true);
	};

	function geocodeLatLng({ lat, lng }) {
		if (!geocoder) return null;
		let result;
		const latlng = {
			lat: parseFloat(lat) || -31.374420,
			lng: parseFloat(lng) || -64.132140,
		};
		dispatch(setAddressLatLongHisopado(latlng))
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
		if(!isModal){
		const headers = { 'Content-Type': 'Application/json', 'Authorization': localStorage.getItem('token') };
		const data = { newValues: formState };
		const data2 = {
			'key': deliveryType || 'HISOPADO',
			'ws': ws,
			'dni': user.dni,
			'format_address': formState.address,
			'user_address': formState.address,
			'lat': formState.lat,
			'lon': formState.lng,
			'floor': `${formState.piso}`,
			'number': `${formState.depto}`,
			'incidente_id': deliveryInfo?.[0]?.id || current.id,
			'range': isAddressValidForHisopado || false
		};
		try {
			// Primera request
			// await Axios.patch(`${node_patient}/${patient.dni}`, data, { credentials: 'include', headers });
			// Segunda request
			await Axios.post(mobility_address, data2, {headers});

			dispatch({ type: 'LOADING', payload: false });
		} catch (error) {
			dispatch({ type: 'LOADING', payload: false });
			swal('Error', 'Hubo un error inesperado, por favor intente nuevamente', 'error');
			return;
		}
		dispatch({type: 'SET_DELIVERY_STEP', payload: "ZONE_COVERED"})
		} else {
			e.preventDefault();
			dispatch({type: "SET_DEPENDANT_INFO", payload: {...formState, isAddressValidForHisopado: isAddressValidForHisopado}})
			dispatch({ type: 'LOADING', payload: false });
		}
		// history.push(`/hisopado/carrito/${ws}`)
	};


	return (
		<div className="container-map-component">
		{/* <MobileModal hideTitle hideCloseButton surveyHisopados noScroll> */}
		<form className={`${isModal? "modalMap": "selectDestiny "}`} onSubmit={handleSubmit}>
			{loading && <Loader />}
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
			<div className="selectDestiny__allcontainer">
			<h3 className="selectDestiny__header">Seleccioná tu <br/> domicilio</h3>
			<div className="selectDestiny__adjustmentDiv">
			<div className='selectDestiny__container'>
				<div className='selectDestiny__container--row'>
					{mapInstance && mapApi && <SearchBox map={mapInstance} mapApi={mapApi} id="searchBox" handleChangePlace={handleChangePlace} value={formState.searchBox}/>}
				</div>
			</div>
			<div className='selectDestiny__container'>
				<input
					onChange={handleForm}
					placeholder='Dirección'
					type='hidden'
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
			</div>
			<div onClick={(e) => handleSubmit(e)} className="map-button">
                Seleccionar
            </div>
			</div>
		</form>
		{/* </MobileModal> */}
		</div>
	);
};

export default DeliverySelectDestiny;
