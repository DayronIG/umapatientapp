import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import DBConnection from '../../config/DBConnection';
import MobileModal from '../GeneralComponents/Modal/MobileModal';
import { PersonalData, ContactData, HealtData, ProfilePic } from './ProfileForms';
import Version from '../GeneralComponents/Version';
import { FaArrowLeft, FaUser } from 'react-icons/fa';
import { MdModeEdit } from 'react-icons/md';
import moment from 'moment-timezone';
import '../../styles/profile.scss';
import Loading from '../GeneralComponents/Loading';
import {Loader} from '../GeneralComponents/Loading';

const ProfileComponent = () => {
	const dispatch = useDispatch();
	const db = DBConnection.firestore();
	const auth = useSelector((state) => state.queries.patient);
	const modal = useSelector((state) => state.front.openDetails);
	const { section } = useSelector((state) => state.front);
	const [editionMode, ] = useState(true);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (auth.dni) {
			setLoading(false);
		}
	}, [auth.dni]);

	useEffect(() => {
		let unsubscribe;
		if (auth.dni) {
			unsubscribe = db
				.collection('users')
				.doc(auth.dni)
				.onSnapshot((user) => {
					dispatch({type: 'GET_PATIENT', payload: user.data()});
					setLoading(false);
				});
		}
		return () => unsubscribe;
	}, [db, auth.dni]);


	const EditButton = ({ section, clase }) => {
		return (
			<>
				{editionMode && (
					<MdModeEdit
						className={`btn-edit ${clase}`}
						onClick={() => {
							dispatch({ type: 'EDIT_SECTION', payload: section });
							dispatch({ type: 'TOGGLE_DETAIL' });
						}}
					/>
				)}
			</>
		);
	};

	const EditSection = () => {
		if (section === 'personal') {
			return <PersonalData user={auth} />;
		} else if (section === 'contact') {
			return <ContactData user={auth} />;
		} else if (section === 'health') {
			return <HealtData user={auth} />;
		} else if (section === 'pic') {
			return <ProfilePic user={auth} />;
		} else {
			return 'Esta sección aún no se encuentra disponible';
		}
	};

	return (
		<>
			{loading && !auth.fullname && <Loading />}
			{modal && (
				<MobileModal title='Editar datos'
				callback={()=>{dispatch({type:"TOGGLE_DETAIL", payload:false})}}>
					<EditSection />
				</MobileModal>
			)}
			<div className='profile-container'>
				<div className='profile-top-icons'>
					<Link to='/'>
						<FaArrowLeft color='#fff' size='1.5rem' />
					</Link>
				</div>
				<div>
					<div className='profile-photo'>
						<EditButton section='pic' className='btn-edit' clase='pic' />
						{auth.profile_pic ? <img src={auth.profile_pic} alt='Perfil' /> : <FaUser size='3.5rem' color='#fff' />}
					</div>
				</div>
				<div>
					<div className='profile-info text-center'>
						<EditButton section='personal' className='btn-edit' clase='personal' />
						<p className='fullName'>{auth.fullname}</p>
						<p>{auth.dni}</p>
						<p>{auth.corporate}</p>
						<p>{moment(auth.dob).format('DD-MM-YYYY')}</p>
					</div>
				</div>
				<div>
					<div className='profile-section section'>
						<EditButton section='contact' className='btn-edit' clase='contact' />
						<p className='profile-section-title'>Datos de contacto</p>
						<p><b>Teléfono: </b> {auth.ws} </p>
						<p><b>Dirección: </b> {auth.address} </p>
						{auth.piso && <p> <b>Piso/Dpto: </b> {auth.piso} </p>}
						<p><b>Suscripción: </b> {auth.subscription} </p>
					</div>
				</div>
				<div className='profile-section section'>
					<EditButton section='health' className='btn-edit' clase='health' />
					<p className='profile-section-title'>Salud</p>
					<p>
						<b>Sexo:</b> {(auth.sex === 'M' && 'Hombre') || (auth.sex === 'F' && 'Mujer')}
					</p>
				</div>
				<div className='umaVersion text-center'>
					<Version />
				</div>
			</div>
		</>
	);
};

export default withRouter(ProfileComponent);
