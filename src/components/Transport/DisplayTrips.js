import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Axios from 'axios';
import MobileModal from '../GeneralComponents/Modal/MobileModal';
import { att_history, cancel_tramo, reclamo_tramo } from '../../config/endpoints';
import moment from 'moment-timezone';
import { FaChevronDown, FaChevronUp, FaCalendarAlt, FaClock, FaCar, FaRegTrashAlt, FaRegHandPaper } from 'react-icons/fa';
import Car from '../../assets/car.svg';
import { renderStatus, optionsReclamos } from '../Utils/transportUtils';
import { Loader } from '../GeneralComponents/Loading';
import swal from 'sweetalert';
import '../../styles/generalcomponents/TransportUserActive.scss';
const TransportUserActive = () => {
	const [reclamoModal, setReclamoModal] = useState(false)
	const [cancelModal, setCancelModal] = useState(false)
	const { patient } = useSelector(state => state.queries)
	const { date_filter } = useSelector(state => state.transport);
	const getCancelComment = useSelector((state) => state.userActive.cancelTripComments);
	const [displayLoading, setDisplayLoading] = useState(false);
	const [openTravel, setOpenTravel] = useState({});
	const [openApprovedServices, setOpenApprovedServices] = useState(false);
	const [openPendingServices, setOpenPendingServices] = useState(false);
	const [openAll, setOpenAll] = useState(true);
	const [pendingServices, setPendingServices] = useState([]);
	const [approvedServices, setApprovedServices] = useState([]);
	const [selectedService, setSelectedService] = useState({});
	const [noDriver, setNoDriver] = useState(false);
	const dispatch = useDispatch();
	const history = useHistory();

	useEffect(() => {
		window.gtag('event', 'select_content', { content_type: "DISPLAY_TRIPS", item: ['DISPLAY_TRIPS'] })
	}, [])

	useEffect(() => {
		getServices();
	}, [patient, date_filter]);

	async function getServices() {
		if (!patient?.dni) return null;
		dispatch({ type: 'LOADING', payload: true });
		try {
			const response = await Axios.post(
				att_history,
				{
					ws: patient.ws,
					dni: patient.dni,
					getUnauthorized: true
				},
				{
					headers: { 'Content-Type': 'application/json;charset=UTF-8'/* , 'Authorization': token */ }
				}
			);
			let appservicesTemp;
			let pendServicesTemp;

			if (date_filter) {
				let date = moment(date_filter).format('YYYY-MM-DD')
				appservicesTemp = response.data.filter(item => item.status_traslado === 'AUTHORIZED' && item.fecha === date);
				pendServicesTemp = response.data.filter(item => (item.status_traslado === 'FREE' || item.status_traslado === 'ASSIGN') && item.fecha === date);
			} else {
				appservicesTemp = response.data.filter(item => item.status_traslado === 'AUTHORIZED');
				pendServicesTemp = response.data.filter(item => item.status_traslado === 'FREE' || item.status_traslado === 'ASSIGN');
			}

			setApprovedServices(appservicesTemp);
			setPendingServices(pendServicesTemp);
		} catch (error) {
			console.log(error);
		} finally {
			dispatch({ type: 'LOADING', payload: false });
		}
	}

	async function cancelTrip(e) {
		e.preventDefault();
		if (getCancelComment === '') {
			return alert('Ingrese el motivo de cancelación');
		}
		console.log(selectedService);
		setDisplayLoading(true);
		try {
			await Axios.post(cancel_tramo, {
				dni: patient.dni,
				tramo_id: selectedService.assignation_id,
				date: selectedService.fecha,
				corporate: patient.corporate_norm.toUpperCase(),
				details: getCancelComment,
				traslado_id: selectedService.request_id
			}, {
				headers: {
					'Content-Type': 'application/json;charset=UTF-8'/* , 'Authorization': token */
				}
			});
			await swal('Éxito!', 'Viaje cancelado', 'success')
			setDisplayLoading(false)
			setCancelModal(false)
			getServices()
		} catch (error) {
			console.error(error);
		}
	}

	async function sendReclamo(e) {
		e.preventDefault();
		if (getCancelComment === '' || getCancelComment === '-') {
			return alert('Ingrese el motivo del reclamo');
		}
		setDisplayLoading(true);
		try {
			await Axios.post(reclamo_tramo, {
				dni: patient.dni,
				tramo_id: selectedService.assignation_id,
				date: selectedService.fecha,
				corporate: patient.corporate_norm.toUpperCase(),
				details: getCancelComment,
				traslado_id: selectedService.request_id
			}, {
				headers: {
					'Content-Type': 'application/json;charset=UTF-8'/* , 'Authorization': token */
				}
			});
			await swal('Éxito!', 'Reclamo registrado', 'success')
			setDisplayLoading(false)
			setReclamoModal(false)
			getServices()
		} catch (error) {
			console.error(error);
		}
	}

	function displayModal(item, type) {
		setSelectedService(item);
		if (type === 'cancel') {
			setCancelModal(true)
		} else if (type === 'reclamo') {
			setReclamoModal(true)
		}
	}



	return (
		<div className='transportList'>
			{cancelModal &&
				<MobileModal callback={() => setCancelModal(false)} title='Cancelar viaje'>
					<h6>Seleccione el motivo de la cancelación</h6>
					<select
						className='form-control'
						onChange={(e) => dispatch({ type: 'CANCEL_TRIP_COMMENTS', payload: e.target.value })}
					>
						{optionsReclamos.map((op) => <option value={op} >{op}</option>)}
					</select>
					{getCancelComment === 'Otro' && (
						<textarea
							className='form-control comments'
							onChange={(e) => dispatch({ type: 'CANCEL_TRIP_COMMENTS', payload: e.target.value })}
							placeholder='ingrese motivo de la cancelación'
						/>
					)}
					<div className='d-flex align-items-center buttonContainer'>
						<button
							className='cancelReason'
							onClick={cancelTrip}
						>
							Confirmar
						</button>
						{displayLoading && <Loader />}
					</div>
				</MobileModal>
			}
			{reclamoModal && (
				<MobileModal callback={() => setReclamoModal(false)} title='Reclamo'>
					<h6>Seleccione el motivo del reclamo</h6>
					<select
						className='form-control'
						onChange={(e) => dispatch({ type: 'CANCEL_TRIP_COMMENTS', payload: e.target.value })}
					>
						{optionsReclamos.map((op) => <option value={op} >{op}</option>)}
					</select>
					{getCancelComment === 'Otro' && (
						<textarea
							className='form-control'
							onChange={(e) => dispatch({ type: 'CANCEL_TRIP_COMMENTS', payload: e.target.value })}
							placeholder='ingrese motivo del reclamo'
						/>
					)}
					<div className='d-flex align-items-center buttonContainer'>
						<button
							className='cancelReason'
							onClick={sendReclamo}
						>
							Confirmar
						</button>
						{displayLoading && <Loader />}
					</div>
				</MobileModal>
			)}
			<div className='buttonDisplay'>
				<button className={openAll === true ? 'active' : ''}
					onClick={function () {
						setOpenAll(true)
						setOpenApprovedServices(false)
						setOpenPendingServices(false)
					}}>
					Todos
				</button>
				<button className={openApprovedServices === true ? 'active' : ''}
					onClick={function () {
						setOpenApprovedServices(true)
						setOpenPendingServices(false)
						setOpenAll(false)
					}}
				>
					Aprobados
				</button>
				<button
					className={openPendingServices === true ? 'active' : ''}
					onClick={function () {
						setOpenPendingServices(true)
						setOpenApprovedServices(false)
						setOpenAll(false)
					}}>
					Pendientes
				</button>
			</div>
			{/* SIN TRASLADOS */}
			{pendingServices.length == 0 && approvedServices.length == 0 &&
				<div className='noTranslates'>
					<img className='carImage' src={Car}></img>
					<h2>Aún no tienes ningún traslado</h2>
					<p>Programa un nuevo traslado tocando el boton '+'.</p>
				</div>
			}
			{/* TRASLADOS PENDIENTES */}
			{openPendingServices ?
				<div>
					<ul className="transportList">
						{pendingServices
							.map((item, index) => (
								<li key={index}>
									<div className="transportContainer d-flex  align-items-center">
										<div className="transportTime">
											<div><FaCalendarAlt /> {moment(item.fecha).format('DD-MMM')}</div>
											<div><FaClock /> {item.hora}hs.</div>
										</div>
										<div className='transportDriver'><div>Conductor: {item.provider_fullname ? item.provider_fullname : 'Sin asignar'}</div>
											<div>Estado: {renderStatus(item.status_traslado)}</div>
										</div>
									</div>
									{
										openTravel.assignation_id !== item.assignation_id &&
										<div className="openContent">
											<button onClick={() => setOpenTravel(item)}>Detalles <FaChevronDown /></button>
										</div>
									}
									{openTravel.assignation_id === item.assignation_id &&
										<>
											<div className="contentContainer">
												<div className="origin"><p className="originTitle">Origen:</p>
													<p className="originContent"> {item.geo_inicio_address}</p></div>
												<div className="destiny"><p className="destinyTitle">Destino:</p>
													<p className="destinyContent"> {item.geo_fin_address}</p></div>
												<button className="checkStatus" onClick={() => history.push(`/transportDetails/${item.fecha}/${item.assignation_id}`)}>
													<FaCar /> Seguir recorrido
												</button>
												<button className='checkStatus' onClick={() => displayModal(item, 'reclamo')} >
													<FaRegHandPaper /> Hacer un reclamo
												</button>
												<button className="cancelBtn" onClick={() => displayModal(item, 'cancel')}>
													<FaRegTrashAlt /> Cancelar Viaje
												</button>
											</div>
											{
												openTravel.assignation_id === item.assignation_id &&
												<div className="openContent">
													<button onClick={() => setOpenTravel({})}>Detalles <FaChevronUp /></button>
												</div>
											}
										</>
									}
								</li>
							))}
					</ul>
				</div>
				: null}
			{openApprovedServices ?
				<div>
					<ul className="transportList">
						{approvedServices
							.map((item, index) => (
								<li key={index}>
									<div className="transportContainer d-flex  align-items-center">
										<div className="transportTime">
											<div><FaCalendarAlt /> {moment(item.fecha).format('DD-MMM')}</div>
											<div><FaClock /> {item.hora}hs.</div>
										</div>
										<div className='transportDriver'><div>Conductor: {item.provider_fullname ? item.provider_fullname : 'Sin asignar'}</div>
											<div>Estado: {renderStatus(item.status_traslado)}</div>
										</div>
									</div>
									{openTravel.assignation_id !== item.assignation_id &&
										<div className="openContent">
											<button onClick={() => setOpenTravel(item)}>Detalles <FaChevronDown /></button>
										</div>
									}
									{openTravel.assignation_id === item.assignation_id &&
										<>
											<div className="contentContainer">
												<div className="origin"><p className="originTitle">Origen:</p>
													<p className="originContent"> {item.geo_inicio_address}</p></div>
												<div className="destiny"><p className="destinyTitle">Destino:</p>
													<p className="destinyContent"> {item.geo_fin_address}</p></div>
												<button className="checkStatus" onClick={() => history.push(`/transportDetails/${item.fecha}/${item.assignation_id}`)}>
													<FaCar /> Seguir recorrido
												</button>
												<button className='checkStatus' onClick={() => displayModal(item, 'reclamo')} >
													<FaRegHandPaper /> Hacer un reclamo
												</button>
												<button className="cancelBtn" onClick={() => displayModal(item, 'cancel')}>
													<FaRegTrashAlt /> Cancelar Viaje
												</button>
											</div>
											{
												openTravel.assignation_id === item.assignation_id &&
												<div className="openContent">
													<button onClick={() => setOpenTravel({})}>Detalles <FaChevronUp /></button>
												</div>
											}
										</>
									}
								</li>
							))}
					</ul>
				</div>
				: null}

			{openAll ?
				<>
					<div>
						<ul className="transportList">
							{approvedServices
								.map((item, index) => (
									<li key={index}>
										<div className="transportContainer d-flex  align-items-center">
											<div className="transportTime">
												<div><FaCalendarAlt /> {moment(item.fecha).format('DD-MMM')}</div>
												<div><FaClock /> {item.hora}hs.</div>
											</div>
											<div className='transportDriver'><div>Conductor: {item.provider_fullname ? item.provider_fullname : 'Sin asignar'}</div>
												<div>Estado: {renderStatus(item.status_traslado)}</div>
											</div>
										</div>
										{openTravel.assignation_id !== item.assignation_id &&
											<div className="openContent">
												<button onClick={() => setOpenTravel(item)}>Detalles <FaChevronDown /></button>
											</div>
										}
										{openTravel.assignation_id === item.assignation_id &&
											<>
												<div className="contentContainer">
													<div className="origin">
														<p className="originTitle">Origen:</p>
														<p className="originContent">{item.geo_inicio_address}</p>
													</div>
													<div className="destiny">
														<p className="destinyTitle">Destino:</p>
														<p className="destinyContent">{item.geo_fin_address}</p>
													</div>
													<button
														className="checkStatus"
														onClick={() => history.push(`/transportDetails/${item.fecha}/${item.assignation_id}`)}>
														<FaCar /> Seguir recorrido
													</button>
													<button className='checkStatus' onClick={() => displayModal(item, 'reclamo')} >
														<FaRegHandPaper /> Hacer un reclamo
													</button>
													<button className="cancelBtn" onClick={() => displayModal(item, 'cancel')}>
														<FaRegTrashAlt /> Cancelar Viaje
													</button>
												</div>
												{
													openTravel.assignation_id === item.assignation_id &&
													<div className="openContent">
														<button onClick={() => setOpenTravel({})}>Detalles <FaChevronUp /></button>
													</div>
												}
											</>
										}
									</li>
								))}
							{pendingServices
								.map((item, index) => (
									<li key={index}>
										<div className="transportContainer d-flex  align-items-center">
											<div className="transportTime">
												<div><FaCalendarAlt /> {moment(item.fecha).format('DD-MMM')}</div>
												<div><FaClock /> {item.hora}hs.</div>
											</div>
											<div className='transportDriver'><div>Conductor: {item.provider_fullname ? item.provider_fullname : 'Sin asignar'}</div>
												<div>Estado: {renderStatus(item.status_traslado)}</div>
											</div>
										</div>
										{
											openTravel.assignation_id !== item.assignation_id &&
											<div className="openContent">
												<button onClick={() => setOpenTravel(item)}>Detalles <FaChevronDown /></button>
											</div>
										}
										{openTravel.assignation_id === item.assignation_id &&
											<>
												<div className="contentContainer">
													<div className="origin">
														<p className="originTitle">Origen:</p>
														<p className="originContent">{item.geo_inicio_address}</p>
													</div>
													<div className="destiny">
														<p className="destinyTitle">Destino:</p>
														<p className="destinyContent">{item.geo_fin_address}</p>
													</div>
													<button className="checkStatus" onClick={() => {
														history.push(`/transportDetails/${item.fecha}/${item.assignation_id}`)
													}}>
														<FaCar /> Seguir recorrido
													</button>
													<button className='checkStatus' onClick={() => displayModal(item, 'reclamo')} >
														<FaRegHandPaper /> Hacer un reclamo
													</button>
													<button className="cancelBtn" onClick={() => displayModal(item, 'cancel')}>
														<FaRegTrashAlt /> Cancelar Viaje
													</button>
												</div>
												{
													openTravel.assignation_id === item.assignation_id &&
													<div className="openContent">
														<button onClick={() => setOpenTravel({})}>Detalles <FaChevronUp /></button>
													</div>
												}
											</>
										}
									</li>
								))}
						</ul>
					</div>
				</>
				: null
			}
		</div>
	)
}

export default TransportUserActive;
