import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { Link, useParams, useLocation, useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { getMedicalRecord } from '../../store/actions/firebaseQueries';
import { GenericHeader, BackButton } from '../GeneralComponents/Headers';
import { FaUserMd } from 'react-icons/fa';
import Specialties from './Specialties/Specialties';
import '../../styles/appointmentsonline/listSpecialties.scss';

const ListSpecialties = (props) => {
	const location = useLocation();
	const dispatch = useDispatch();
	const history = useHistory();
	const params = queryString.parse(location.search)
	const {currentUser} = useSelector(state => state.userActive)
	const mrs = useSelector(state => state.queries.medicalRecord)
	const { activeUid } = useParams()
	
	useEffect(() => {
		if (currentUser?.uid) {
			let dependant = params.dependant === "false" ? false : params.dependant
			dispatch(getMedicalRecord(currentUser.uid, dependant))
		}
	}, [currentUser])

	useEffect(() => {
		mrs.forEach(function (mr) {
			if (mr.mr_preds) {
				let scheduledTurn = mr.mr_preds?.pre_clasif?.[0]
				if(mr.att_category && mr.att_category === "MI_ESPECIALISTA") {
					scheduledTurn = 'TurnoConsultorioOnline'
				}
				if (scheduledTurn === 'TurnoConsultorioOnline' && mr.mr.destino_final === "") {
					return history.push(`/appointmentsonline/pending/${activeUid}?dependant=${params.dependant}`);
				}
			}
		})
	}, [mrs])


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
