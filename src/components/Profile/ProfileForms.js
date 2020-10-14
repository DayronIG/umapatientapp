import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FiUpload } from 'react-icons/fi';
import moment from 'moment';
import 'moment-timezone';
import axios from 'axios';
import { uploadFileToFirebase } from '../Utils/postBlobFirebase';
import { Loader } from '../global/Spinner/Loaders';
import { node_patient } from '../../config/endpoints';

const token = localStorage.getItem('token');

export const ProfilePic = ({ user }) => {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [userData, setUserData] = useState({ profile_pic: user.profile_pic || '' });

	const handleSubmit = (e, userData, user) => {
		e.preventDefault();
		let data = {
			newValues: { ...userData },
		};
		axios
			.patch(`${node_patient}/${user.dni}`, data, {headers: { 'Content-Type': 'Application/json', Authorization: token }})
			.then((res) => {
				dispatch({ type: 'TOGGLE_DETAIL' });
			})
			.catch((err) => {
				dispatch({ type: 'TOGGLE_DETAIL' });
				console.log(err);
			});
	};

	const uploadImage = (e) => {
		setLoading(true);
		let dt = moment().format('YYYYMMDDHHmmss');
		let fieldName = e.target.name;
		uploadFileToFirebase(e.target.files[0], `${user.dni}/profile_pic/${dt}`).then((imgLink) => {
			setUserData({ ...userData, [fieldName]: imgLink });
			setLoading(false);
		});
	};

	return (
		<>
			{loading ? (
				<div className='text-center my-5'>
					<Loader />
				</div>
			) : (
					<form onSubmit={(e) => handleSubmit(e, userData, user, dispatch)}>
						<div className='input-file'>
							<p>Buscar Imagen</p>
							<FiUpload size='1.3rem' />
							<input type='file' name='profile_pic' onChange={uploadImage} />
						</div>
						<button className='btn btn-blue-lg' type='submit'>
							Subir
					</button>
					</form>
				)}
		</>
	);
};

export const PersonalData = ({ user }) => {
	const dispatch = useDispatch();
	const [userData, setUserData] = useState({
		corporate: user.corporate || '',
		fullname: user.fullname || '',
		dob: user.dob || '',
	});

	const handleChange = (e) => {
		setUserData({ ...userData, [e.target.name]: e.target.value });
	};
	const handleSubmit = (e, userData, user) => {
		e.preventDefault();
		let data = {
			newValues: { ...userData },
		};
		axios
			.patch(`${node_patient}/${user.dni}`, data,  {headers: { 'Content-Type': 'Application/json', Authorization: token }})
			.then((res) => {
				dispatch({ type: 'TOGGLE_DETAIL' });
			})
			.catch((err) => {
				dispatch({ type: 'TOGGLE_DETAIL' });
				console.log(err);
			});
	};

	return (
		<form className='form-edit-profile' onSubmit={(e) => handleSubmit(e, userData, user, dispatch)}>
			<div>
				<small>Nombre</small>
				<input
					value={userData.fullname}
					type='text'
					className='form-control'
					name='fullname'
					onChange={handleChange}
				/>
			</div>
			<div>
				<small>Obra Social</small>
				<input value={userData.corporate} type='text' name='corporate' onChange={handleChange} />
			</div>
			<div>
				<small>Fecha de nacimiento</small>
				<input value={userData.dob} type='date' name='dob' onChange={handleChange} />
			</div>
			<button className='btn btn-blue-lg m-2' type='submit'>
				Editar
			</button>
		</form>
	);
};

export const ContactData = ({ user }) => {
	const dispatch = useDispatch();
	const [userData, setUserData] = useState({
		address: user.address || '',
		piso: user.piso || '',
	});
	const handleSubmit = (e, userData, user) => {
		e.preventDefault();
		let data = {
			newValues: { ...userData },
		};
		axios
			.patch(`${node_patient}/${user.dni}`, data,  {headers: { 'Content-Type': 'Application/json', Authorization: token }})
			.then((res) => {
				dispatch({ type: 'TOGGLE_DETAIL' });
			})
			.catch((err) => {
				dispatch({ type: 'TOGGLE_DETAIL' });
				console.log(err);
			});
	};

	const handleChange = (e) => {
		setUserData({ ...userData, [e.target.name]: e.target.value });
	};

	return (
		<form className='form-edit-profile' onSubmit={(e) => handleSubmit(e, userData, user, dispatch)}>
			<div>
				<small>Dirección</small>
				<input value={userData.address} type='text' name='address' onChange={handleChange} />
			</div>
			<div>
				<small>Piso/Dpto</small>
				<input value={userData.piso} type='text' name='piso' onChange={handleChange} />
			</div>
			<button className='btn btn-blue-lg m-2' type='submit'>
				Editar
			</button>
		</form>
	);
};

export const HealtData = ({ user }) => {
	const dispatch = useDispatch();
	const [userData, setUserData] = useState({
		sex: user.sex || '',
	});
	const handleSubmit = (e, userData, user) => {
		e.preventDefault();
		let data = {
			newValues: { ...userData },
		};
		axios
			.patch(`${node_patient}/${user.dni}`, data,  {headers: { 'Content-Type': 'Application/json', Authorization: token }})
			.then((res) => {
				dispatch({ type: 'TOGGLE_DETAIL' });
			})
			.catch((err) => {
				dispatch({ type: 'TOGGLE_DETAIL' });
				console.log(err);
			});
	};

	return (
		<form className='form-edit-profile' onSubmit={(e) => handleSubmit(e, userData, user, dispatch)}>
			<div>
				<small>Sexo</small>
				<select onChange={(e) => setUserData({ ...userData, sex: e.target.value })}>
					<option value={user.sex}>Seleccione</option>
					<option value='M'>Hombre</option>
					<option value='F'>Mujer</option>
				</select>
			</div>
			<button className='btn btn-blue-lg m-2' type='submit'>
				Editar
			</button>
		</form>
	);
};
