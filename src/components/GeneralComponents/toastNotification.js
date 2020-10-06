import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import '../../styles/generalcomponents/ToastNotification.scss'

const ToastNotification = ({ title = '', description = '', button = '', action = '/', audio }) => {
	const [slide, setSlide] = useState(false);

	useEffect(() => {
		setSlide(true);
	}, [])

	return (
		<div className={`toastNotificationContainer ${slide && 'active'}`} >
			<div className="toastNotification">
				<audio src={audio} autoPlay />
				<div className='closeButtonContainer' onClick={() => setSlide(false)}>
					<FontAwesomeIcon icon={faTimesCircle} />
				</div>
				<div className='contentContainer'>
					<h2>{title}</h2>
					{description && <p>{description}</p>}
				</div>
				{action &&
					<div className="buttonsContainer">
						<Link to={action}>
							<button onClick={() => setSlide(false)}>
								{button}
							</button>
						</Link>
					</div>
				}
			</div>
		</div>
	)

}

export default ToastNotification