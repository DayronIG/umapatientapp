import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import DB from '../../config/DBConnection';
import moment from 'moment';
import swal from 'sweetalert';
import { Loader } from '../global/Spinner/Loaders';
import { getUser } from '../../store/actions/firebaseQueries';
import { getDocumentFB } from '../Utils/firebaseUtils';

const db = DB.firestore();

const Specialties = (props) => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.queries.patient);
	const dni = props.match.params.dni;
	const [arraySpecialties, setArraySpecialties] = useState([]);
	const { loading } = useSelector((state) => state.front);
	const [agePediatry, setAgePediatry] = useState(false);
	const mesActual = moment().format('YYYYMM');
	const mesSiguiente = moment().add(1, 'month').format('YYYYMM');

	// const agePediatry = moment().diff(user.dob, 'years') <= 16;

	useEffect(() => {
		getUser(dni)
			.then((user) => {
				const pediatric = moment().diff(user.dob, 'years') <= 16;
				setAgePediatry(pediatric);
			})
			.catch((error) => console.log(error));
	}, []);

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
		console.log(sp)
		const speciality = sp
		if (speciality !== 'pediatria' && agePediatry) {
			swal('Aviso', 'Esta especialidad no es pediatrica', 'warning');
			return;
		}
		if (!active) {
			swal('Aviso', 'No hay turnos disponibles para esta especialidad', 'warning');
			return;
		}
		pushPage(speciality);
	};

	const pushPage = (specialty) => {
		if (
			(specialty === 'psicologia' && !user.chatbotOnboarding) ||
			(user.chatbotOnboarding && user.chatbotOnboarding[specialty] !== 'complete')
		) {
			return props.history.push(`/${dni}/chat/${specialty}`);
		} else if (
			(specialty === 'nutricionista' && !user.chatbotOnboarding) ||
			(user.chatbotOnboarding && user.chatbotOnboarding[specialty] !== 'complete')
		) {
			return props.history.push(`/${dni}/chat/${specialty}`);
		} else {
			return props.history.push(`/${dni}/appointmentsonline/${specialty}/calendar`);
		}
	};

	return (
		<>
			{!!loading && <Loader />}
			<ul className='listSpecialties__list'>
			{console.log(arraySpecialties)}

				{arraySpecialties.map(({ name, label, active }) => (
					<li
						key={name}
						className={`listSpecialties__list--item ${active && 'active'}`}
						onClick={() => handleClick(name, active)}>
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
