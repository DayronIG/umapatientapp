import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { Link, useParams, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { getMedicalRecord } from '../../store/actions/firebaseQueries';
import { GenericHeader, BackButton } from '../GeneralComponents/Headers';
import { FaUserMd } from 'react-icons/fa';
import Specialties from './Specialties/Specialties';
import '../../styles/appointmentsonline/listSpecialties.scss';

const ListSpecialties = (props) => {
	const location = useLocation()
	const dispatch = useDispatch()
	const params = queryString.parse(location.search)
	const {currentUser} = useSelector(state => state.userActive)
	const { activeUid } = useParams()
	
	useEffect(() => {
		if (currentUser?.uid) {
			dispatch(getMedicalRecord(currentUser.uid, activeUid))
		}
	}, [currentUser])


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
				<Link to={`/appointmentsonline/search-doctor/${activeUid}?dependant=${params.dependant}`}>BUSCAR POR MEDICO</Link>
				<FaUserMd />
			</div>
		</>
	);
};

export default ListSpecialties;
