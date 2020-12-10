/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ComingSoon from '../GeneralComponents/ComingSoon';
import Loading from '../GeneralComponents/Loading';
import { getUserMedicalRecord } from '../../store/actions/firebaseQueries';
import { validateUPAff_byDocType, /* transcELG */ } from '../../store/actions/UPActions';
import { getDocumentFB } from '../Utils/firebaseUtils';

const docTypesUP = [2, 3, 4, 5, 7, 1]; // Ordenados por prioridad: DNI, LE, LC, Passport, DNI EXT, CED.

const OnlineSpecialist = ({ match, history }) => {
	const user = useSelector((state) => state.user);
	const { loading } = useSelector((state) => state.front);
	const { plan } = useSelector((state) => state.queries.plan);
	const { dni } = match.params;
	const dispatch = useDispatch();

	useEffect(() => {
		checkPatientPermission();
	}, [user]);

	const checkPatientPermission = useCallback(
		async () => {
			if (!(Object.keys(user).length > 0)) return;
			dispatch({ type: 'LOADING', payload: true });
			if(plan && plan.my_specialist === false) {
				dispatch({ type: 'LOADING', payload: false });
				return false
			}
			try {
				const medicRecs = await getUserMedicalRecord(dni, user.ws);
				let redirect = false;
				const { social_work } = await getDocumentFB('/parametros/userapp/variables/specialist');
				if (user?.corporate_norm?.toLowerCase() === 'union personal') {
					const credNum = await validateUPAff_byDocType(dni, docTypesUP).catch((e) => console.error(e));
					// const isValid = transcELG(credNum || '').catch((e) => console.error(e));
					localStorage.setItem('up_affNum', credNum || '');
					dispatch({ type: 'SET_UP_NUMAFF', payload: credNum || '' });
					redirect = true;
				} else if (social_work.includes(user.corporate_norm) ||
						social_work.includes(user.corporate?.toUpperCase()) || 
						plan.my_specialist === true
				) {
					redirect = true;
				}
				if (!!medicRecs && medicRecs.length) {
					const hasAppoint = medicRecs.some(function (mr) {
						const scheduledTurn = mr.mr_preds && mr.mr_preds.pre_clasif && mr.mr_preds.pre_clasif[0];
						if (scheduledTurn === 'TurnoConsultorioOnline' && mr.mr.destino_final === '') {
							return true;
						} else {
							return false
						}
					});
					if (hasAppoint) {
						return history.push(`/appointmentsonline/pending/${dni}`);
					}
				}
				render(redirect);
				dispatch({ type: 'LOADING', payload: false });
			} catch (err) {
				console.log('ERROR EN ROUTING', err, err.message);
				return history.replace('/');
			}
		}
	,[user]) 

	const render = (redirect) => {
		if (user.first_time && user.first_time.length >= 1) {
			history.push(`/appointmentsonline/${user.first_time}/calendar/${dni}`);
		} else if (redirect) {
			history.push(`/appointmentsonline/specialty/${dni}`);
		} else {
			// console.log('No')
		}
	};

	return <> {loading ? <Loading /> : <ComingSoon />} </>;
};

export default withRouter(OnlineSpecialist);
