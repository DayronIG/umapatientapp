import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Axios from 'axios';
import MobileModal from '../GeneralComponents/Modal/MobileModal';
import { att_history, change_status_traslado } from '../../config/endpoints';
import moment from 'moment-timezone';
import { FaChevronDown, FaChevronUp, FaCalendarAlt, FaClock, FaCar, FaRegTrashAlt } from 'react-icons/fa';
import Car from '../../assets/car.svg';
import { renderStatus } from '../Utils/transportUtils';
import { Loader } from '../GeneralComponents/Loading';
import '../../styles/generalcomponents/TransportUserActive.scss';


const TransportUserActive = () => {
	const toogleModal = useSelector((state) => state.front.openDetails);
	const { patient } = useSelector(state => state.queries);
	const getCancelComment = useSelector((state) => state.userActive.cancelTripComments);
	const [displayLoading, setDisplayLoading] = useState(false);
	const [openTravel, setOpenTravel] = useState({});
	const [openApprovedServices, setOpenApprovedServices] = useState(false);
	const [openPendingServices, setOpenPendingServices] = useState(false);
	const [openAll, setOpenAll] = useState(true);
	const [pendingServices, setPendingServices] = useState([]);
	const [approvedServices, setApprovedServices] = useState([]);
	const [selectedService, setSelectedService] = useState({});
	const dispatch = useDispatch();
	const history = useHistory();

	useEffect(() => {
		getServices();
	}, [patient]);

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
			const appservicesTemp = response.data.filter(item => item.status_traslado === 'AUTHORIZED');
			const pendServicesTemp = response.data.filter(item => item.status_traslado === 'FREE' || item.status_traslado === 'ASSIGN');
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
		if (getCancelComment === "") {
			return alert('Ingrese el motivo de cancelación');
		}
		setDisplayLoading(true);
		try {
			await Axios.post(change_status_traslado, {
					dni: patient.dni,
					tramo_id: selectedService.assignation_id,
					notificationType: 'CANCEL',
					date: selectedService.fecha,
					corporate: patient.corporate_norm.toUpperCase()
				}, {				
					headers: { 'Content-Type': 'application/json;charset=UTF-8'/* , 'Authorization': token */ 
				}
			});
		} catch (error) {
			console.error(error);
		}
	}

	function displayModal(item) {
		setSelectedService(item);
		dispatch({ type: 'TOGGLE_DETAIL' });
	}
	return (
		<div className="transportList">
			{toogleModal &&
				<MobileModal title="Cancelar viaje">
					<textarea
						className="form-control comments"
						placeholder="Ingrese el motivo de cancelación"
						onChange={(e) => dispatch({ type: 'CANCEL_TRIP_COMMENTS', payload: e.target.value })}
					/>
					<div className="d-flex align-items-center buttonContainer">
						<button
							className="cancelReason"
							onClick={cancelTrip}
						>
							Cancelar viaje
						</button>
						{displayLoading && <Loader />}
					</div>
				</MobileModal>
			}
			<div className="buttonDisplay">
				<button className={openAll === true ? "active" : ""} 
						onClick={function() {
						setOpenAll(true)
						setOpenApprovedServices(false)
						setOpenPendingServices(false)
				}}>
					Todos
				</button>
					<button className={openApprovedServices === true ? "active" : ""} 
						onClick={function() {
							setOpenApprovedServices(true)
							setOpenPendingServices(false)
							setOpenAll(false)
						}}
					>
					Aprobados
				</button>
				<button 
					className={openPendingServices === true ? "active" : ""}  
					onClick={function() {
						setOpenPendingServices(true)
						setOpenApprovedServices(false)
						setOpenAll(false)
				}}>
					Pendientes
				</button>
			</div>
			
			{/* SIN TRASLADOS */}
			{pendingServices.length == 0 && approvedServices.length == 0 && 
			<div className="noTranslates">
			<img className="carImage" src={Car}></img>
			<h2>Aún no tienes ningún traslado</h2>
			<p>Programa un nuevo traslado tocando el boton "+".</p>
			</div>
			}
			{/* TRASLADOS PENDIENTES */}
			{openPendingServices ?
				<div>
					<ul>
					{pendingServices 
						.map((item, index) => (
								<li key={index}>
									<div className="titleContainer d-flex  align-items-center">
										<div className="transportTitle">
											<div><FaCalendarAlt /> {moment(item.fecha).format('ll')}</div>
											<div><FaClock /> {item.hora} hs.</div>
										</div>
										<div className="transportDriver"><div>Conductor: {item.provider_fullname ? item.provider_fullname : 'Sin asignar' }</div>
											<div>Estado: {renderStatus(item.status_traslado)}</div>
										</div>
									</div>
									<div className="openContent">
										{openTravel.assignation_id === item.assignation_id ?
											<button onClick={() => setOpenTravel({})}><FaChevronUp /></button> :
											<button onClick={() => setOpenTravel(item)}> Detalles <FaChevronDown /> </button>
										}
									</div>
									{openTravel.assignation_id === item.assignation_id &&
										<div className="contentContainer">
											<div className="origin"><p className="originTitle">Origen:</p>
											<p className="originContent"> {item.geo_inicio_address}</p></div>
											<div className="destiny"><p className="destinyTitle">Origen:</p>
											<p className="destinyContent"> {item.geo_fin_address}</p></div>
											<button className="checkStatus" onClick={() => history.push(`/transportDetails/${item.fecha}/${item.assignation_id}`)}>
												<FaCar /> Seguir recorrido
											</button>
											<button className="cancelBtn" onClick={() => displayModal(item)}>
												<FaRegTrashAlt /> Cancelar Viaje
											</button>
										</div>
									}
								</li>
						))}
					</ul>
			</div>
		: null }
{openApprovedServices ?
	<div>
		<ul>
			{approvedServices
					.map((item, index) => (
							<li key={index}>
								<div className="titleContainer d-flex  align-items-center">
									<div className="transportTitle">
										<div><FaCalendarAlt /> {moment(item.fecha).format('ll')}</div>
										<div><FaClock /> {item.hora} hs.</div>
									</div>
									<div className="transportDriver"><div>Conductor: {item.provider_fullname ? item.provider_fullname : 'Sin asignar' }</div>
									<div>Estado: {renderStatus(item.status_traslado)}</div>
									</div>
								</div>
								<div className="openContent">
										{openTravel.assignation_id === item.assignation_id ?
											<button onClick={() => setOpenTravel({})}><FaChevronUp /></button> :
											<button onClick={() => setOpenTravel(item)}> Detalles <FaChevronDown /> </button>
										}
									</div>
								{openTravel.assignation_id === item.assignation_id &&
									<div className="contentContainer">
										<div className="origin"><p className="originTitle">Origen:</p>
										<p className="originContent"> {item.geo_inicio_address}</p></div>
										<div className="destiny"><p className="destinyTitle">Destino:</p>
										<p className="destinyContent"> {item.geo_fin_address}</p></div>
										<button className="checkStatus" onClick={() => history.push(`/transportDetails/${item.fecha}/${item.assignation_id}`)}>
											<FaCar /> Seguir recorrido
										</button>
										<button className="cancelBtn" onClick={() => displayModal(item)}>
											<FaRegTrashAlt /> Cancelar Viaje
										</button>
									</div>
								}
							</li>
					))}
			</ul>
		</div>
		: null }

{openAll ?
	<>
	<div>
		{approvedServices.length > 0 ? <h5 className="pendingTitle">Aprobados:</h5> : null}
		<ul>
			{approvedServices
					.map((item, index) => (
							<li key={index}>
								<div className="titleContainer d-flex  align-items-center">
									<div className="transportTitle">
										<div><FaCalendarAlt /> {moment(item.fecha).format('ll')}</div>
										<div><FaClock /> {item.hora} hs.</div>
									</div>
									<div className="transportDriver"><div>Conductor: {item.provider_fullname ? item.provider_fullname : 'Sin asignar' }</div>
									<div>Estado: {renderStatus(item.status_traslado)}</div>
									</div>
								</div>
								<div className="openContent">
										{openTravel.assignation_id === item.assignation_id ?
											<button onClick={() => setOpenTravel({})}><FaChevronUp /></button> :
											<button onClick={() => setOpenTravel(item)}> Detalles <FaChevronDown /> </button>
										}
									</div>
								{openTravel.assignation_id === item.assignation_id &&
									<div className="contentContainer">
										<div className="origin"><p className="originTitle">Origen:</p>
										<p className="originContent"> {item.geo_inicio_address}</p></div>
										<div className="destiny"><p className="destinyTitle">Destino:</p>
										<p className="destinyContent"> {item.geo_fin_address}</p></div>
										<button className="checkStatus" onClick={() => {
											if(item.provider_fullname) {
												history.push(`/transportDetails/${item.fecha}/${item.assignation_id}`);
											} else {
												history.push('/transportNoDriver');									
											}
										}}>
											<FaCar /> Seguir recorrido
										</button>
										<button className="cancelBtn" onClick={() => displayModal(item)}>
											<FaRegTrashAlt /> Cancelar Viaje
										</button>
									</div>
								}
							</li>
					))}
			</ul>
		</div>
		<div>
		{pendingServices.length > 0 ? <h5 className="pendingTitle">Pendientes:</h5> : null}
				<ul>
			{pendingServices 
				.map((item, index) => (
						<li key={index}>
							<div className="titleContainer d-flex  align-items-center">
								<div className="transportTitle">
									<div><FaCalendarAlt /> {moment(item.fecha).format('ll')}</div>
									<div><FaClock /> {item.hora} hs.</div>
								</div>
								<div className="transportDriver"><div>Conductor: {item.provider_fullname ? item.provider_fullname : 'Sin asignar' }</div>
								<div>Estado: {renderStatus(item.status_traslado)}</div>
								</div>
							</div>
							<div className="openContent">
									{openTravel.assignation_id === item.assignation_id ?
										<button onClick={() => setOpenTravel({})}><FaChevronUp /></button> :
										<button onClick={() => setOpenTravel(item)}> Detalles <FaChevronDown /> </button>
									}
							</div>
							{openTravel.assignation_id === item.assignation_id &&
							<>
								<div className="contentContainer">
									<div className="origin"><p className="originTitle">Origen:</p>
									<p className="originContent"> {item.geo_inicio_address}</p></div>
									<div className="destiny"><p className="destinyTitle">Destino:</p>
									<p className="destinyContent"> {item.geo_fin_address}</p></div>
									<button className="checkStatus" onClick={() => {
											if(item.provider_fullname) {
												history.push(`/transportDetails/${item.fecha}/${item.assignation_id}`)
											} else {
												history.push('/transportNoDriver');	
											}
									}}>
										<FaCar /> Seguir recorrido
									</button>
									<button className="cancelBtn" onClick={() => displayModal(item)}>
										<FaRegTrashAlt /> Cancelar Viaje
									</button>
								</div>
									<div className="openContent">
											{openTravel.assignation_id === item.assignation_id ?
												<button onClick={() => setOpenTravel({})}><FaChevronUp /></button> :
												<button onClick={() => setOpenTravel(item)}> Detalles <FaChevronDown /> </button>
											}
									</div>
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
