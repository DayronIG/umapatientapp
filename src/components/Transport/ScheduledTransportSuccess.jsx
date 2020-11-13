import React from 'react'
import { useHistory, useParams } from 'react-router-dom';
import analysis from '../../assets/analysis.svg';
import { BackButton } from '../GeneralComponents/Headers';
import '../../styles/transport/scheduledSuccess.scss';

function ScheduledTransportSuccess() {
	const history = useHistory();
	const { ws } = useParams();

	return (
		<section className='scheduledSuccess'>
			<BackButton customTarget={`/${ws}/transportUserActive`} />
			<div className='scheduledSuccess__container'>
				<img 
					className='scheduledSuccess__container--img' 
					src={analysis} 
					alt='analysis image status'
				/>
			</div>
			<div className='scheduledSuccess__container'>
				<h5 className='scheduledSuccess__container--title'>
					Hemos recibido <br/> tu solicitud
				</h5>
			</div>
			<div className='scheduledSuccess__container'>
				<p className='scheduledSuccess__container--text'>
					Tu solicitud se encuentra <br/> pendiente de aprobación
				</p>
			</div>
			<div className='scheduledSuccess__container'>
				<button 
					className='scheduledSuccess__container--btn'
					onClick={() => history.push(`/${ws}/transportUserActive`)}
				>
					Ver mis traslados
				</button>
			</div>
		</section>
	);
}
export default ScheduledTransportSuccess;