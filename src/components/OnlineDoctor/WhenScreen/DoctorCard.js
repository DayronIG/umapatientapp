import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter, useParams, useLocation } from 'react-router-dom';
import queryString from 'query-string'
import classnames from 'classnames';
import StarRatings from 'react-star-ratings';
import { getDoctor, getFeedback } from '../../../store/actions/firebaseQueries';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMd } from '@fortawesome/free-solid-svg-icons';
import '../../../styles/onlinedoctor/DoctorCard.scss';
import DB, {firebaseInitializeApp} from '../../../../src/config/DBConnection';

const DoctorCard = (props) => {
	const dispatch = useDispatch();
	const { activeUid } = useParams()
	const location = useLocation()
	const params = queryString.parse(location.search)

	function viewComments(doc) {
		dispatch({ type: 'TOGGLE_DETAIL' });
		dispatch({type: 'LOADING', payload: true})
		getFeedback(doc).then((res) => {
			dispatch({ type: 'SET_FEEDBACK', payload: res });
			dispatch({type: 'LOADING', payload: false})
		}).catch((err)=> {
			console.log(err)
			dispatch({type: 'LOADING', payload: false})
		})
	}

	function selectDoctor(selected) {
		dispatch({ type: 'SET_SELECTED_DOCTOR', payload: selected });
		localStorage.setItem('selectedAppointment', JSON.stringify(selected));
		props.history.replace(`/onlinedoctor/reason/${activeUid}?dependant=${params.dependant || false}`);
	}

	return (
		<>
			<div className='doctorCard-container disable-selection'>
				<div className='doctorCard-firstRow' onClick={() => selectDoctor(props)}>
					<div className='doctorCard-photoContainer'>
						<img src={props.doc.path_profile_pic} alt='Doctor' className='doctorImage' />
					</div>
					<div className='doctorCard-doctorInfo'>
						<div className='doctorName'>
							<b>{props.doc.fullname}</b>
						</div>
					</div>
					<div className='doctorCard-timeContainer'>
						<div className='timeRemainingBefore'>
							<span>{props.delay}</span>
						</div>
					</div>
				</div>
				<div className='doctorCard-secondRow'>
					<div className='doctorAtts'>
						<p>{props.doc.metrics ? props.doc.metrics.n_att : '0'}</p><span>Atenciones</span>
					</div>
					{props.doc.metrics && (
						<div className='doctorStars'>
							<StarRatings
								rating={(props.doc?.metrics?.stars &&
									parseFloat(props.doc.metrics.stars)) || 5}
								starRatedColor='#0A6DD7'
								numberOfStars={5}
								name='rating'
								starSpacing='1px'
								starDimension='15px'
							/>
							<span>Valoraciones</span>
						</div>
						)}
				</div>
				<div className='doctorCard-comments' onClick={() => viewComments(props.cuit)}>
					Ver comentarios
				</div>
			</div>
		</>
	);
};

export default withRouter(DoctorCard);

