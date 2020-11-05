
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Axios from 'axios';
import MobileModal from '../GeneralComponents/Modal/MobileModal';
import FooterBtn from '../GeneralComponents/FooterBtn';
import { att_history } from '../../config/endpoints';
import Cab from '../../assets/icons/taxi.png';
import moment from 'moment-timezone';
import '../../styles/generalcomponents/TransportUserActive.scss';

const TransportUserActive = () => {
	const toogleModal = useSelector((state) => state.front.openDetails);
	const { patient } = useSelector(state => state.queries)
	const getCancelComment = useSelector((state) => state.userActive.cancelTripComments);
	const [displayLoading, setDisplayLoading] = useState(false);
	const [openTravel, setOpenTravel] = useState({});
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
			console.log(response)
		} catch (error) {
			console.log(error);
		} finally {
			dispatch({ type: 'LOADING', payload: false });
		}
	}

	function cancelTrip(e) {
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
		setSelectedService(item)
		dispatch({ type: 'TOGGLE_DETAIL' });
	}

	// 'autorizado': false,
	// 'request.time_reference': document['request']['time_reference'],

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
			{approvedServices.length > 0 || pendingServices.length > 0 ?
				<>
				{approvedServices.length > 0 && 
					<div>
						<h5>Viajes aprobados:</h5>
						<ul>
							{approvedServices
								.map((item, index) => (
										<li key={index}>
											<div className="titleContainer d-flex">
												<div className="transportTitle">
													<div>{item.fecha} - {item.hora} hs.</div>
													<div><span>Conductor:</span></div>
													<div>{item.provider_fullname ? item.provider_fullname : 'Sin conductor asignado.' }</div>
												</div>
												<div className="openContent">
													{openTravel.assignation_id === item.assignation_id ?
														<button onClick={() => setOpenTravel({})}> - </button> :
														<button onClick={() => setOpenTravel(item)}> + </button>
													}
												</div>
											</div>
											{openTravel.assignation_id === item.assignation_id &&
												<div className="contentContainer">
													<div className="origin"><span>Origen:</span> {item.geo_inicio_address}</div>
													<div className="destiny"><span>Destino:</span> {item.geo_fin_address}</div>
													<button className="checkStatus" onClick={() => history.push(`/${patient.dni}/transportDetails/${item.assignation_id}`)}>
														Estado del Viaje
													</button>
													<button className="cancelBtn" onClick={() => displayModal(item)}>
														Cancelar Viaje
													</button>
												</div> 
											}
										</li>
								))}
							</ul>
						</div>
					}
					{pendingServices.length > 0 &&
						<div>
							<h5>Pendientes de aprobación:</h5>
							<ul>
								{pendingServices 
									.map((item, index) => (
											<li key={index}>
												<div className="titleContainer d-flex">
													<div className="transportTitle">
														<div>{item.fecha} - {item.hora} hs.</div>
														<div><span>Conductor:</span></div>
														<div>{item.provider_fullname ? item.provider_fullname : 'Sin conductor asignado.' }</div>
													</div>
													<div className="openContent">
														{openTravel.assignation_id === item.assignation_id ?
															<button onClick={() => setOpenTravel({})}> - </button> :
															<button onClick={() => setOpenTravel(item)}> + </button>
														}
													</div>
												</div>
												{openTravel.assignation_id === item.assignation_id &&
													<div className="contentContainer">
														<div className="origin"><span>Origen:</span> {item.geo_inicio_address}</div>
														<div className="destiny"><span>Destino:</span> {item.geo_fin_address}</div>
														<button className="checkStatus" onClick={() => history.push(`/${patient.dni}/transportDetails/${item.assignation_id}`)}>
															Estado del Viaje
														</button>
														<button className="cancelBtn" onClick={() => displayModal(item)}>
															Cancelar Viaje
														</button>
													</div>
												}
											</li>
									))}
							</ul>
						</div>
					}
				</>
				:
				<div className="noTransfers">
					<div className="noTransfers__container">
						<img src={Cab} alt="cab" />
					</div>
					<div className="noTransfers__container">
						<h3 className="trasladoTitle">Traslados</h3>
						<h4 className="noTransfers__container--title">
							Actualmente no tiene ningún traslado solicitado.
						</h4>
					</div>
					<FooterBtn
						text='Volver'
						callback={() => history.push('/')}
					/>
				</div>
			}
		</div>
	)
}

export default TransportUserActive;
