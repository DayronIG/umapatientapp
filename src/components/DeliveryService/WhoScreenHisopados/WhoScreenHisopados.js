import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ForOtherHisopados from './ForOtherHisopados';
import { capitalizeName } from '../../Utils/stringUtils';
import BackButton from '../../GeneralComponents/Backbutton';
import { PamiAffiliate } from '../../GeneralComponents/Affiliates/Affiliates';
import moment from 'moment-timezone';
import { getUserParentsFirebase, getPendingTraslate } from '../../../store/actions/firebaseQueries';
import enablePermissions from '../../Utils/enableVidAudPerms';
import Loading from '../../GeneralComponents/Loading';
import { findAllAssignedAppointment } from '../../Utils/appointmentsUtils';
import 'moment/locale/es';
import '../../../styles/deliveryService/whoScreenHisopados.scss';

const WhenScreen = (props) => {
	const dispatch = useDispatch();
	const user  = useSelector((state) => state.user);
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
		}
	}, [user]);

	function selectWho(user) {
		localStorage.setItem('appointmentUserData', JSON.stringify(user));
		if (redirectToConsultory === 'true') {
			props.history.replace(`/appointmentsonline/${user.dni}`);
		} else {
			props.history.replace(`/${user.dni}/onlinedoctor/when`);
		}
	}

	const arrowRight = <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path d="M7.30469 1.60547C6.95312 1.95703 6.98828 2.48438 7.30469 2.83594L11.5586 6.84375H1.46875C0.976562 6.84375 0.625 7.23047 0.625 7.6875V8.8125C0.625 9.30469 0.976562 9.65625 1.46875 9.65625H11.5586L7.30469 13.6992C6.98828 14.0508 6.98828 14.5781 7.30469 14.9297L8.07812 15.7031C8.42969 16.0195 8.95703 16.0195 9.27344 15.7031L16.1289 8.84766C16.4453 8.53125 16.4453 8.00391 16.1289 7.65234L9.27344 0.832031C8.95703 0.515625 8.42969 0.515625 8.07812 0.832031L7.30469 1.60547Z" fill="#B6B6B6"/>
	</svg>

	return (
		<div className='WhoScreenHisopados'>
			{affiliate && loading && <PamiAffiliate welcome={false} />}
			{!affiliate && loading && <Loading centered={true} />}
			{registerParent ? (
				<ForOtherHisopados redirectToConsultory={redirectToConsultory} />
			) : (
				<div className='WhoScreenHisopados__header'>
					<BackButton />
					<div className='WhoScreenHisopados__title'>¿Para quién es el hisopado?</div>
				</div>
			)}
			{!registerParent && (
				<div className='WhoScreenHisopados__btnContainer'>
					<div className='WhoScreenHisopados__btnOption' onClick={() => selectWho(user)}>
						Para mi <span className="WhoScreenHisopados__arrow">{arrowRight}</span>
					</div>
					{parents.map((p, index) => (
						<div className='WhoScreenHisopados__btnOption' key={index} onClick={() => selectWho(p)}>
							Para {capitalizeName(p.fullname)} <span className="WhoScreenHisopados__arrow">{arrowRight}</span>
						</div>
					))}
					<div className='WhoScreenHisopados__btnOption' onClick={() => setRegisterParent(true)}>
						Para otro <span className="WhoScreenHisopados__arrow">{arrowRight}</span>
					</div>
				</div>
			)}
		</div>
	);
};

export default withRouter(WhenScreen);