const GuardCardComp = (props) => {
	const dispatch = useDispatch();
	const { activeUid } = useParams()
	const location = useLocation()
	const params = queryString.parse(location.search)
	const { unique_doctors } = useSelector((state) => state.front);
	const { currentUser } = useSelector((state) => state.userActive);
	const user = useSelector(state => state.user);
	const db = DB.firestore(firebaseInitializeApp);
	const [copayPrice, setcopayPrice] = useState('')

	const selectGuard = () => {
		if(copayPrice === 'NO COPAY') {
			dispatch({ type: 'SET_SELECTED_DOCTOR', payload: '' }); 
			props.history.replace(`/onlinedoctor/reason/${activeUid}?dependant=${params.dependant || false}`);
		} else {
			payAppointment()
		}
	};

	const getCopay = async () => {
		const response = await db.collection('corporate').where("name", "==", user.corporate_norm).get()
		let copay = [];
		response.forEach(doc => {
			const data = doc.data();
			copay.push(data.copay.default.guardia_copay)
		})
		setcopayPrice(copay[0] || 'NO COPAY')
	}

	useEffect(() => {
		if(user.corporate_norm && user.corporate_norm !== "") {
			if(user.corporate_norm === 'SIN OBRA SOCIAL (UMA)') {
				setcopayPrice('NO COPAY')
			} else {
				getCopay()
			}
		}
	},[user])
	
	//Solo para DOSUBA
	// useEffect(() => { 
		// if(user.corporate_norm && user.corporate_norm !== "") {
			// if(user.corporate_norm === 'DOSUBA') {
				// getCopay()
			// } else {
				// setcopayPrice('NO COPAY')
			// }
		// }
	// },[user])

	const payAppointment = () => {
		dispatch({
			type: 'SET_PAYMENT',
			payload: {
			  product: 'guardia',
			  quantity: 1,
			  title: 'Consulta de guardia',
			  uid: currentUser.uid,
			  service: 'GUARDIA',
			  dependant: params.dependant,
			  price: copayPrice,
			  mercadoPago: true,
			}
		})
		localStorage.setItem('paymentData', JSON.stringify({
			product: 'guardia',
			quantity: 1,
			title: 'Consulta de guardia',
			uid: currentUser.uid,
			service: 'GUARDIA',
			dependant: params.dependant,
			price: copayPrice,
			mercadoPago: true
		}));
		props.history.push(`/payments/checkout/${currentUser.uid}`)
	}
	
	const getTime = () => {
		let time = Math.round((props.queue / unique_doctors) * 8.25)
		let timeMsg = ``
		if(time > 60) {
			timeMsg = `${Math.round(time/60)} horas`
		} else {
			timeMsg = `${time} minutos`
		}
		return timeMsg
	}

	return (
		<>
		{ copayPrice ? 
		<div className='doctorCard-container'>
			<div className='doctorCard-firstRow guardia' onClick={selectGuard}>
				<div className='doctorCard-photoContainer guardia'>
					<span className='guard-icon'>
						<FontAwesomeIcon icon={faUserMd} />
					</span>
				</div>
				<div className='doctorCard-doctorInfo'>
					<div className='doctorName guardia'>
					{ copayPrice === 'NO COPAY' && 
						(
							<>
								<p>Clic aquí para atenderte con el próximo {props.pediatric ? 'pediatra' : 'médico'} disponible</p>
								{!isNaN((props.queue / unique_doctors) * 8.25) && <small> La consulta será en aproximadamente {getTime()}.</small>}
								<br></br>
								{props.queue > 1 && <small>Hay {props.queue} pacientes en espera.</small>} {unique_doctors > 1 && <small> y 	{unique_doctors} médicos atendiendo</small>}
							</>
						)
					}
					{!['', 'NO COPAY'].includes(copayPrice) &&
						(
							<>
								<p>Consulta con copago</p>
								<small>Deberas pagar un copago de <strong>{`$${copayPrice}`}</strong> y tendras una atencion mas rapida.</small>
							</>
						)
					}
					</div>
				</div>
			</div>
		</div>
		:
		null
		}
		</>
	);
};

export const GuardCard = withRouter(GuardCardComp);

