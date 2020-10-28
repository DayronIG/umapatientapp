import React from 'react';
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
	faStethoscope
} from '@fortawesome/free-solid-svg-icons';
import { GenericHeader } from '../GeneralComponents/Headers';
import WhenScreen from '../OnlineDoctor/WhenScreen/WhenAtt';
import Loading from '../GeneralComponents/Loading';
import EventsHistory from '../EventsHistory/';
import LifeJoy from './LifeJoy';
import BuyHisopado from '../Hisopado'
import CoronavirusModal from './CoronavirusModal';
import ValidateAction from '../ValidateAction';
import UmaCareHome from '../UmaCare/Home'
import TrasladosHome from '../Traslados/Home'
import '../../styles/generalcomponents/ModulesMenu.scss';
import iconGuardia from '../../assets/icons/icon-guardia.svg';
import iconAutodiagnostico from '../../assets/icons/icon-autodiagnostico.svg';
import iconEstudios from '../../assets/icons/icon-estudios.svg';
import iconEspecialista from '../../assets/icons/icon-especialista.svg';
import iconBubbles from '../../assets/icons/icon-bubbles.svg';

const ModulesMenu = () => {
	const dinamic = useSelector((state) => state.front.dinamic);
	const { patient } = useSelector((state) => state.queries);

	const returnModule = (link, field, icon, text) => {
		return (
			<ValidateAction action='redirect' field={field}>
				<div className='module-button'>
					<Link to={link} className='module-name'>
							<div className='module-ico'>
								<img src={icon} alt={text} />
							</div>
						<p className='module-title'>{text}</p>
					</Link>
				</div>
			</ValidateAction>
		);
	};

	return (
		<>
			<CoronavirusModal />
			{patient.ws ? (
				<>
					{dinamic && dinamic.whenScreen && <WhenScreen />}
					<GenericHeader children={patient.fullname} />
					<BuyHisopado />
					<section className='modules-container'>
						<div className='card length4'>
							{returnModule(
								`/${patient.ws}/onlinedoctor/who`,
								'onlinedoctor',
								iconGuardia,
								'Guardia'
							)}
							{returnModule(
								`/${patient.ws}/autonomous`,
								'autonomous',
								iconAutodiagnostico,
								'Auto Diagnóstico'
							)}
							{returnModule(
								`/${patient.ws}/wellness`,
								'wellness',
								iconEstudios,
								'Estudios'
							)}
							{returnModule(
								`/appointmentsonline/who?redirectConsultory=true`,
								'my_specialist',
								iconEspecialista,
								'Mi especialista'
							)}
						</div>
					</section>
					<UmaCareHome />
					<TrasladosHome />
					<EventsHistory />
					<button className="needhelp__btn">
						<img src={iconBubbles} alt="Necesito ayuda"/>
						Necesito ayuda
					</button>
				</>
			) : (
					<Loading />
				)}
		</>
	);
};

export default withRouter(ModulesMenu);
