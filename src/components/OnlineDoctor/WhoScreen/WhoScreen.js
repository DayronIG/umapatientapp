import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ForOther from './ForOther';
import { capitalizeName } from '../../Utils/stringUtils';
import BackButton from '../../GeneralComponents/Backbutton';
import { PamiAffiliate } from '../../GeneralComponents/Affiliates/Affiliates';
import moment from 'moment-timezone';
import { getUserParentsFirebase, getPendingTraslate } from '../../../store/actions/firebaseQueries';
import enablePermissions from '../../Utils/enableVidAudPerms';
import ImageFlow from '../../../assets/doctor-online.svg';
import Loading from '../../GeneralComponents/Loading';
import { findAllAssignedAppointment } from '../../Utils/appointmentsUtils';
import { getDocumentFB } from '../../Utils/firebaseUtils';
import 'moment/locale/es';
import '../../../styles/whoScreen.scss';

const WhenScreen = (props) => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);
	const [affiliate, setAffiliate] = useState();
	const [registerParent, setRegisterParent] = useState(false);
	const [parents, setParents] = useState([]);
	const { loading } = useSelector((state) => state.front);
	const [userDataToJson] = useState(JSON.parse(localStorage.getItem('userData')));
	const [userDni] = useState(user.dni ? user.dni : userDataToJson.dni);
	const [redirectToConsultory] = useState(props.location.search.split('redirectConsultory=')[1]);

	useEffect(() => {
		if (user.corporate_norm && user.corporate_norm === 'PAMI') {
			setAffiliate(user.corporate_norm);
		}
	}, [user]);

	useEffect(() => {
		(async function checkAssignations() {
			if ('dni' in user) {
				localStorage.removeItem('selectedAppointment');
				enablePermissions(userDni);
				if (redirectToConsultory !== 'true') {
					dispatch({ type: 'LOADING', payload: true });
					const type = moment().diff(user.dob, 'years') <= 16 ? 'pediatria' : '';
					const assigned = await findAllAssignedAppointment(userDni, type);
					dispatch({ type: 'LOADING', payload: false });
					if (assigned) {
						dispatch({ type: 'SET_ASSIGNED_APPOINTMENT', payload: assigned });
						return props.history.replace(`/${userDni}/onlinedoctor/queue`);
					}
				}
			}
		})();
	}, [user]);

	useEffect(() => {
		if (user.dni) {
			getUserParentsFirebase(user.dni)
				.then(function(userParents) {
					setParents(userParents);
				})
				.catch(() => setParents([]));
			getPendingTraslate(user.dni)
				.then((res) => {
					if (res === true) {
						props.history.push('./derived');
					}
				})
				.catch((err) => console.log(err));
		}
	}, [user]);

	async function selectWho(user) {
		localStorage.setItem('appointmentUserData', JSON.stringify(user));
		if(user.dni !== user.group && user.coverage) {
			await getDependantCoverage(user.coverage)
		}
		if (redirectToConsultory === 'true') {
			props.history.replace(`/appointmentsonline/${user.dni}`);
		} else {
			props.history.replace(`/${user.dni}/onlinedoctor/when`);
		}
	}

	const getDependantCoverage = async (coverage) => {
		// Busco BASIC primero porque es el básico sin ningun permiso
		let plan = await getDocumentFB('services/porfolio/BASIC/active')
		let free = await getDocumentFB('services/porfolio/FREE/active')
		if(plan && free) {
			plan["onlinedoctor"] = free.onlinedoctor
		}
		if (!!coverage && Array.isArray(coverage)) { 
			coverage && coverage.forEach(async each => {
				console.log(each)
				if(each?.plan) {
					let path = `services/porfolio/${each?.plan?.toUpperCase()}/active`
					let coverageTemp = await getDocumentFB(path)
					console.log(path, coverageTemp)
					if(coverageTemp && coverageTemp.plan) {
						for (const service in coverageTemp.plan) {
							if(coverageTemp[service] === true) {
								console.log(coverageTemp[service])
								plan.plan[service] = true
							}
						}
					}
				}
			})
			dispatch({type: 'SET_PLAN_DATA', payload: plan })
			console.log(plan)
		}
	}

	return (
		<div className='dinamic-template'>
			<BackButton />
			{affiliate && loading && <PamiAffiliate welcome={false} />}
			{!affiliate && loading && <Loading centered={true} />}
			{registerParent ? (
				<ForOther redirectToConsultory={redirectToConsultory} />
			) : (
				<div className='dinamic-content-container whoAttention'>
					<div className='when-question'>¿Para quién desea la atención?</div>
					<div className='image-helper'>
						<img src={ImageFlow} alt='medical' />
					</div>
				</div>
			)}
			{!registerParent && (
				<div className='dinamic-answer'>
					<div className='btn btn-blue-lg' onClick={() => selectWho(user)}>
						Para mi
					</div>
					{parents.map((p, index) => (
						<div className='btn btn-blue-lg' key={index} onClick={() => selectWho(p)}>
							Para {capitalizeName(p.fullname)}
						</div>
					))}
					<div className='btn btn-blue-lg' onClick={() => setRegisterParent(true)}>
						Para otro
					</div>
				</div>
			)}
		</div>
	);
};

export default withRouter(WhenScreen);
