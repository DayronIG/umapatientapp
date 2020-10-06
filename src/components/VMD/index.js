import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SearchVMDService from './SearchVMDService.js';
import VMDService from './VMDService.js';
import { getUser, getPlan } from '../../store/actions/firebaseQueries';
import Loading from '../GeneralComponents/Loading';

const VMD = () => {
	const dispatch = useDispatch();
	const plan = useSelector((state) => state.queries.plan);
	const patient = useSelector((state) => state.queries.patient);
	const loading = useSelector((state) => state.front.loading);

	useEffect(() => {
		dispatch({ type: 'LOADING', payload: true });
		try {
			let user;
			if (patient && patient.dni) {
				user = patient;
			} else if (localStorage.getItem('userData')) {
				user = JSON.parse(localStorage.getItem('userData'));
			}
			getUser(user.dni).then((res) => {
				getPlan(res.suscription)
					.then((res) => {
						if (res) {
							dispatch({ type: 'SET_PLAN_DATA', payload: res });
						}
						dispatch({ type: 'LOADING', payload: false });
					})
					.catch((err) => {
						console.log(err);
						dispatch({ type: 'LOADING', payload: false });
					});
			});
		} catch (err) {
			console.log(err);
			dispatch({ type: 'LOADING', payload: false });
		}
	}, [patient]);

	return (
		<>
			{loading && <Loading />}
			{plan.userapp && plan.userapp['4'] === '1' ? <VMDService /> : <SearchVMDService />}
		</>
	);
};

export default VMD;
