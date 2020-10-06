import React, { useEffect, useState } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faLaptopMedical,
	faUserMd,
	faClinicMedical,
	faNotesMedical,
	faBus,
	faVrCardboard,
} from '@fortawesome/free-solid-svg-icons';
import { GenericHeader } from '../GeneralComponents/Headers';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import WhenScreen from '../OnlineDoctor/WhenScreen/WhenAtt';
import Loading from '../GeneralComponents/Loading';
import EventsHistory from '../EventsHistory/';
import SliderHome from './SliderHome';
import LifeJoy from './LifeJoy';
import Subscription from './Subscription';
import CoronavirusModal from './CoronavirusModal';
import ValidateAction from '../ValidateAction';
import PAMI from '../../assets/logos/pami.png';
import ToastNotification from '../GeneralComponents/toastNotification'
/* import { PamiAffiliate } from '../GeneralComponents/Affiliates/Affiliates'; */
// import Module from './Module';
// import { ModulesMenuLang } from '../../langs/';
// import { getDoctorsCustom } from '../../store/actions/firebaseQueries';
import '../../styles/generalcomponents/ModulesMenu.scss';

const ModulesMenu = (props) => {
	const [notification, setNotification] = useState(false)
	const { incomingCall } = useSelector(state => state.call)
	const dinamic = useSelector((state) => state.front.dinamic);
	const { patient } = useSelector((state) => state.queries);
	const [, setAffiliate] = useState();
	const [counter, setCounter] = useState(0); // Modificar a 5 cuando salgamos a prod.

	useEffect(() => {
		if (false && patient.corporate_norm && patient.corporate_norm === 'PAMI') {
			// Quitar false en prod
			setAffiliate(patient.corporate_norm);
		}


	}, [])

	useEffect(() => {
		if (incomingCall) setNotification(true)
	}, [incomingCall])


	useEffect(() => {
		let inter = setInterval(() => {
			if (counter === 0) {
				setAffiliate(false);
			} else {
				setCounter(counter - 1);
			}
		}, 0); /* modificar a 1 seg en prod */
		return () => clearInterval(inter);
	}, [counter]);

	const returnModule = (link, field, icon, text) => {
		return (
			<ValidateAction action='redirect' field={field}>
				<div className='module-button'>
					<Link to={link} className='module-name'>
						{/* patient.corporate_norm === "PAMI" */ false && field === 'onlinedoctor' ? (
							<img src={PAMI} alt='pami' />
						) : (
								<div className='module-ico'>
									<FontAwesomeIcon icon={icon} />
								</div>
							)}
						<p className='module-title'>{text}</p>
					</Link>
				</div>
			</ValidateAction>
		);
	};

	return (
		<>
			<CoronavirusModal />
			{props.ws ? (
				<>
					{dinamic && dinamic.whenScreen && <WhenScreen />}
					<GenericHeader children={patient.fullname} />

					<Subscription />
					<section className='modules-container'>
						<div className='card'>
							{returnModule(
								`/${props.ws}/onlinedoctor/who`,
								'onlinedoctor',
								faLaptopMedical,
								'Consulta Online (Guardia)'
							)}
							{returnModule(`/${props.ws}/transport`, 'translation', faBus, 'Traslados')}
							{returnModule(
								`/appointmentsonline/who?redirectConsultory=true`,
								'my_specialist',
								faNotesMedical,
								'Mi especialista Online'
							)}
							{returnModule(`/${props.ws}/vmd`, 'vmd', faUserMd, 'Visita médica Domiciliaria')}
							{returnModule(
								`/${props.ws}/autonomous`,
								'autonomous',
								faVrCardboard,
								'Consulta Autonomous'
							)}
							{returnModule(
								`/${props.ws}/comingSoon`,
								'consultory_turn',
								faClinicMedical,
								'Turno en consultorio'
							)}
						</div>
					</section>
					<LifeJoy />
					<EventsHistory />
					<button className='promotions-button mx-auto' onClick={() => console.log('Send msg')}>
						<a
							href={`whatsapp://send?text=Hola, te recomiendo UMA. Mi plataforma de salud y bienestar. Haz clic en el enlace para usarla https://wa.me/5491123000066?text=[REF:${props.ws}] Hola,%20quiero%20registrarme%20en%20Uma`}
							data-action='share/whatsapp/share'>
							<div className='d-flex'>
								<div className='promotions-ico'>
									<FontAwesomeIcon icon={faWhatsapp} />
								</div>
								<span className='promotions-text'>
									Invita a un amigo y gana puntos canjeables por servicios médicos para utilizar
									cuando quieras.
								</span>
							</div>
							<div className='discount'>GIFT</div>
						</a>
					</button>
					<SliderHome />
				</>
			) : (
					<Loading />
				)}
		</>
	);
};

export default withRouter(ModulesMenu);
