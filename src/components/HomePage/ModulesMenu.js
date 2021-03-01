import React, {useEffect} from 'react';
import { withRouter, Link, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { GenericHeader } from '../GeneralComponents/Headers';
import WhenScreen from '../OnlineDoctor/WhenScreen/WhenAtt';
import Loading from '../GeneralComponents/Loading';
import EventsHistory from '../EventsHistory/index';
import BuyHisopado from '../DeliveryService/BuyButton'
import ValidateAction from '../ValidateAction';
import UmaCareHome from '../UmaCare/Home';
import TrasladosHome from './TrasladosHome';
import '../../styles/generalcomponents/ModulesMenu.scss';
import iconGuardia from '../../assets/icons/icon-guardia.svg';
import iconAutodiagnostico from '../../assets/icons/icon-autodiagnostico.svg';
import iconEstudios from '../../assets/icons/icon-estudios.svg';
import iconEspecialista from '../../assets/icons/icon-especialista.svg';

const ModulesMenu = () => {
	const history = useHistory();
	const dinamic = useSelector((state) => state.front.dinamic);
	const user = useSelector((state) => state.user);
	const {plan} = useSelector((state) => state.queries.plan);

	useEffect(()=> {
		if(user.core_id) {
			if(user.phone || user.ws) {
				if (!user.login || user.login === [] || user.login === "") {
					history.push('/login/welcomeAgain');
				}
			} else {
				history.push('/signup/form/2');
			}
		}
	}, [user])
	
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
			{user.ws ? (
				<>
					{dinamic && dinamic.whenScreen && <WhenScreen />}
					<GenericHeader children={user.fullname} />
					<BuyHisopado />
					<section className='modules-container'>
						<div className='card length4'>
							{returnModule(
								`/onlinedoctor/who/${user.ws}`,
								'onlinedoctor',
								iconGuardia,
								'Guardia'
							)}
							{returnModule(
								`/${user.ws}/autonomous`,
								'autonomous',
								iconAutodiagnostico,
								'Auto Diagnóstico'
							)}
							{returnModule(
								`/${user.ws}/wellness`,
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
					<EventsHistory />
					<UmaCareHome />
					{plan?.translation && <TrasladosHome />}
				</>
			) : (
					<Loading />
				)}
		</>
	);
};

export default withRouter(ModulesMenu);