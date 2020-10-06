import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ForOther from './ForOther';
import { capitalizeName } from '../../Utils/stringUtils';
import BackButton from '../../GeneralComponents/Backbutton';
import { PamiAffiliate } from '../../GeneralComponents/Affiliates/Affiliates';
import moment from 'moment';
import { getUserParentsFirebase, getPendingTraslate } from '../../../store/actions/firebaseQueries';
import enablePermissions from '../../Utils/enableVidAudPerms';
import ImageFlow from '../../../assets/doctor-online.svg';
import Loading from '../../GeneralComponents/Loading';
import { findAllAssignedAppointment } from '../../Utils/appointmentsUtils';
import 'moment/locale/es';
import 'moment-timezone';
import '../../../styles/whoScreen.scss';

const WhenScreen = (props) => {
	const dispatch = useDispatch();
	const { patient = {} } = useSelector((state) => state.queries);
	const [affiliate, setAffiliate] = useState();
	const [registerParent, setRegisterParent] = useState(false);
	const [parents, setParents] = useState([]);
	const { loading } = useSelector((state) => state.front);
	const [userDataToJson] = useState(JSON.parse(localStorage.getItem('userData')));
	const [userDni] = useState(patient.dni ? patient.dni : userDataToJson.dni);
	const [redirectToConsultory] = useState(props.location.search.split('redirectConsultory=')[1]);

	useEffect(() => {
		if (patient.corporate_norm && patient.corporate_norm === 'PAMI') {
			setAffiliate(patient.corporate_norm);
		}
	}, [patient]);

	useEffect(() => {
		(async function checkAssignations() {
			if ('dni' in patient) {
				localStorage.removeItem('selectedAppointment');
				enablePermissions(userDni);
				if (redirectToConsultory !== 'true') {
					dispatch({ type: 'LOADING', payload: true });
					const type = moment().diff(patient.dob, 'years') <= 16 ? 'pediatria' : '';
					const assigned = await findAllAssignedAppointment(userDni, type);
					dispatch({ type: 'LOADING', payload: false });
					if (assigned) {
						dispatch({ type: 'SET_ASSIGNED_APPOINTMENT', payload: assigned });
						return props.history.replace(`/${userDni}/onlinedoctor/queue`);
					}
				}
			}
		})();
	}, [patient]);

	useEffect(() => {
		if (patient.dni) {
			getUserParentsFirebase(patient.dni)
				.then(function(userParents) {
					setParents(userParents);
				})
				.catch(() => setParents([]));
			getPendingTraslate(patient.dni)
				.then((res) => {
					if (res === true) {
						props.history.push('./derived');
					}
				})
				.catch();
		}
	}, [patient]);

	function selectWho(user) {
		localStorage.setItem('appointmentUserData', JSON.stringify(user));
		if (redirectToConsultory === 'true') {
			props.history.replace(`/${user.dni}/appointmentsonline/`);
		} else {
			props.history.replace(`/${user.dni}/onlinedoctor/when`);
		}
	}

	return (
		<div className='dinamic-template'>
			{affiliate && loading && <PamiAffiliate welcome={false} />}
			{!affiliate && loading && <Loading centered={true} />}
			{registerParent ? (
				<ForOther redirectToConsultory={redirectToConsultory} />
			) : (
				<div className='dinamic-content-container whoAttention'>
					<BackButton />
					<div className='when-question'>¿Para quién desea la atención?</div>
					<div className='image-helper'>
						<img src={ImageFlow} alt='medical' />
					</div>
				</div>
			)}
			{!registerParent && (
				<div className='dinamic-answer'>
					<div className='btn btn-blue-lg' onClick={() => selectWho(patient)}>
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
