import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { PersonalData, ContactData, HealtData, ProfilePic } from './ProfileForms';
import { FaUser } from 'react-icons/fa';
import { MdModeEdit } from 'react-icons/md';
import { SignOut } from '../User/Login';
import DBConnection from '../../config/DBConnection';
import BackButton from '../GeneralComponents/Backbutton';
import MobileModal from '../GeneralComponents/Modal/MobileModal';
import Version from '../GeneralComponents/Version';
import moment from 'moment-timezone';
import File from '../../assets/illustrations/File.png'
import '../../styles/profile/profile.scss';

const ProfileComponent = () => {
	const { section } = useSelector((state) => state.front);
	const { currentUser } = useSelector(state => state.userActive)
	const db = DBConnection.firestore()
	const dispatch = useDispatch()
	const [patientAge, setPatientAge] = useState(null)
	const history = useHistory()
	const modal = useSelector((state) => state.front.openDetails)
	const patient = useSelector(state => state.user)
	const [viewData, setViewData] = useState('data')

	console.log(patient, 'traer patient')

	useEffect(() => {
		let unsubscribe;
		if (currentUser?.uid) {
			unsubscribe = db
				.collection('user')
				.doc(currentUser.uid)
				.onSnapshot((user) => {
					dispatch({type: 'GET_PATIENT', payload: user.data()});
				});
		}
		return () => unsubscribe;
	}, [currentUser]);

	useEffect(()=> {
		let years = moment().diff(patient.dob, 'years')
		setPatientAge(years)
	}, [patient.dob])

	const EditButton = ({ section, clase }) => {
		return (
			<button className={`btn-edit ${clase}`}>
				<MdModeEdit
					onClick={() => {
						dispatch({ type: 'EDIT_SECTION', payload: section });
						dispatch({ type: 'TOGGLE_DETAIL' });
					}}
				/>
			</button>
		);
	};

	const EditSection = () => {
		if (section === 'personal') {
			return <PersonalData user={patient} />;
		} else if (section === 'pic') {
			return <ProfilePic user={patient} />;
		} else {
			return 'Esta sección aún no se encuentra disponible';
		}
	};

	const personalData = [
		{
			item: 1,
			field: 'Nombre/s',
			data: `${patient.fullname}`
		},
		{
			item: 2,
			field: 'Teléfono',
			data: `${patient.phone}`
		}, 
		{
			item: 3,
			field: 'DNI / Número de documento',
			data: `${patient.dni}`
		}, 
		{
			item: 4,
			field: 'Fecha de nacimiento',
			data: `${moment(patient.dob).format('DD-MM-YYYY')}`
		},
		{
			item: 5,
			field: 'Cobertura de salud',
			data: `${patient.corporate == '' ? 'No posee' : patient.corporate}`
		},
		{
			item: 6,
			field: 'Dirección',
			data: `${patient.address}`
		},
		{
			item: 7,
			field: 'Piso/Dpto',
			data: `${patient.piso}`
		},
		{
			item: 8,
			field: 'Sexo',
			data: 
				`${
					patient.sex === 'F' && 'Femenino' || 
					patient.sex === 'M' && 'Masculino' ||
					patient.sex === 'O' && 'Otro'
				}`
		},
	]

	return (
		<>
			{modal && (
				<MobileModal title='Editar datos'
				callback={()=>{dispatch({type:"TOGGLE_DETAIL", payload:false})}}>
					<EditSection />
				</MobileModal>
			)}
			<BackButton/>
			<main className='profile-container'>
				<section className='profile-header-info'>
					{patient.profile_pic ?
						<div className='pic-container'>
							<img className='profile-pic' src={patient.profile_pic} alt='Perfil' /> 
							<EditButton section='pic' className='btn-edit' clase='pic' />
						</div>
						: 
						<div className='pic-container'>
							<FaUser size='3.5rem' color='#fff' />
							<EditButton section='pic' className='btn-edit' clase='pic' />
						</div>
					}
					<h1 className='fullName'>{patient.fullname}</h1>
					{patientAge && 
						<h2 className='patient-age'>
							{patientAge} años
						</h2>
					}
				</section>
				 {/* <section className='personal-data'>
					<h2 
						className={viewData === 'data'? 'data-section clicked' : 'data-section'} 
						onClick={()=>setViewData('data')}>
							Mis datos
					</h2>
					<h2 
						className={viewData === 'background'? 'data-section clicked ' : 'data-section'} 
						onClick={()=>setViewData('background')}>
							Mis antecedentes
					</h2>
				</section>  */}
				<section className='profile-info'>
					{
						viewData === 'data' ?
						<div>
							<div className='header-section-info'>
								<h3 className='text'>Datos personales</h3> 
								<div className='edit-info'>
									<p>Editar</p>
									<EditButton section='personal' className='btn-edit' clase='personal' />
								</div>
							</div>
							{
								personalData.map((item) => {
									return (
										<div className='data-field' key={item.item}>
											<p className='field'>{item.field}</p>
											<p className='data'>{item.data}</p>
										</div>
									)
								})
							}
						</div>
						:
						<div className='empty-section'>
							<img src={File} alt='Archivo' className='file-img'/>
							<article className='background-to-fill'>
								<h1>Aún no tienes antecedentes</h1>
								<h2>Aquí podrás visualizar tus antecedentes de salud. Complétalos para brindarte una mejor atención.</h2>
								<h2>¡Comencemos!</h2>
							</article>
							<button className='get-started' onClick={()=> history.push(`/antecedents/${patient.id}/risk`)}>Comenzar</button>
						</div>
					}
				</section>
				<section className='logOut'>
					<button 
						onClick={async () => {
							await SignOut();
							dispatch({ type: 'RESET_USER_DATA' });
							history.replace('/');
						}} 
						className="btn-log-out">
							Cerrar sesión
					</button>
				</section>
				<div className='umaVersion'>
					<Version />
				</div>
			</main>
		</>
	);
};
export default ProfileComponent;
