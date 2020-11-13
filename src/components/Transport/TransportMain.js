
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { check_exist } from '../../config/endpoints';
import Axios from 'axios';
import Loading from '../GeneralComponents/Loading';
import '../../styles/generalcomponents/TransportMain.scss';

const TransportWrapperComponent = () => {
	const token = useSelector(state => state.userActive.token);
	const [activated, setActivated] = useState(null);
	const dispatch = useDispatch();
	const { ws } = useParams();
	const history = useHistory();
	const [userData] = useState(JSON.parse(localStorage.getItem('userData')));

	useEffect(() => {
		dispatch({ type: 'LOADING', payload: true });
		Axios.post(check_exist, {
			'ws': userData.ws,
			'dni': userData.dni
		}, { 
			headers: { 
			'Content-Type': 'application/json;charset=UTF-8', 'Authorization': token 
		} })
			.then(function (response) {
				setActivated(response.data);
			}).catch(function (error) {
				console.error(error);
			}).finally(function () {
				dispatch({ type: 'LOADING', payload: false });
			});
	}, []);

	useEffect(() => {
		if (activated === true) {
			history.push(`/${ws}/transportUserActive`);
		} else if (activated === false) {
			history.push(`/${ws}/transportRegister`);
		}
	}, [activated, history]);

	return (
		<div className="transportWrapper">
			<Loading />
		</div>
	)
}

export default TransportWrapperComponent;
