import React from 'react';
import { withRouter } from 'react-router-dom';
import FooterBtn from '../GeneralComponents/FooterBtn';
import { AiFillReconciliation } from 'react-icons/ai';
import '../../styles/generalcomponents/AccessDenied.scss';
import { useDispatch } from 'react-redux';
import { activateUmacareTraking } from '../../store/actions/umaCareActions';
import ContinueButton from '../GeneralComponents/ContinueButton';

const NoTracking = (props) => {
	const dispatch = useDispatch()
	const activeHandler = () => {
		dispatch(activateUmacareTraking('xoxNie7wG7USMiMHPXc19OC0FLe2', "2020-11-14", "2020-11-18"))
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
					<ContinueButton callback={activeHandler}>
						Activar seguimiento
					</ContinueButton>
				</div>
			</div>
			<FooterBtn mode='single' text='Volver' callback={() => props.history.push('/home')} />
		</>
	)
}

export default withRouter(NoTracking);
