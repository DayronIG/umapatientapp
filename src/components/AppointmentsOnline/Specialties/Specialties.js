import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {useHistory, useParams, useLocation} from 'react-router-dom';
import queryString from 'query-string'
import DB, {firebaseInitializeApp} from '../../../config/DBConnection';
import moment from 'moment';
import swal from 'sweetalert';
import { Loader } from '../../global/Spinner/Loaders';
import { getDependant } from '../../../store/actions/firebaseQueries';
const db = DB.firestore(firebaseInitializeApp);

const Specialties = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const { activeUid } = useParams();
	const user = useSelector((state) => state.user);
	const {currentUser} = useSelector(state => state.userActive)
	const [arraySpecialties, setArraySpecialties] = useState([]);
	const { loading } = useSelector((state) => state.front);
	const [agePediatry, setAgePediatry] = useState(false);
	const mesActual = moment().format('YYYYMM');
	const mesSiguiente = moment()
		.add(1, 'month')
		.format('YYYYMM');
	const location = useLocation()
	const params = queryString.parse(location.search)

	useEffect(() => {
		if(currentUser && activeUid && activeUid !== currentUser) {
			dispatch(getDependant(currentUser.uid, activeUid))
			const pediatric = moment().diff(user.dob, 'years') <= 16;
			setAgePediatry(pediatric);
		}
	}, []);

	useEffect(() => {
		if (user.corporate_norm) {
			searchActiveSpecialties()
		}
	}, [user]);

	async function searchActiveSpecialties() {
		dispatch({ type: 'LOADING', payload: true });
		await db.doc(`/parametros/specialties`).get().then(async res => {
			await Promise.all(res.data().specialties_list.map((specialty) => getSpecialties(specialty))).then((data) => {
				let ordenado = data.sort((a, b) => b.active - a.active);
				setArraySpecialties(ordenado);
			});
		})
		dispatch({ type: 'LOADING', payload: false });
	}

	function getCorporates() {
		let corporates = []
		corporates.push(user.corporate_norm.toUpperCase())
		user.coverage.forEach(element => {
			corporates.push(element.plan.toUpperCase())
		})
		return corporates
	}

	const getSpecialties = async ({ value, label }) => {
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
		return history.push(`/appointmentsonline/${value}/calendar/${activeUid}?dependant=${params.dependant}`);
	};


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
