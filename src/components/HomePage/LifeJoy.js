import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserNurse, faSmile } from '@fortawesome/free-solid-svg-icons';
import ValidateAction from '../ValidateAction/';
import '../../styles/generalcomponents/LifeJoy.scss';

const LifeJoy = () => {
	const history = useHistory()
	const user = useSelector((state) => state.user);

	function renderBtn(link, field, icon, text, isImg, btnColor) {
		return (
			<ValidateAction action='redirect' field={field}>
				<div className='btn-home-container' onClick={() => history.push(link)}>
					<div className={`circular-button ${btnColor}`}>
						{isImg ? (
							<img src={icon} alt={`LOGO FOR ${text}`} className='polLogo' />
						) : (
							<FontAwesomeIcon icon={icon} />
						)}
					</div>
					<span>{text}</span>
				</div>
			</ValidateAction>
		);
	}

	return (
		<section className='lifejoy-container'>
			{renderBtn(`/${user.ws}/wellness`, 'wellness', faSmile, 'Bienestar', false, 'btn-green')}
			{renderBtn(`/${user.ws}/umacare`, 'umacare', faUserNurse, 'UMA Care', false, 'btn-green')}
		</section>
	);
};

export default LifeJoy;
