import React, { useEffect, useState } from 'react';
import { withRouter, Link, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { GenericHeader } from '../GeneralComponents/Headers';
import ButtonHome from '../Derivations/ButtonHome';
import BuyHisopado from '../DeliveryService/BuyButton'
import EventsHistory from '../EventsHistory/index';
import Loading from '../GeneralComponents/Loading';
import TrasladosHome from './TrasladosHome';
import UmaCareHome from '../UmaCare/Home';
import ValidateAction from '../ValidateAction';
import WhenScreen from '../OnlineDoctor/WhenScreen/WhenAtt';
import iconAutodiagnostico from '../../assets/icons/icon-autodiagnostico.svg';
import iconEspecialista from '../../assets/icons/icon-especialista.svg';
import iconEstudios from '../../assets/icons/icon-estudios.svg';
import iconGuardia from '../../assets/icons/icon-guardia.svg';
import '../../styles/generalcomponents/ModulesMenu.scss';

const ModulesMenu = () => {
	const history = useHistory();
	const dinamic = useSelector((state) => state.front.dinamic);
	const user = useSelector((state) => state.user);
	const derivationActive = useSelector((state) => state.derivations.derivation.derivationActive);
	const derivationStatus = useSelector((state) => state.derivations.derivation.derivationStatus);
	const { plan } = useSelector((state) => state.queries.plan);
	const [showButtonDerivation, setShowButtonDerivation] = useState(false)

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

	useEffect(() => {
		if(derivationActive && derivationStatus !== 'Finalizado/No registrado') {
			setShowButtonDerivation(true)
		}else {
			setShowButtonDerivation(false)
		}
	}, [derivationActive])
	
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
					{showButtonDerivation && <ButtonHome text='Derivación en curso'/>}
					<section className='modules-container'>
						<div className='card length4'>
							{returnModule(
								`/onlinedoctor/who`,
								'onlinedoctor',
								iconGuardia,
								'Guardia'
							)}
							{returnModule(
								`/autonomous/${user.ws}`,
								'autonomous',
								iconAutodiagnostico,
								'Auto Diagnóstico'
							)}
							{returnModule(
								`/wellness/${user.ws}`,
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