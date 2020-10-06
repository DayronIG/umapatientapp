import React from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserNurse, faSmile } from '@fortawesome/free-solid-svg-icons';
import PolLogo from '../../assets/pol/polinwhite.png';
import ValidateAction from '../ValidateAction/';
import '../../styles/generalcomponents/LifeJoy.scss';

const LifeJoy = (props) => {
	const { patient } = useSelector((state) => state.queries);

	function renderBtn(link, field, icon, text, isImg, btnColor) {
		return (
			<ValidateAction action='redirect' field={field}>
				<div className='btn-home-container' onClick={() => props.history.push(link)}>
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
			{/* route, fieldToValidate, definition, icon, text, isImg, btnColorClass*/}
			{renderBtn(`/${patient.ws}/wellness`, 'wellness', faSmile, 'Bienestar', false, 'btn-green')}
			{renderBtn(`/${patient.ws}/pol`, 'pol', PolLogo, 'Pol', true, 'btn-yellow')}
			{renderBtn(`/${patient.ws}/umacare`, 'umacare', faUserNurse, 'UMA Care', false, 'btn-green')}
		</section>
	);
};

export default withRouter(LifeJoy);
