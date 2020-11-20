import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';
import StarRatings from 'react-star-ratings';
import { getDoctor, getFeedback } from '../../../store/actions/firebaseQueries';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMd } from '@fortawesome/free-solid-svg-icons';
import '../../../styles/onlinedoctor/DoctorCard.scss';

const DoctorCard = (props) => {
	const dispatch = useDispatch();
	const [firstOption, setFirstOption] = useState();
	var timeDelay = classnames('timeDelay', {
		verygood: firstOption && firstOption.metrics && firstOption.metrics.punctuality <= 0.5,
		good:
			firstOption &&
			firstOption.metrics &&
			firstOption.metrics.punctuality > 0.5 &&
			firstOption.metrics.punctuality < 1.5,
		regular: firstOption && firstOption.metrics && firstOption.metrics.punctuality >= 1.5,
	});

	useEffect(() => {
		getDoctor(props.doctor.cuil).then(setFirstOption);
	}, [props.doctor]);

	function viewComments(doc) {
		getFeedback(doc).then((res) => {
			dispatch({ type: 'SET_FEEDBACK', payload: res });
			dispatch({ type: 'TOGGLE_DETAIL' });
		});
	}

	function selectDoctor(selected) {
		dispatch({ type: 'SET_SELECTED_DOCTOR', payload: selected });
		localStorage.setItem('selectedAppointment', JSON.stringify(selected));
		props.history.replace(`/${props.dni}/onlinedoctor/reason`);
	}

	return (
		<>
			{!!firstOption && (
				<div className='doctorCard-container disable-selection'>
					<div className='doctorCard-firstRow' onClick={() => selectDoctor(props.doctor)}>
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
							<div className='timeRemainingBefore'>
								Disponible en
								<br />
								<span className='ml-1'>{props.remaining}</span>
							</div>
						</div>
					</div>
					<div className='doctorCard-secondRow'>
						{firstOption.metrics && (
							<div className={timeDelay}>
								Puntualidad: &nbsp;
								{firstOption.metrics && firstOption.metrics.punctuality <= 0.5 && 'Muy buena'}
								{firstOption.metrics &&
									firstOption.metrics.punctuality > 0.5 &&
									firstOption.metrics.punctuality < 1.5 &&
									'Buena'}
								{firstOption.metrics && firstOption.metrics.punctuality >= 1.5 && 'Regular'}
							</div>
						)}
						<div className='doctorCard-comments' onClick={() => viewComments(props.doctor.cuil)}>
							Ver comentarios
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default withRouter(DoctorCard);

const GuardCardComp = (props) => {
	const dispatch = useDispatch();

	const selectGuard = () => {
		dispatch({ type: 'SET_SELECTED_DOCTOR', payload: '' });
		props.history.replace(`/${props.dni}/onlinedoctor/reason`);
	};

	return (
		<div className='doctorCard-container'>
			<div className='doctorCard-firstRow guardDoctor' onClick={selectGuard}>
				<div className='doctorCard-photoContainer guardDoctor'>
					<span className='guard-icon'>
						<FontAwesomeIcon icon={faUserMd} />
					</span>
				</div>
				<div className='doctorCard-doctorInfo'>
					<div className='doctorName guardDoctor'>
						<b>PEDIR MÉDICO DE GUARDIA {props.pediatric ? 'PEDIÁTRICA' : 'ADULTOS'}</b>
					</div>
				</div>
			</div>
		</div>
	);
};

export const GuardCard = withRouter(GuardCardComp);

const DoctorCardOfficeComp = ({ doctor, history, dni }) => {
	const dispatch = useDispatch();
	// const [comments, setComments] = useState([])
	var timeDelay = classnames('timeDelay', {
		verygood: doctor && doctor.metrics && doctor.metrics.punctuality <= 0.5,
		good: doctor && doctor.metrics && doctor.metrics.punctuality > 0.5 && doctor.metrics.punctuality < 1.5,
		regular: doctor && doctor.metrics && doctor.metrics.punctuality >= 1.5,
	});

	function selectDoctor(selected) {
		dispatch({ type: 'SET_SELECTED_DOCTOR', payload: selected });
		history.replace(`/${dni}/onlinedoctor/reason`);
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
