import React, { useEffect, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ComingSoon from '../GeneralComponents/ComingSoon';
import Loading from '../GeneralComponents/Loading';
import { getUserMedicalRecord } from '../../store/actions/firebaseQueries';
import { validateUPAff_byDocType, transcELG } from '../../store/actions/UPActions';
import { getDocumentFB } from '../Utils/firebaseUtils';

const docTypesUP = [2, 3, 4, 5, 7, 1]; // Ordenados por prioridad: DNI, LE, LC, Passport, DNI EXT, CED.

const OnlineSpecialist = ({ match, history }) => {
	const { patient } = useSelector((state) => state.queries);
	const { loading } = useSelector((state) => state.front);
	const { dni } = match.params;
	const dispatch = useDispatch();

	useEffect(() => {
		checkPatientPermission();
	}, [patient]);

	const checkPatientPermission = useCallback(
		async () => {
			if (!(Object.keys(patient).length > 0)) return;
			dispatch({ type: 'LOADING', payload: true });
			try {
				const medicRecs = await getUserMedicalRecord(dni, patient.ws);
				let redirect = false;
				const { social_work } = await getDocumentFB('/parametros/userapp/variables/specialist');
				if (patient?.corporate_norm?.toLowerCase() === 'union personal') {
					const credNum = await validateUPAff_byDocType(dni, docTypesUP).catch((e) => console.error(e));
					const isValid = transcELG(credNum || '').catch((e) => console.error(e));
					localStorage.setItem('up_affNum', credNum || '');
					dispatch({ type: 'SET_UP_NUMAFF', payload: credNum || '' });
					redirect = true;
				} else if (social_work.includes(patient.corporate_norm) ||
						social_work.includes(patient.corporate?.toUpperCase())
				) {
					redirect = true;
				}
				if (!!medicRecs && medicRecs.length) {
					const hasAppoint = medicRecs.some(function (mr) {
						const scheduledTurn = mr.mr_preds && mr.mr_preds.pre_clasif && mr.mr_preds.pre_clasif[0];
						if (scheduledTurn === 'TurnoConsultorioOnline' && mr.mr.destino_final === '') {
							return true;
						}
					});
					if (hasAppoint) {
						return history.push(`/${dni}/appointmentsonline/history`);
					}
				}
				render(redirect);
				dispatch({ type: 'LOADING', payload: false });
			} catch (err) {
				console.log('ERROR EN ROUTING', err, err.message);
				return history.replace('/');
			}
		}
	,[patient]) 

	const render = (redirect) => {
		if (patient.first_time && patient.first_time.length >= 1) {
			history.push(`/${dni}/appointmentsonline/${patient.first_time}/calendar`);
		} else if (redirect) {
			history.push(`/${dni}/appointmentsonline/specialty`);
		} else {
			// console.log('No')
		}
	};

	return <> {loading ? <Loading /> : <ComingSoon />} </>;
};

export default withRouter(OnlineSpecialist);
