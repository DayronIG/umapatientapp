
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Axios from 'axios';
import MobileModal from '../GeneralComponents/Modal/MobileModal';
import { att_history } from '../../config/endpoints';
import moment from 'moment-timezone';
import { FaChevronDown, FaChevronUp, FaCalendarAlt, FaClock, FaCar, FaRegTrashAlt, FaSlideshare } from 'react-icons/fa'
import '../../styles/generalcomponents/TransportUserActive.scss';

const TransportUserActive = () => {
	const toogleModal = useSelector((state) => state.front.openDetails);
	const { patient } = useSelector(state => state.queries)
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
		if(!patient?.dni) return null;
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
			)
			setApprovedServices(response.data.filter(item => item.autorizado));
			setPendingServices(response.data.filter(item => !item.autorizado));
			console.log(response.data)
		} catch (error) {
			console.log(error);
		} finally {
			dispatch({ type: 'LOADING', payload: false });
		}
	}

	function cancelTrip(e) {
		if (getCancelComment === ""){
			return alert('Ingrese el motivo de cancelación');
		}
		e.preventDefault();
		setDisplayLoading(true);
		Axios.post('https://uma-v2.appspot.com/cancel_tramo', {
			dni: patient.dni,
			fecha_viaje: moment(selectedService.fecha).format('YYYY-MM-DD'),
			dt: moment(selectedService.fecha).format('YYYY-MM-DD HH:mm:ss'),
			assignation_id: selectedService.assignation_id,
			motivo: getCancelComment || '-',
			corporate: patient.corporate_norm
		}).then(function (response) {
			getServices();
			dispatch({ type: 'TOGGLE_DETAIL' });
		}).catch(function (error) {
			console.log(error);
		}).finally(function()  {
			setDisplayLoading(false);
			setSelectedService({});
		});
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
					<div className="buttonContainer">
						<button
							className="cancelReason"
							onClick={cancelTrip}>
							{displayLoading &&
								<div className="loading spinner-border text-info" role="initial">
									<span className="sr-only">Loading...</span>
								</div>
							}
							Cancelar viaje
						</button>
					</div>
				</MobileModal>
			}
			<div className="buttonDisplay">
				<button className={openAll === true ? "active" : ""} 
								onClick={function() {setOpenAll(true)
						setOpenApprovedServices(false)
							setOpenPendingServices(false)
				}}>
					Todos
				</button>
				<button className={openApprovedServices === true ? "active" : ""} 
								onClick={function() {setOpenApprovedServices(true)
							setOpenPendingServices(false)
							setOpenAll(false)
						}}>
					Aprobados
				</button>
				<button className={openPendingServices === true ? "active" : ""}  onClick={function()  {setOpenPendingServices(true)
							 setOpenApprovedServices(false)
							 setOpenAll(false)
				}}>
					Pendientes
				</button>
			</div>
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
											<div>Estado: {item.status_tramo}</div>
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
{setOpenApprovedServices ?
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
									<div>Estado: {item.status_tramo}</div>
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
								<h4>Aprobados</h4>
								<div className="titleContainer d-flex  align-items-center">
									<div className="transportTitle">
										<div><FaCalendarAlt /> {moment(item.fecha).format('ll')}</div>
										<div><FaClock /> {item.hora} hs.</div>
									</div>
									<div className="transportDriver"><div>Conductor: {item.provider_fullname ? item.provider_fullname : 'Sin asignar' }</div>
									<div>Estado: {item.status_tramo}</div>
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
								<div>Estado: {item.status_tramo}</div>
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
	</>
		: null }
		</div>
	)
}

export default TransportUserActive;
