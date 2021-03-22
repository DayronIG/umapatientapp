import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiUpload } from 'react-icons/fi';
import { useForm } from "react-hook-form";
import moment from 'moment-timezone';
import axios from 'axios';
import { uploadFileToFirebase } from '../Utils/postBlobFirebase';
import { node_patient } from '../../config/endpoints';
import { GenericInputs } from '../User/Login/GenericComponents';

export const ProfilePic = ({ user }) => {
	const dispatch = useDispatch();
	const [userData, setUserData] = useState({ profile_pic: user.profile_pic || '' });
    const { currentUser } = useSelector((state) => state.userActive)

	const handleSubmit = async (e, userData, user) => {
		dispatch({type: 'LOADING', payload: true})
		e.preventDefault();
		let data = {
			newValues: { ...userData },
		};
		await currentUser.getIdToken().then(async token => {
			let headers = { 'Content-Type': 'Application/Json', 'Authorization': `Bearer ${token}` }
			console.log(data)
			await axios
				.patch(`${node_patient}/update/${currentUser.uid}`, data, {headers})
				.then((res) => {
					console.log(res)
					dispatch({ type: 'TOGGLE_DETAIL' });
				})
				.catch((err) => {
					dispatch({ type: 'TOGGLE_DETAIL' });
					console.log(err);
				});
		})
		dispatch({type: 'LOADING', payload: false})
	};

	const uploadImage = (e) => {
		let dt = moment().format('YYYYMMDDHHmmss');
		let fieldName = e.target.name;
		uploadFileToFirebase(e.target.files[0], `${currentUser.uid}/profile_pic/${dt}`).then((imgLink) => {
			setUserData({ ...userData, [fieldName]: imgLink });
		});
	};

	return (
		<>
		<form onSubmit={(e) => handleSubmit(e, userData, user, dispatch)}>
			<div className='umaBtn attachFile'>
				<FiUpload className='attachFile__icon' />
				<p>Buscar Imagen</p>
				<input type='file' name='profile_pic' onChange={(e) => uploadImage(e)} />
			</div>
			<button className='btn btn-blue-lg' type='submit'>
				Subir
			</button>
		</form>
		</>
	);
};

