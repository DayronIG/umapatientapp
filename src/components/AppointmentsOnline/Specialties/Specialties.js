import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {useHistory, useParams} from 'react-router-dom';
// import specialties from '../../../config/specialties';
import DB from '../../../config/DBConnection';
import moment from 'moment';
import swal from 'sweetalert';
import { Loader } from '../../global/Spinner/Loaders';
import { getUser } from '../../../store/actions/firebaseQueries';
const db = DB.firestore();

const Specialties = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const { dni } = useParams();
	const user = useSelector((state) => state.user);
	const [arraySpecialties, setArraySpecialties] = useState([]);
	const { loading } = useSelector((state) => state.front);
	const [agePediatry, setAgePediatry] = useState(false);
	const mesActual = moment().format('YYYYMM');
	const mesSiguiente = moment()
		.add(1, 'month')
		.format('YYYYMM');
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
		if (user.corporate_norm) {
			db.doc(`/parametros/specialties`).get().then(res => {
				Promise.all(res.data().specialties_list.map((specialty) => getSpecialties(specialty))).then((data) => {
					let ordenado = data.sort((a, b) => b.active - a.active);
					setArraySpecialties(ordenado);
				});
			})
		}
	}, [user]);

	function getCorporates() {
		let corporates = []
		corporates.push(user.corporate_norm.toUpperCase())
		user.coverage.forEach(element => {
			corporates.push(element.plan.toUpperCase())
		})
		return corporates
	}

	const getSpecialties = async ({ value, label }) => {
		dispatch({ type: 'LOADING', payload: true });
		let currentMonth = [],
			nextMonth = [];
		let corporates = await getCorporates()
		currentMonth = await db
			.collection(`/assignations/online_${value}/${mesActual}`)
			.where('social_work', 'array-contains-any', corporates)
			.where('state', '==', 'FREE')
			.get();
		nextMonth = await db
			.collection(`/assignations/online_${value}/${mesSiguiente}`)
			.where('social_work', 'array-contains-any', corporates)
			.where('state', '==', 'FREE')
			.get();
		dispatch({ type: 'LOADING', payload: false });
		if (!currentMonth.empty | !nextMonth.empty) {
			const algo = currentMonth.docs;
			const algo2 = nextMonth.docs;
			const juntos = algo.concat(algo2);
			return retornaObjeto(juntos,`online_${label}`,  value);
		} else {
			return { value: `online_${label}`, label, active: false };
		}
	};

	const retornaObjeto = (arreglo, value, label) => {
		let objeto;
		arreglo.forEach((doc) => {
			let { date, time } = doc.data();
			if (
				date > moment().format('YYYY-MM-DD') ||
				(date === moment().format('YYYY-MM-DD')) & (time >= moment().format('HH:mm'))
			) {
				objeto = { value, label, active: true };
			} else {
				objeto = { value, label, active: false };
			}
		});
		dispatch({ type: 'LOADING', payload: false });
		return objeto;
	};

	const handleClick = (value, active) => {
		if (value !== 'pediatria' && agePediatry) {
			swal('Aviso', 'Esta especialidad no es pediatrica', 'warning');
			return;
		}
		if (!active) {
			swal('Aviso', 'No hay turnos disponibles para esta especialidad', 'warning');
			return;
		}
		return history.push(`/appointmentsonline/${value}/calendar/${dni}`);

		// pushPage(speciality);
	};

/* 	const pushPage = (specialty) => {
		if (
			(specialty === 'psicologia' && !user.chatbotOnboarding) ||
			(user.chatbotOnboarding && user.chatbotOnboarding[specialty] !== 'complete')
		) {
			return history.push(`/chat/${specialty}/${dni}`);
		} else if (
			(specialty === 'nutricionista' && !user.chatbotOnboarding) ||
			(user.chatbotOnboarding && user.chatbotOnboarding[specialty] !== 'complete')
		) {
			return history.push(`/chat/${specialty}/${dni}`);
		} else {
			return history.push(`/appointmentsonline/${specialty}/calendar/${dni}`);
		}
	}; */

	return (
		<>
			{!!loading && <div className="m-5"><Loader /></div>}
			<ul className='listSpecialties__list'>
				{arraySpecialties.map(({ value, label, active }) => (
					<li
						key={value}
						className={`listSpecialties__list--item ${active && 'active'}`}
						onClick={() => handleClick(label, active)}>
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

export default Specialties;
