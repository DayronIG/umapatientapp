import React from 'react';
import RegisterIcon from '../../assets/icons/Analysis-Illustration.png'
import Backbutton from '../GeneralComponents/Backbutton';
import { ContinueButton } from './RegisterFormComponents'
import '../../styles/TrasladosWelcome.scss';

const TrasladosWelcome = (props) => (
	<div className='traslados-welcome-container'>
		<Backbutton />
		<div className='transport-img'>
			<img src={RegisterIcon} alt="Traslados sanitarios" />
		</div>
		<h1 className='h12'>Vamos a darte de alta</h1>
		<h4 className='h32'>Necesitamos algunos datos para darte el alta en nuestro servicio de traslados.</h4>
		<ContinueButton title='Continuar' cb={props.startTraslados} />
	</div >
);

export default TrasladosWelcome;