export const PersonalData = ({ user }) => {
	const dispatch = useDispatch();
	const { register, errors } = useForm();
	const { currentUser } = useSelector((state) => state.userActive)
	const [userData, setUserData] = useState({
		corporate: user.corporate || '',
		fullname: user.fullname || '',
		dob: user.dob || '',
		dni: user.dni || '',
		ws: user.ws || ''
	});

	console.log("Ok")
	
	const handleChange = (e) => {
		setUserData({ ...userData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e, userData, user) => {
		dispatch({type: 'LOADING', payload: true})
		e.preventDefault();
		let data = {
			newValues: { ...userData },
		};
		await currentUser.getIdToken().then(async token => {
			let headers = { 'Content-Type': 'Application/Json', 'Authorization': `Bearer ${token}` }
			await axios
				.patch(`${node_patient}/update/${currentUser.uid}`, data, {headers})
				.then((res) => {
					dispatch({ type: 'TOGGLE_DETAIL' });
				})
				.catch((err) => {
					dispatch({ type: 'TOGGLE_DETAIL' });
					console.log(err);
				});
		})
		dispatch({type: 'LOADING', payload: false})
	};

	return (
		<form className='form-edit-profile' onSubmit={(e) => handleSubmit(e, userData, user, dispatch)}>
			<div>
				{/* <small>Nombre</small> */}
				{/* <input
					value={userData.fullname}
					type='text'
					className='form-control'
					name='fullname'
					onChange={handleChange}
				/> */}
					<GenericInputs
					label='Nombre'
					type='text' 
					name='fullname'
					action={e=>handleChange(e)}
					value={userData.fullname}
					inputRef={
						register(
							{ 
								required: true, 
							}
						)
					} 
					/>
					{/* {errors.fullname && errors.fullname.type === "required" && <p className='invalidField'>Campo obligatorio</p>}
                    {errors.fullname && errors.fullname.type === "pattern" && <p className='invalidField'>El formato no es válido</p>} */}
			</div>
			<div>
				{/* <small>Documento de identidad</small> */}
				{/* <input value={userData.dni} type='text' name='dni' onChange={handleChange} /> */}
				<GenericInputs
					label='Documento de identidad'
					type='text' 
					name='dni'
					value={userData.dni}
					action={e=>handleChange(e)}
				/>
			</div>
			<div>
				{/* <small>Obra Social o cobertura de salud</small>
				<input value={userData.corporate} type='text' name='corporate' onChange={handleChange} /> */}
				<GenericInputs
					label='Obra social o cobertura de salud'
					type='text' 
					name='corporate'
					value={userData.corporate}
					action={e=>handleChange(e)}
				/>
			</div>
			<div>
				{/* <small>Fecha de nacimiento</small>
				<input value={userData.dob} type='date' name='dob' onChange={handleChange} /> */}
				<GenericInputs
					label='Selecciona tu fecha de nacimiento'
					type='date'
					name='dob'
					value={userData.dob}
					action={(e) => handleChange(e)}
				/>
			</div>
			<button className='btn btn-blue-lg' type='submit'>
				Editar
			</button>
		</form>
	);
};

export const ContactData = ({ user }) => {
	const dispatch = useDispatch();
	const { currentUser } = useSelector((state) => state.userActive)
	const { register, errors } = useForm();
	const [userData, setUserData] = useState({
		address: user.address || '',
		piso: user.piso || '',
		ws: user.ws || ''
	});
	const handleSubmit = (e, userData, user) => {
		dispatch({type: 'LOADING', payload: true})
		e.preventDefault();
		let data = {
			newValues: { ...userData },
		};
		currentUser.getIdToken().then(async token => {
			let headers = { 'Content-Type': 'Application/Json', 'Authorization': `Bearer ${token}` }
			await axios
				.patch(`${node_patient}/update/${currentUser.uid}`, data, {headers})
				.then((res) => {
					dispatch({ type: 'TOGGLE_DETAIL' });
				})
				.catch((err) => {
					dispatch({ type: 'TOGGLE_DETAIL' });
					console.log(err);
				});
		})
		dispatch({type: 'LOADING', payload: false})
	};

	const handleChange = (e) => {
		setUserData({ ...userData, [e.target.name]: e.target.value });
	};

	return (
		<form className='form-edit-profile' onSubmit={(e) => handleSubmit(e, userData, user, dispatch)}>
			<div>
				<GenericInputs
					label='Ingresa tu numero de celular'
					type='number' 
					name='ws'
					value={userData.ws}
					action={e=>handleChange(e)}
					inputRef={
						register(
							{ 
								required: false, 
								minLength: 10,
								maxLenght: 13
							}
						)
					} 
				/> 
			</div>
			<div>
				{/* <small>Dirección</small>
				<input value={userData.address} type='text' name='address' onChange={handleChange} /> */}
				<GenericInputs
					label='Dirección'
					type='text' 
					name='address'
					value={userData.address}
					action={e=>handleChange(e)}
				/>
			</div>
			<div>
				{/* <small>Piso/Dpto</small>
				<input value={userData.piso} type='text' name='piso' onChange={handleChange} /> */}
				<GenericInputs
					label='Piso/Dpto'
					type='text' 
					name='piso'
					value={userData.piso}
					action={e=>handleChange(e)}
				/>
			</div>
			<button className='btn btn-blue-lg' type='submit'>
				Editar
			</button>
		</form>
	);
};

export const HealtData = ({ user }) => {
	const dispatch = useDispatch();
	const { currentUser } = useSelector((state) => state.userActive)
	const [userData, setUserData] = useState({ sex: user.sex || '' });
	const handleSubmit = (e, userData, user) => {
		dispatch({type: 'LOADING', payload: true})
		e.preventDefault();
		let data = {
			newValues: { ...userData },
		};
		currentUser.getIdToken().then(async token => {
			let headers = { 'Content-Type': 'Application/Json', 'Authorization': `Bearer ${token}` }
			await axios
				.patch(`${node_patient}/update/${currentUser.uid}`, data, {headers})
				.then((res) => {
					dispatch({ type: 'TOGGLE_DETAIL' });
				})
				.catch((err) => {
					dispatch({ type: 'TOGGLE_DETAIL' });
					console.log(err);
				});
		})
		dispatch({type: 'LOADING', payload: false})
	};

	return (
		<form className='form-edit-profile' onSubmit={(e) => handleSubmit(e, userData, user, dispatch)}>
			<div>
				<label>Sexo</label>
				<select onChange={(e) => setUserData({ ...userData, sex: e.target.value })}>
					<option value={user.sex}>Seleccione</option>
					<option value='M'>Hombre</option>
					<option value='F'>Mujer</option>
					<option value='O'>Otro</option>
				</select>
			</div>
			<button className='btn btn-blue-lg' type='submit'>
				Editar
			</button>
		</form>
	);
};