const DoctorCardOfficeComp = ({ doctor, history, dni }) => {
	const dispatch = useDispatch();
	const { activeUid } = useParams()
	const location = useLocation()
	const params = queryString.parse(location.search)
	
	// const [comments, setComments] = useState([])
	var timeDelay = classnames('timeDelay', {
		verygood: doctor && doctor.metrics && doctor.metrics.punctuality <= 0.5,
		good: doctor && doctor.metrics && doctor.metrics.punctuality > 0.5 && doctor.metrics.punctuality < 1.5,
		regular: doctor && doctor.metrics && doctor.metrics.punctuality >= 1.5,
	});

	function selectDoctor(selected) {
		dispatch({ type: 'SET_SELECTED_DOCTOR', payload: selected });
		history.replace(`/onlinedoctor/reason/${activeUid}?dependant=${params.dependant || false}`);
	}

	return (
		<>
			{!!doctor && (
				<div className='doctorCard-container disable-selection'>
					<div className='doctorCard-firstRow' onClick={() => selectDoctor(doctor)}>
						<div className='doctorCard-photoContainer'>
							<img src={doctor.path_profile_pic} alt='Doctor' className='doctorImage' />
						</div>
						<div className='doctorCard-doctorInfo'>
							<div className='doctorName'>
								<b>{doctor.fullname}</b>
							</div>
							{doctor.metrics && (
								<>
									<div className='doctorStars'>
										<StarRatings
											rating={
												doctor.metrics &&
												doctor.metrics.stars &&
												parseFloat(doctor.metrics.stars)
											}
											starRatedColor='#F8BD1D'
											numberOfStars={5}
											name='rating'
											starSpacing='1px'
											starDimension='15px'
										/>
									</div>
									<div className='doctorAtts'>
										({doctor.metrics ? doctor.metrics.n_att : '0'} atenciones)
									</div>
								</>
							)}
						</div>
					</div>
					<div className='doctorCard-secondRow'>
						{doctor.metrics && (
							<div className={timeDelay}>
								Puntualidad: &nbsp;
								{doctor.metrics && doctor.metrics.punctuality <= 0.5 && 'Muy buena'}
								{doctor.metrics &&
									doctor.metrics.punctuality > 0.5 &&
									doctor.metrics.punctuality < 1.5 &&
									'Buena'}
								{doctor.metrics && doctor.metrics.punctuality >= 1.5 && 'Regular'}
							</div>
						)}
						{/* <div className="doctorCard-comments" onClick={() => viewComments(doctor.cuil)}>
                            Ver comentarios
                            </div> */}
					</div>
				</div>
			)}
		</>
	);
};

export const DoctorCardOffice = withRouter(DoctorCardOfficeComp);

export function DoctorCardDisabled({ doctor }) {
	const dispatch = useDispatch();
	const [firstOption, setFirstOption] = useState();

	useEffect(() => {
		getDoctor(doctor.cuit).then((res) => {
			setFirstOption(res);
		});
	}, [doctor]);

	function viewComments(cuit) {
		getFeedback(cuit).then((res) => {
			dispatch({ type: 'SET_FEEDBACK', payload: res });
			dispatch({ type: 'TOGGLE_DETAIL' });
		});
	}

	return (
		<>
			{!!firstOption && (
				<div className='doctorCard-container disable-selection'>
					<div className='doctorCard-firstRow disabled'>
						<div className='doctorCard-photoContainer'>
							<img src={firstOption.path_profile_pic} alt='Doctor' className='doctorImage' />
						</div>
						<div className='doctorCard-doctorInfo'>
							<div className='doctorName'>
								<b>{firstOption.fullname}</b>
							</div>
							{firstOption.metrics && (
								<>
									<div className='doctorStars'>
										<StarRatings
											rating={
												firstOption.metrics &&
												firstOption.metrics.stars &&
												parseFloat(firstOption.metrics.stars)
											}
											starRatedColor='#F8BD1D'
											numberOfStars={5}
											name='rating'
											starSpacing='1px'
											starDimension='15px'
										/>
									</div>
									<div className='doctorAtts'>
										({firstOption.metrics ? firstOption.metrics.n_att : '0'} atenciones)
									</div>
								</>
							)}
						</div>
						<div className='doctorCard-timeContainer'>
							<div className='timeRemainingBefore'>Sin turnos disponibles.</div>
						</div>
					</div>
					<div className='doctorCard-secondRow'>
						<div className='doctorCard-comments' onClick={() => viewComments(doctor.cuit)}>
							Ver comentarios
						</div>
					</div>
				</div>
			)}
		</>
	);
}
