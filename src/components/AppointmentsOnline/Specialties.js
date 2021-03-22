import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter, useParams, useLocation } from 'react-router-dom';
import queryString from 'query-string'
import DB from '../../config/DBConnection';
import moment from 'moment-timezone';
import swal from 'sweetalert';
import { Loader } from '../global/Spinner/Loaders';
import { getDependant } from '../../store/actions/firebaseQueries';
import { getDocumentFB } from '../Utils/firebaseUtils';

const db = DB.firestore();

const Specialties = (props) => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);
	const currentUser = useSelector(state => state.userActive.currentUser)
	const [arraySpecialties, setArraySpecialties] = useState([]);
	const { loading } = useSelector(state => state.front);
	const [agePediatry, setAgePediatry] = useState(false);
	const mesActual = moment().format('YYYYMM');
	const mesSiguiente = moment().add(1, 'month').format('YYYYMM');
	const { activeUid } = useParams()
	const location = useLocation()
	const params = queryString.parse(location.search)

	useEffect(() => {
		if(activeUid && activeUid !== currentUser?.uid) {
			getDependant(currentUser, activeUid)
				.then((user) => {
					const pediatric = moment().diff(user.dob, 'years') <= 16;
					setAgePediatry(pediatric)
				})
				.catch((error) => console.log(error));
		}
	}, [currentUser, activeUid]);

	useEffect(() => {
		getSpecialtiesTurns();
	}, [user]);

	async function getSpecialtiesTurns() {
		if (user.corporate_norm) {
			dispatch({ type: 'LOADING', payload: true });
			const specialties = await getDocumentFB('/parametros/specialties');
			const data = await Promise.all(specialties.specialties_list.map(getSpecialtyTurns));
			const ordered = data.sort((a, b) => b.active - a.active);
			setArraySpecialties(ordered);
			dispatch({ type: 'LOADING', payload: false });
		}
	}

	async function getSpecialtyTurns({ label, value }) {
		let currentMonth = [], nextMonth = [];
		currentMonth = await db
			.collection(`/assignations/online_${value}/${mesActual}`)
			.where('social_work', 'array-contains', user.corporate_norm.toUpperCase())
			.where('state', '==', 'FREE')
			.get();
		nextMonth = await db
			.collection(`/assignations/online_${value}/${mesSiguiente}`)
			.where('social_work', 'array-contains', user.corporate_norm.toUpperCase())
			.where('state', '==', 'FREE')
			.get();
		if (!currentMonth.empty | !nextMonth.empty) {
			const algo = currentMonth.docs;
			const algo2 = nextMonth.docs;
			const juntos = algo.concat(algo2);
			return retornaObjeto(juntos, value, label);
		} else {
			return { name: value, label, active: false };
		}
	};

	const retornaObjeto = (arreglo, name, label) => {
		let objeto;
		arreglo.forEach((doc) => {
			let { date, time } = doc.data();
			if (
				date > moment().format('YYYY-MM-DD') ||
				(date === moment().format('YYYY-MM-DD')) & (time >= moment().format('HH:mm'))
			) {
				objeto = { name, label, active: true };
			} else {
				objeto = { name, label, active: false };
			}
		});
		dispatch({ type: 'LOADING', payload: false });
		return objeto;
	};

	const handleClick = (sp, active) => {
		const specialty = sp
		if (specialty !== 'pediatria' && agePediatry) {
			swal('Aviso', 'Esta especialidad no es pediatrica', 'warning');
			return;
		}
		if (!active) {
			swal('Aviso', 'No hay turnos disponibles para esta especialidad', 'warning');
			return;
		}
		props.history.push(`/appointmentsonline/${specialty}/calendar/${activeUid}?dependant=${params.dependant}`);
		// pushPage(speciality);
	};

	return (
		<>
			{!!loading && <Loader />}
			<ul className='listSpecialties__list'>
				{arraySpecialties.map(({ name, label, active }) => (
					<li
						key={name}
						className={`listSpecialties__list--item ${active && 'active'}`}
						onClick={() => handleClick(name, active)}
					>
						<span>{label}</span>
					</li>
				))}
				{arraySpecialties.length === 0 && !loading && (
					<div className='mt-5'>No se encontraron turnos disponibles en este momento</div>
				)}
			</ul>
		</>
	);
};

export default withRouter(Specialties);
