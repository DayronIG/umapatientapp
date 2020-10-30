import React from 'react';
import { GenericHeader } from '../GeneralComponents/Headers';
import taxi from '../../assets/icons/taxi.png'
import Backbutton from '../GeneralComponents/Backbutton';
import FooterBtn from '../GeneralComponents/FooterBtn';
import '../../styles/TrasladosWelcome.scss';

const TrasladosWelcome = (props) => {
	return (
		<div className='traslados-welcome-container'>
			<GenericHeader />
			<Backbutton />
			<div className='traslados-content'>
				<div className='transport-img'>
					<img src={taxi} alt="Traslados sanitarios" />
				</div>
				<h1 className='h12'>Traslados sanitarios</h1>
				<h4 className='h32'>Haga click en comenzar para registrarse en el servicio.</h4>
			</div>
			<FooterBtn
				mode="single"
				text="Comenzar"
				callback={() => props.startTraslados()}
			/>
		</div >
	)
}
export default TrasladosWelcome;