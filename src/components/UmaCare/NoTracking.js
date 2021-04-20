import React from 'react';
import { withRouter } from 'react-router-dom';
import FooterBtn from '../GeneralComponents/FooterBtn';
import { AiFillReconciliation } from 'react-icons/ai';
import {  useSelector } from 'react-redux';
import { activateUmacareTraking } from '../../store/actions/umaCareActions';
import ContinueButton from '../GeneralComponents/ContinueButton';
import '../../styles/generalcomponents/AccessDenied.scss';

const NoTracking = (props) => {
	const user = useSelector(state => state.user)

	const activeHandler = async () => {
		await activateUmacareTraking(user.id)
	}

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
				<div className="buttonActionContainer">
					<button type="button" onClick={activeHandler}>
						Activar seguimiento
					</button>
				</div>
			</div>
			<FooterBtn mode='single' text='Volver' callback={() => props.history.push('/home')} />
		</>
	)
}

export default withRouter(NoTracking);
