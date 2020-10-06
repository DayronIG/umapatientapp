import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import DBConnection from '../../config/DBConnection';
import MobileModal from '../GeneralComponents/Modal/MobileModal';
import { PersonalData, ContactData, HealtData, ProfilePic } from './ProfileForms';
import Version from '../GeneralComponents/Version';
import { FaArrowLeft, FaUser, FaUserEdit, FaUserCheck } from 'react-icons/fa';
import { MdModeEdit } from 'react-icons/md';
import moment from 'moment';
import '../../styles/profile.scss';
import Loader from '../GeneralComponents/Loading';

const ProfileComponent = (props) => {
	const dispatch = useDispatch();
	const db = DBConnection.firestore();
	const user = useSelector((state) => state.queries.patient);
	const modal = useSelector((state) => state.front.openDetails);
	const { section } = useSelector((state) => state.front);
	const [editionMode, setEditionMode] = useState(false);
	const [usuario, setUsuario] = useState({});
	const [loading, setLoading] = useState(true);
	const { fullname, dni, corporate, dob, ws, address, suscription, sex, piso, profile_pic } = usuario;

	useEffect(() => {
		let unsubscribe;
		if (user.dni) {
			unsubscribe = db
				.collection('users')
				.doc(user.dni)
				.onSnapshot((user) => {
					setUsuario(user.data());
					setLoading(false);
				});
		}

		return () => unsubscribe;
	}, [db, user.dni]);

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
			return <PersonalData user={usuario} />;
		} else if (section === 'contact') {
			return <ContactData user={usuario} />;
		} else if (section === 'health') {
			return <HealtData user={usuario} />;
		} else if (section === 'pic') {
			return <ProfilePic user={usuario} />;
		} else {
			return 'Esta sección aún no se encuentra disponible';
		}
	};

	return (
		<>
			{loading && <Loader />}
			{modal && (
				<MobileModal title='Editar datos'>
					<EditSection />
				</MobileModal>
			)}
			<div className='profile-container'>
				<div className='profile-top-icons'>
					<Link to='/'>
						<FaArrowLeft color='#fff' size='1.5rem' />
					</Link>
					{editionMode ? (
						<div className='edit-icons' onClick={() => setEditionMode(false)}>
							<small>Listo</small>
							<FaUserCheck size='1.2rem' />
						</div>
					) : (
						<div className='edit-icons' onClick={() => setEditionMode(true)}>
							<small>Editar Datos</small>
							<FaUserEdit size='1.2rem' />
						</div>
					)}
				</div>
				<div>
					<div className='profile-photo'>
						<EditButton section='pic' className='btn-edit' clase='pic' />
						{profile_pic ? <img src={profile_pic} alt='Perfil' /> : <FaUser size='3.5rem' color='#fff' />}
					</div>
				</div>
				<div>
					<div className='profile-info text-center'>
						<EditButton section='personal' className='btn-edit' clase='personal' />
						<p className='fullName'>{fullname}</p>
						<p>{dni}</p>
						<p>{corporate}</p>
						<p>{moment(dob).format('DD-MM-YYYY')}</p>
					</div>
				</div>
				<div>
					<div className='profile-section section'>
						<EditButton section='contact' className='btn-edit' clase='contact' />
						<p className='profile-section-title'>Datos de contacto</p>
						<p>
							<b>Teléfono: </b>
							{ws}
						</p>
						<p>
							<b>Dirección: </b>
							{address}
						</p>
						{piso && (
							<p>
								<b>Piso/Dpto: </b>
								{piso}
							</p>
						)}
						<p>
							<b>Suscripción: </b>
							{suscription}
						</p>
						{/* <p>
              <b>Dirección: </b>
              {!street ? '-' : street}
            </p> */}
					</div>
				</div>
				<div className='profile-section section'>
					<EditButton section='health' className='btn-edit' clase='health' />
					<p className='profile-section-title'>Salud</p>
					<p>
						<b>Sexo:</b> {(sex === 'M' && 'Hombre') || (sex === 'F' && 'Mujer')}
					</p>
					{/* 
            <p><b>Peso:</b> 74 kg</p>
            <p><b>Altura:</b> 183 cms</p>
            <p><b>Crónicos: </b>Diabetes</p>
            <p><b>Antecedentes familiares: </b>Coronarios</p> 
          */}
				</div>
				<div className='umaVersion'>
					<Version />
				</div>
				{/* <div className="section">
          <EditButton section="personal" className="btn-edit" />
          <p className="profile-section-title">Datos de traslado</p>
          <p><b>Discapacidad:</b> Total (Visceral) </p>
          <p><b>Certificado:</b> 123456</p>
          <p><b>Silla de ruedas: </b>Si (Plegable)</p>
          <p><b>Amparo:</b> Si</p>
          <p><b>Acompañante:</b> Fernando</p>
        </div> */}
			</div>
		</>
	);
};

export default withRouter(ProfileComponent);
