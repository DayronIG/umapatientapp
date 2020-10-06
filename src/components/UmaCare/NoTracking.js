import React from 'react';
import { withRouter } from 'react-router-dom';
import FooterBtn from '../GeneralComponents/FooterBtn';
import { AiFillReconciliation } from 'react-icons/ai';
import '../../styles/generalcomponents/AccessDenied.scss';

const NoTracking = (props) => {
	return (
		<>
			<div className='accessDenied'>
				<div className='accessDenied__container'>
					<span className='accessDenied__container--icon'>
            <AiFillReconciliation />
					</span>
				</div>
				<div className='accessDenied__container'>
					<h4 className='accessDenied__container--title'>Sin Seguimientos</h4>
				</div>
				<div className='accessDenied__container'>
					<p className='accessDenied__container--text'>
						Actualmente no tienes ningún seguimiento activo
					</p>
				</div>
			</div>
			<FooterBtn mode='single' text='Volver' callback={() => props.history.push('/')} />
		</>
	)
}

export default withRouter(NoTracking);
