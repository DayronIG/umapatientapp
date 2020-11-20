/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMedicalRecord } from '../store/actions/firebaseQueries';
import ModulesMenu from '../components/HomePage/ModulesMenu';

const HomePage = () => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);
	const mr = useSelector((state) => state.queries.medicalRecord);

	useEffect(() => {
		if (user && user.dni !== "") {
			dispatch(getMedicalRecord(user.dni, user.ws))
		}
	}, [dispatch, user])

	useEffect(() => {
		try {
			localStorage.setItem('userMr', JSON.stringify(mr));
		} catch (err) {
			console.error(err)
		}
	}, [mr])

	useEffect(() => {
		try {
			let u = user 
			delete u['current_events']
			localStorage.setItem('userData', JSON.stringify(u));
		} catch (err) {
			console.error(err)
		}
	}, [user])

	return <ModulesMenu ws={user.ws} />;
};

export default HomePage;
