import React, {useEffect} from 'react';
import { withRouter, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { GenericHeader } from '../GeneralComponents/Headers';
import AddEmail from './AddEmail';
import WhenScreen from '../OnlineDoctor/WhenScreen/WhenAtt';
import Loading from '../GeneralComponents/Loading';
import EventsHistory from '../EventsHistory/';
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
	const dinamic = useSelector((state) => state.front.dinamic);
	const user = useSelector((state) => state.user);
	const {plan} = useSelector((state) => state.queries.plan);
	const {modal} = useSelector(state => state.front)
	const censo = useSelector(state => state.deliveryService.params.censo)
	const dispatch = useDispatch()

	useEffect(()=> {
        if(!user.login || user.login === [] || user.login === "") {
            dispatch({type: 'OPEN_MODAL', payload: true})
        } else {
			dispatch({type: 'CLOSE_MODAL'})
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
					{modal === true && censo && <AddEmail />}
					<section className='modules-container'>
						<div className='card length4'>
							{returnModule(
								`/${user.ws}/onlinedoctor/who`,
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