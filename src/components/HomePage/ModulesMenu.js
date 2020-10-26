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
} from '@fortawesome/free-solid-svg-icons';
import { GenericHeader } from '../GeneralComponents/Headers';
import WhenScreen from '../OnlineDoctor/WhenScreen/WhenAtt';
import Loading from '../GeneralComponents/Loading';
import EventsHistory from '../EventsHistory/';
import LifeJoy from './LifeJoy';
import Subscription from './Subscription';
import CoronavirusModal from './CoronavirusModal';
import ValidateAction from '../ValidateAction';
import '../../styles/generalcomponents/ModulesMenu.scss';

const ModulesMenu = (props) => {
	const dinamic = useSelector((state) => state.front.dinamic);
	const { patient } = useSelector((state) => state.queries);

	const returnModule = (link, field, icon, text) => {
		return (
			<ValidateAction action='redirect' field={field}>
				<div className='module-button'>
					<Link to={link} className='module-name'>
							<div className='module-ico'>
								<FontAwesomeIcon icon={icon} />
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
					<Subscription />
					<section className='modules-container'>
						<div className='card'>
							{returnModule(
								`/${patient.ws}/onlinedoctor/who`,
								'onlinedoctor',
								faLaptopMedical,
								'Consulta Online (Guardia)'
							)}
							{returnModule(`/${patient.ws}/transport`, 'translation', faBus, 'Traslados')}
							{returnModule(
								`/appointmentsonline/who?redirectConsultory=true`,
								'my_specialist',
								faNotesMedical,
								'Mi especialista Online'
							)}
							{returnModule(`/${patient.ws}/vmd`, 'vmd', faUserMd, 'Visita médica Domiciliaria')}
							{returnModule(
								`/${patient.ws}/autonomous`,
								'autonomous',
								faVrCardboard,
								'Consulta Autonomous'
							)}
							{returnModule(
								`/${patient.ws}/comingSoon`,
								'consultory_turn',
								faClinicMedical,
								'Turno en consultorio'
							)}
						</div>
					</section>
					<LifeJoy />
					<EventsHistory />
				</>
			) : (
					<Loading />
				)}
		</>
	);
};

export default withRouter(ModulesMenu);
