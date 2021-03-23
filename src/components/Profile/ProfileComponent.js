import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import DBConnection from '../../config/DBConnection';
import MobileModal from '../GeneralComponents/Modal/MobileModal';
import { PersonalData, ContactData, HealtData, ProfilePic } from './ProfileForms';
import Version from '../GeneralComponents/Version';
import { FaArrowLeft, FaUser } from 'react-icons/fa';
import { MdModeEdit } from 'react-icons/md';
import moment from 'moment-timezone';
import '../../styles/profile.scss';
import { SignOut } from '../User/Login';

const ProfileComponent = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const db = DBConnection.firestore();
	const {currentUser} = useSelector(state => state.userActive)
	const modal = useSelector((state) => state.front.openDetails);
	const { section } = useSelector((state) => state.front);
	const patient = useSelector(state => state.user);

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


	const EditButton = ({ section, clase }) => {
		return (
			<MdModeEdit
				className={`btn-edit ${clase}`}
				onClick={() => {
					dispatch({ type: 'EDIT_SECTION', payload: section });
					dispatch({ type: 'TOGGLE_DETAIL' });
				}}
			/>
		);
	};

	const EditSection = () => {
		if (section === 'personal') {
			return <PersonalData user={patient} />;
		} else if (section === 'contact') {
			return <ContactData user={patient} />;
		} else if (section === 'health') {
			return <HealtData user={patient} />;
		} else if (section === 'pic') {
			return <ProfilePic user={patient} />;
		} else {
			return 'Esta sección aún no se encuentra disponible';
		}
	};

	return (
		<>
			{modal && (
				<MobileModal title='Editar datos'
				callback={()=>{dispatch({type:"TOGGLE_DETAIL", payload:false})}}>
					<EditSection />
				</MobileModal>
			)}
			<div className='profile-container'>
				<div className='profile-top-icons' onClick={() => history.push('/')}>
					<FaArrowLeft color='#fff' size='1.5rem' />
				</div>
				<div>
					<div className='profile-photo'>
						<EditButton section='pic' className='btn-edit' clase='pic' />
						{patient.profile_pic ? <img src={patient.profile_pic} alt='Perfil' /> : <FaUser size='3.5rem' color='#fff' />}
					</div>
				</div>
				<div>
					<div className='profile-info text-center'>
						<EditButton section='personal' className='btn-edit' clase='personal' />
						<p className='fullName'>{patient.fullname}</p>
						<p>{patient.dni}</p>
						<p>{patient.corporate}</p>
						<p>{moment(patient.dob).format('DD-MM-YYYY')}</p>
					</div>
				</div>
				<div>
					<div className='profile-section section'>
						<EditButton section='contact' className='btn-edit' clase='contact' />
						<p className='profile-section-title'>Datos de contacto</p>
						<p><b>Teléfono: </b> {patient.ws} </p>
						<p><b>Dirección: </b> {patient.address} </p>
						<p> <b>Piso/Dpto: </b> {patient.piso} </p>
						{/* <p><b>Suscripción: </b> {patient.subscription} </p> */}
					</div>
				</div>
				<div className='profile-section section'>
					<EditButton section='health' className='btn-edit' clase='health' />
					<p className='profile-section-title'>Salud</p>
					<p>
						<b>Sexo:</b> {(patient.sex === 'M' && 'Hombre') || (patient.sex === 'F' && 'Mujer')}
					</p>
				</div>
				<button 
					onClick={async () => {
						await SignOut();
						dispatch({ type: 'RESET_USER_DATA' });
						history.replace('/');
					}} 
					className="btn-blue-lg"
				>Cerrar sesión</button>
				<div className='umaVersion text-center'>
					<Version />
				</div>
			</div>
		</>
	);
};

export default ProfileComponent;
