import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaptopMedical, faArrowLeft, faUserCircle, faCheck } from '@fortawesome/free-solid-svg-icons';
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
	const { ws, profile_pic } = useSelector((state) => state.queries.patient);
	const [displayNews] = useState(false);
	return (
		<section className='header-container'>
			<div className='contentWrapper'>
				{props.logo === 'umacare' ? (
					<>
						<div className='logo-container'>
							<Link to='/'>
								<div className='logo'>
									<img src={umacare} alt='UMA CARE' />
								</div>
							</Link>
						</div>
					</>
				) : (
					<>
						<div className='logo-container'>
							<Link to='/'>
								<div className='logo'>
									<img src={logo} alt='UMA HEALTH' />
								</div>
							</Link>
						</div>
					</>
				)}
				{props.back ? (
					<Link to='/'>
						<FontAwesomeIcon className='mt-2 pt-1' icon={faArrowLeft} />
					</Link>
				) : (
					<p className='header-title'>{props.children}</p>
				)}
				{/* <div className={displayNews ? 'bell-menu active' : 'bell-menu'} onClick={() => setDisplayNews(!displayNews)}>
          <div className='notifications'>2</div>
          <FontAwesomeIcon className='menu-profile' icon={faBell} />
        </div> */}
				{ws && !props.profileDisabled ? (
					<div className='hamburguer-menu'>
						<Link to={`/${ws}/profile`}>
							{profile_pic ? (
								<div className='profile_pic'>
									<img src={profile_pic} alt='Profile Pic' />
								</div>
							) : (
								<FontAwesomeIcon className='menu-profile' icon={faUserCircle} />
							)}
						</Link>
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

export const BackButton = (props) => {
	return (
		<section className={props.inlineButton ? 'backButtonContainer inlineButton' : 'backButtonContainer'}>
			<Link to={props.customTarget ? `${props.customTarget}` : '/'}>
				<FontAwesomeIcon onClick={props.action? () => props.action(): () => console.log("")} className='mt-2' icon={faArrowLeft} />
			</Link>
		</section>
	);
};
