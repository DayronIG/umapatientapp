import React from 'react';
import { Link } from 'react-router-dom';
import { GenericHeader, BackButton } from '../GeneralComponents/Headers';
import { FaUserMd } from 'react-icons/fa';
import Specialties from './Specialties/Specialties';
import '../../styles/appointmentsonline/listSpecialties.scss';

const ListSpecialties = (props) => {
	const dni = props.match.params.dni;

	return (
		<>
			<GenericHeader>Especialidad</GenericHeader>
			<div className='listSpecialties'>
				<BackButton />
				<div className='listSpecialties__container'>
					<h6 className='listSpecialties__container--title'>Seleccionar especialidad</h6>
					<Specialties />
				</div>
			</div>
			<div className='searchByDoctor'>
				<Link to={`/appointmentsonline/search-doctor/${dni}`}>BUSCAR POR MEDICO</Link>
				<FaUserMd />
			</div>
		</>
	);
};

export default ListSpecialties;
