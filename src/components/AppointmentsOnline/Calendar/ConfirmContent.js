import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getDoctor, getUser } from '../../../store/actions/firebaseQueries';
import { CustomUmaLoader } from '../../global/Spinner/Loaders';
import { make_appointment } from '../../../config/endpoints';
import FooterBtn from '../../GeneralComponents/FooterBtn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMd } from '@fortawesome/free-solid-svg-icons';
import { writeOSData } from '../../../store/actions/UPActions';
import { underscoreToSpaces } from '../../Utils/stringUtils';
import { post } from 'axios';
import AttachFile from '../AttachFile';
import moment from 'moment-timezone';
import swal from 'sweetalert';

import '../../../styles/map/mapSidebar.scss';

const SidebarContent = ({ match, appoint, history, unsetSelected, specialty }) => {
	const [doctor, setDoctor] = useState({});
	const [coordinates, setCoordinates] = useState({ lat: '', lon: '' });
	const { selectedSymptomsString } = useSelector((state) => state.assessment);
	const { upNumAff_store } = useSelector((state) => state.queries);
	const { loading } = useSelector((state) => state.front);
	const dispatch = useDispatch();
	const { dni } = match.params;
	const token = useSelector((state) => state.userActive.token);

	const watchError = () => console.log('Hubo un error al rastrear la posición');

	const currentPos = ({ coords }) => {
		setCoordinates({
			lat: coords.latitude.toString() || '',
			lon: coords.longitude.toString() || '',
		});
	};

	const posOptions = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0,
	};

	useEffect(() => {
		try {
			const isIos = () => {
				const userAgent = window.navigator.userAgent.toLowerCase();
				// console.log(userAgent)
				return /iphone|ipad|ipod/.test(userAgent);
			};
			if (!isIos) {
				navigator.permissions
					.query({ name: 'geolocation' })
					.then(function(result) {
						if (result.state === 'granted') {
							navigator.geolocation.getCurrentPosition(currentPos, watchError, posOptions);
						} else if (result.state === 'prompt') {
							navigator.geolocation.getCurrentPosition(currentPos, watchError, posOptions);
						} else if (result.state === 'denied') {
						}
					})
					.catch((err) => {
						throw err;
					});
			} else {
				navigator.geolocation.getCurrentPosition(currentPos, watchError, posOptions);
			}
		} catch (err) {
			// console.log(err)
			setCoordinates({
				lat: '',
				lng: '',
			});
		}
	}, []);

	function getIcon(valueIcon) {
		if (valueIcon === 'NOMBRE') {
			return <i className='fas fa-user'></i>;
		} else if (valueIcon === 'DIRECCION') {
			return <i className='fas fa-map-marker-alt'></i>;
		} else if (valueIcon === 'SEXO') {
			return <i className='fas fa-venus-mars'></i>;
		} else if (valueIcon === 'FECHA DEL TURNO') {
			return <i className='far fa-calendar-alt'></i>;
		} else if (valueIcon === 'TELEFONO') {
			return <i className='fas fa-phone'></i>;
		} else if (valueIcon === 'ESPECIALIDAD') {
			return <i className='fas fa-notes-medical'></i>;
		} else if (valueIcon === 'HORARIO DEL TURNO') {
			return <i className='far fa-clock'></i>;
		} else {
			return <i className='fas fa-clock'></i>;
		}
	}

	function renderUserData(fieldTitle, fieldInfo) {
		return (
			<div className='confirmContent__container'>
				<div className='confirmContent__container--icon'>{getIcon(fieldTitle)}</div>
				<div className='confirmContent__container--text'>
					<p className='font-weight-bold mb-n1'>{`${fieldTitle.toUpperCase()}:`}</p>
					<p>{`${
						fieldInfo && !(fieldInfo instanceof Date)
							? fieldInfo.toUpperCase()
							: 'No hay datos disponibles '
					}`}</p>
				</div>
			</div>
		);
	}

	async function confirmAppointment() {
		const confirmAction = await swal({
			title: 'Confirmación',
			text: 'Está seguro que desea agendar este turno?',
			icon: 'warning',
			buttons: true,
		})
		if (confirmAction) {
			dispatch({ type: 'LOADING', payload: true });
			try {
				const upNumAff = upNumAff_store || localStorage.getItem('up_affNum');
				const userData = await getUser(dni);
				const sendData = {
					ws: userData.ws,
					dni: userData.dni,
					obra_social: userData.corporate_norm || '',
					n_afiliado: upNumAff,
					plan: '',
					services: '',
				};
				writeOSData(sendData);
				const appFullDt = `${appoint.date.replace('-', '').replace('-', '')}${appoint.time.replace(/:/g, '')}`;
				const id = `online_${doctor.matricula_especialidad}/${moment(appoint.date).format(
					'YYYYMM'
				)}/${appFullDt}_${doctor.cuit}`;
				let data = {
					age: userData.age || '',
					dni: userData.dni,
					dt: [
						'TurnoConsultorioOnline',
						`${doctor.fullname}`,
						`${doctor.matricula_especialidad}`,
						`${appoint.date}`,
						`${appoint.time}`,
						`${id}`,
					],
					lat: coordinates.lat || '-34.5633155',
					lon: coordinates.lon || '-58.4739184', // Coordenadas de Melian si no hay location
					motivo_de_consulta: selectedSymptomsString,
					msg: 'make_appointment',
					ruta: id,
					specialty: `${doctor.matricula_especialidad}`,
					sex: userData.sex || '',
					ws: userData.ws,
				};
				const res = await post(make_appointment, data, {
					headers: { 'Content-Type': 'application/json', 'Authorization': token },
				});
				dispatch({ type: 'LOADING', payload: false });
				if (res.data.fecha === '') {
					throw new Error('La cita que escogió ya está ocupada');
				} else {
					localStorage.setItem('currentMr', JSON.stringify(res.data.assignation_id));
					return history.replace(`/${userData.dni}/appointmentsonline/scheduled/history`);
				}
			} catch (error) {
				//console.log(error)
				dispatch({ type: 'LOADING', payload: false });
				await swal({
					title: 'Error',
					text: `Hubo un error al agendar su turno.`,
					icon: 'warning',
					dangerMode: true,
				});
				return history.replace('/');
			}
		}
	}

	useEffect(() => {
		try {
			dispatch({ type: 'LOADING', payload: true });
			getDoctor(appoint.cuil)
				.then((r) => {
					setDoctor(r);
					dispatch({ type: 'LOADING', payload: false });
				})
				.catch((e) => console.error(e));
		} catch (error) {
			//console.error(error)
		}
	}, []);

	return (
		<>
			{!!loading && <CustomUmaLoader centered={true} />}
			<div className='confirmContent'>
				<div className='confirmContent__container'>
					{doctor.path_profile_pic ? (
						<img
							src={doctor.path_profile_pic}
							alt={doctor.fullname}
							className='confirmContent__container--profilePic'
						/>
					) : (
						<div className='iconContainer'>
							<FontAwesomeIcon icon={faUserMd} />
						</div>
					)}
				</div>
				{renderUserData('NOMBRE', doctor.fullname || '')}
				{renderUserData('FECHA DEL TURNO', appoint.date || '')}
				{renderUserData('HORARIO DEL TURNO', appoint.time || '')}
				{renderUserData('ESPECIALIDAD', underscoreToSpaces(doctor.matricula_especialidad) || '')}
			</div>
			<div className='btn-confirm-container'>
				<AttachFile assign={appoint} specialty={specialty} />
				<button type='button' className='btn-container-confirmContent' onClick={confirmAppointment}>
					Confirmar
				</button>
			</div>
			<FooterBtn text='Volver' callback={unsetSelected} />
		</>
	);
};

export default withRouter(SidebarContent);
