import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { GenericHeader } from '../GeneralComponents/Headers';
import WhenScreen from '../OnlineDoctor/WhenScreen/WhenAtt';
import Loading from '../GeneralComponents/Loading';
import EventsHistory from '../EventsHistory/';
import BuyHisopado from '../DeliveryService/BuyButton'
import ValidateAction from '../ValidateAction';
import UmaCareHome from '../UmaCare/Home'
import iconGuardia from '../../assets/icons/icon-guardia.svg';
import iconAutodiagnostico from '../../assets/icons/icon-autodiagnostico.svg';
import iconEstudios from '../../assets/icons/icon-estudios.svg';
import iconEspecialista from '../../assets/icons/icon-especialista.svg';
import iconTraslados from '../../assets/icons/icon-traslados.svg';
import iconUmacare from '../../assets/icons/icon-umaCare.svg'
import '../../styles/generalcomponents/ModulesMenu.scss';

const ModulesMenu = () => {
	const dinamic = useSelector((state) => state.front.dinamic);
	const { patient } = useSelector((state) => state.queries);
	const { hisopadosActive } = useSelector((state) => state.front);

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
			{patient.ws ? (
				<>
					{dinamic && dinamic.whenScreen && <WhenScreen />}
					<GenericHeader children={patient.fullname} />
					{hisopadosActive && <BuyHisopado />}
					<section className='modules-container'>
						<div className='card length3'>
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
								`/${patient.ws}/transport`,
								'translation',
								iconTraslados,
								'Traslados'
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
							{/* {returnModule(
								`/${patient.ws}/transport`,
								'umacare',
								iconUmacare,
								'UMA Care'
							)} */}
						</div>
					</section>
					<EventsHistory />
					<UmaCareHome />
					{/* <TrasladosHome /> */}
{/* 					<button className="needhelp__btn">
						<img src={iconBubbles} alt="Necesito ayuda"/>
						Necesito ayuda
					</button> */}
				</>
			) : (
					<Loading />
				)}
		</>
	);
};

export default withRouter(ModulesMenu);
