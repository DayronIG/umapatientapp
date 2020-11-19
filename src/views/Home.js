/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMedicalRecord } from '../store/actions/firebaseQueries';
import ModulesMenu from '../components/HomePage/ModulesMenu';

const HomePage = () => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.queries.patient);
	const mr = useSelector((state) => state.queries.medicalRecord);

	useEffect(() => {
		if (user && user.dni !== undefined) {
			dispatch(getMedicalRecord(user.dni, user.ws))
		}
	}, [dispatch, user])

	useEffect(() => {
		localStorage.setItem('userMr', JSON.stringify(mr));
	}, [mr])

	useEffect(() => {
		localStorage.setItem('userData', JSON.stringify(user));
	}, [user])

	return <ModulesMenu ws={user.ws} />;
};

export default HomePage;
