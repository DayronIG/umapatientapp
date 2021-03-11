/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import queryString from 'query-string'
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { GenericHeader } from '../../GeneralComponents/Headers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft, faUserMd } from '@fortawesome/free-solid-svg-icons';
import { CustomUmaLoader } from '../../global/Spinner/Loaders';
import { getFreeAppointmentsCustom } from '../../../store/actions/getAssignations';
import { getDoctor } from '../../../store/actions/firebaseQueries';
import { regexNumbers, regexWord } from '../../Utils/regex';
import { modifyAppointsForCalendar } from '../../Utils/appointmentsUtils';
import { spacesToUnderscore } from '../../Utils/stringUtils';
import FooterBtn from '../../GeneralComponents/FooterBtn';
import moment from 'moment-timezone';
import { getDocumentFB } from '../../Utils/firebaseUtils';
import ListTurns from './ListTurns';
import swal from 'sweetalert';
import './styles.scss';

const MyCalendar = () => {
	const patient = useSelector((state) => state.user);
	const { dni } = useSelector(state => state.user)
	const [appointmentsOnline, setAppointmentsOnline] = useState([]);
	const [date, setDate] = useState(moment()
			.tz('America/Argentina/Buenos_Aires')
			.format());
	const [loading, setLoading] = useState(true);
	const [filterDt, setFilterDt] = useState('');
	const [calendarAppoints, setCalendarAppoints] = useState([]);
	const localizer = momentLocalizer(moment);
	const dt_calendar = date;
	const yearMonth = moment(date).format('YYYYMM');
	const { condition, uidToDerivate } = useParams();
	const history = useHistory();
	const location = useLocation()
	const params = queryString.parse(location.search)

	moment.locale('es');


	useEffect(() => {
		(async function getAppointments() {
			window.scroll(0, 0);
			if (patient.dni) {
				setLoading(true);
				await findFreeAppointments();
				setLoading(false);
			}
			return () => window.scroll(0, 0);
		})();
	}, [date, patient]);

	const findFreeAppointments = async () => {
		if (!(patient && Object.keys(patient).length > 0)) return;
		setTimeout(() => setLoading(false), 10000);
		await getDocumentFB('/parametros/userapp/variables/specialist');
		try {
			let specialty = '', queryCondition = '';
			if (condition.match(regexWord)) {
				specialty = spacesToUnderscore(condition);
			} else if (condition) {
				specialty = await getDoctor(condition).then((r) => {
					return r.matricula_especialidad
				});
			}
			if (condition?.match?.(regexNumbers)) {
				queryCondition = condition;
			} else {
				queryCondition = await getCorporates()
			}
			let appoints = await getFreeAppointmentsCustom(yearMonth, `online_${specialty}`, queryCondition);
			if (appoints.length === 0) {
				const nextMonth = moment(yearMonth)
					.add(1, 'months')
					.format('YYYYMM');
				appoints = await getFreeAppointmentsCustom(nextMonth, `online_${specialty}`, queryCondition);
			}
			let firstTurn = parseInt(appoints?.[0]?.date.slice(5, 7));
			let currentMounth = parseInt(date.slice(5, 7));
			let mounthOverflow = false;
			if (appoints?.length > 0 && firstTurn === currentMounth + 1) {
				setDate(
					moment(date)
						.add(1, 'M')
						.format()
				);
				mounthOverflow = true;
			}
			if (appoints?.length > 0 && firstTurn === currentMounth && !mounthOverflow) {
				setCalendarAppoints(modifyAppointsForCalendar(appoints));
				setAppointmentsOnline(appoints);
				mounthOverflow = false;
				setLoading(false);
			} else if (!mounthOverflow) {
				setCalendarAppoints([]);
				setAppointmentsOnline([]);
				setLoading(false);
				return swal(
					'Aviso',
					'En este momento no hay médicos disponibles para esta especialidad.',
					'warning'
				);
			}
		} catch (error) {
			console.log(error);
		}
	};

	function getCorporates() {
		let corporates = []
		corporates.push(patient.corporate_norm.toUpperCase())
		patient.coverage.forEach(element => {
			corporates.push(element.plan.toUpperCase())
		})
		return corporates
	}

	const newToolbar = () => {
		return (
			<div className='rbc-toolbar'>
				<span className='rbc-btn-group'>
					<div
						className='rbc-toolbar-icons'
						type='button'
						onClick={() =>
							setDate(
								moment(date)
									.subtract(1, 'M')
									.format()
							)
						}>
						<FontAwesomeIcon icon={faChevronLeft} />
					</div>
					<span className='rbc-toolbar-label'>{moment(date).format('MMMM')}</span>
					<div
						className='rbc-toolbar-icons'
						type='button'
						onClick={() =>
							setDate(
								moment(date)
									.add(1, 'M')
									.format()
							)
						}>
						<FontAwesomeIcon icon={faChevronRight} />
					</div>
				</span>
			</div>
		);
	};

	const customDaysPropGetter = (d) => {
		let filtered = calendarAppoints.filter((e) => moment(e.start).date() === moment(d).date());
		if (filtered.length !== 0) {
			return { className: 'events-day' };
		}
	};

	return (
		<>
			<GenericHeader children='Fecha de atención' />
			{!!loading && <CustomUmaLoader />}
			{filterDt === '' ? (
				<>
					<div className='calendar_container'>
						<Calendar
							localizer={localizer}
							onNavigate={(dateNav, view) => {
								// you wont understand this, even if you wanted to. don't change it.
								const year = moment(date).format('YYYY');
								const month = moment(date)
									// .subtract(1, 'months')
									.format('MM');
								const day = moment(dateNav).format('DD');
								setFilterDt(`${year}-${month}-${day}`);
								
							}}
							events={calendarAppoints}
							defaultView='month'
							style={{ height: '80vh' }}
							components={{ toolbar: newToolbar }}
							dayPropGetter={customDaysPropGetter}
							date={new Date(dt_calendar)}
							startAccessor='start'
							endAccessor='end'
						/>
					</div>
					<div className='calendar__legend'>
						<FontAwesomeIcon icon={faUserMd} /> Turnos disponibles este día
					</div>
					<FooterBtn text='Volver' callback={() => history.replace(`/appointmentsonline/specialty/${uidToDerivate}?dependant=${params.dependant}`)} />
				</>
			) : (
					<ListTurns appoints={appointmentsOnline} filterDt={filterDt} unsetDate={() => setFilterDt('')} />
				)}
		</>
	);
};

export default MyCalendar;
