import React, { useState, useEffect } from 'react';
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

	const uploadImage = (e) => {
		let dt = moment().format('YYYYMMDDHHmmss');
		let fieldName = e.target.name;
		uploadFileToFirebase(e.target.files[0], `${currentUser.uid}/profile_pic/${dt}`).then((imgLink) => {
			setUserData({ ...userData, [fieldName]: imgLink });
			handleSubmit('profile_pic', { ...userData, [fieldName]: imgLink })
		});
	};

	return (
		<>
		<form className='form-edit-profile' onSubmit={(e) => handleSubmit(e, userData, user, dispatch)}>
			<div className='umaBtn attachFile upload'>
					<FiUpload className='attachFile__icon' />
					<p>Buscar imagen</p>
				<input type='file' className='input-file' name='profile_pic' onChange={(e) => uploadImage(e)} />
			</div>
		</form>
		</>
	);
};

export const PersonalData = ({ user }) => {
	const dispatch = useDispatch();
	const { register, errors } = useForm();
	const { currentUser } = useSelector((state) => state.userActive)
	const [userData, setUserData] = useState({
		address: user.address || '',
		corporate: user.corporate || '',
		dni: user.dni || '',
		dob: user.dob || '',
		fullname: user.fullname || '',
		piso: user.piso || '',
		sex: user.sex || '',
		ws: user.ws || '',
	});

	useEffect(() => {
		console.log(errors, 'errores')
	}, [errors])

	const handleChange = (e) => {
		if(e.target.name === 'dni') {
			console.log(e.target.value, 'value de dni')
		}
		setUserData({ ...userData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e, userData, user) => {
		dispatch({type: 'LOADING', payload: true})
		e.preventDefault();
		console.log(userData)
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
				<GenericInputs
					label='Nombre'
					type='text' 
					name='fullname'
					action={e=>handleChange(e)}
					value={userData.fullname}
					inputRef={
						register(
							{ 
								required: false, 
							}
						)
					} 
				/>
			</div>
			<div>
				<GenericInputs
					label='Teléfono'
					type='number' 
					name='ws'
					action={e=>handleChange(e)}
					value={userData.ws}
					inputRef={
						register(
							{ 
								required: false, 
							}
						)
					} 
				/>
			</div>
			<div>
				<GenericInputs
					label='Documento de identidad'
					type='number' 
					name='dni'
					value={userData.dni}
					action={e=>handleChange(e)}
					inputRef={
						register(
							{  	required: true,
								minLength: 7
							}
						)
					} 
				/>
				{errors.dni && errors.dni.type === "required" && <p className='invalidField'>Campo obligatorio</p>}
                {errors.dni && errors.dni.type === "minLength" && <p className='invalidField'>El número de identificación debe tener al menos 7 números</p>}
			</div>
			<div>
				<GenericInputs
					label='Selecciona tu fecha de nacimiento'
					type='date'
					name='dob'
					value={userData.dob}
					action={(e) => handleChange(e)}
				/>
			</div>
			<div>
				<GenericInputs
					label='Obra social o cobertura de salud'
					type='text' 
					name='corporate'
					value={userData.corporate}
					action={e=>handleChange(e)}
				/>
			</div>
			<div>
				<GenericInputs
					label='Dirección'
					type='text' 
					name='address'
					action={e=>handleChange(e)}
					value={userData.address}
					inputRef={
						register(
							{ 
								required: false, 
							}
						)
					} 
				/>
			</div>
			<div>
				<GenericInputs
					label='Piso/Depto'
					type='text' 
					name='piso'
					action={e=>handleChange(e)}
					value={userData.piso}
					inputRef={
						register(
							{ 
								required: false, 
							}
						)
					} 
				/>
			</div>
			<div className='select-sex'>
 				<label className='sex-label'>Sexo</label>
 				<select onChange={(e) => setUserData({ ...userData, sex: e.target.value })}>
 					<option value={user.sex}>Seleccionar</option>
 					<option value='M'>Hombre</option>
 					<option value='F'>Mujer</option>
 					<option value='O'>Otro</option>
 				</select>
 			</div>
			<button className='button-submit-edit' type='submit'>
				Editar
			</button>
		</form>
	);
};
