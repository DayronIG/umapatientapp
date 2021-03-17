import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaptopMedical, faArrowLeft, faUserCircle, faCheck, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import logo from '../../assets/logo.png';
import umacare from '../../assets/umacare.png';
import '../../styles/global/Backbutton.scss';
import '../../styles/global/Header.scss';

export const OnlineDoctorHeader = () => {
	return (
		<>
			<div className='dinamic-logo-container'>
				<div className='dinamic-logo'>
					<FontAwesomeIcon icon={faLaptopMedical} />
				</div>
			</div>
			<div className='dinamic-title'>Médico Online</div>
		</>
	);
};

export const GenericHeader = (props) => {
	const history = useHistory()
	const { ws, profile_pic } = useSelector((state) => state.user);
	const {currentUser} = useSelector(state => state.userActive) 
	const [displayNews] = useState(false);

	return (
		<section className='header-container'>
			<div className='contentWrapper'>
				{props.logo === 'umacare' ? (
					<>
						<div className='logo-container'>
								<div className='logo' onClick={() => history.push('/')}>
									<img src={umacare} alt='UMA CARE' />
								</div>
						</div>
					</>
				) : (
					<>
						<div className='logo-container'>
								<div className='logo' onClick={() => history.push('/')}> 
									<img src={logo} alt='UMA HEALTH' />
								</div>
						</div>
					</>
				)}
				{props.back ? (
						<FontAwesomeIcon className='mt-2 pt-1' icon={faArrowLeft} onClick={() => history.push('/')} />
				) : (
					<p className='header-title'>{props.children}</p>
				)}
				{ws && !props.profileDisabled ? (
					<div className='hamburguer-menu' onClick={() => history.push(`/profile/${currentUser.uid}`)}>
							{profile_pic ? (
								<div className='profile_pic'>
									<img src={profile_pic} alt='Profile Pic' />
								</div>
							) : (
								<FontAwesomeIcon className='menu-profile' icon={faUserCircle} />
							)}
					</div>
				) : (
					<div style={{ width: '50px' }}></div>
				)}
			</div>
			{displayNews ? (
				<div className='displayNotifications'>
					<ul>
						<li>
							<div className='wrapperText'>La atención online fué realizada con éxito</div>
							<div className='wrapperIcon'>
								<FontAwesomeIcon className='menu-profile' icon={faCheck} />
							</div>
						</li>
						<li>
							<div className='wrapperText'>La atención online fué realizada con éxito</div>
							<div className='wrapperIcon'>
								<FontAwesomeIcon className='menu-profile' icon={faCheck} />
							</div>
						</li>
					</ul>
				</div>
			) : (
				''
			)}
		</section>
	);
};

export const HistoryHeader = (props) => {
	const history = useHistory()

	return(
		<section className={props.color === 'blue' ? 'header-container blue' : 'header-container history'}>	
				<div onClick={() => history.goBack()} className='back-btn'>
					<FontAwesomeIcon icon={faChevronLeft} /> 
				</div>
				<p className='header-title'>{props.children}</p>
		</section>
	)
}

export const BackButton = (props) => {
	const history = useHistory();
	
	return (
		<section 
			onClick={() => history.push(props.customTarget ? `${props.customTarget}` : '/')}
			className={props.inlineButton ? 'backButtonContainer inlineButton' : 'backButtonContainer'} >
				<IoIosArrowBack onClick={props.action? () => props.action(): () => console.log('')} icon={faArrowLeft} />
		</section>
	);
};
