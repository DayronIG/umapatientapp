/* eslint-disable array-callback-return */
import convertTimeToMins from './convertTimeToMins';
import { calcReaminingHrsMins } from './dateUtils';
import { yearAndMonth } from './dateUtils';
import { searchActiveProviders, getFreeGuardia } from '../../store/actions/firebaseQueries';
import moment from 'moment-timezone';
import { getAssignedAppointments, getFreeAppointments } from '../../store/actions/getAssignations';
import 'moment/locale/es';

const fromTime = moment(new Date())
	.tz('America/Argentina/Buenos_Aires')
	.format('HH:mm');
const toTime = moment(new Date())
	.add(5, 'hours')
	.tz('America/Argentina/Buenos_Aires')
	.format('HH:mm');
const dayName = moment()
	.tz('America/Argentina/Buenos_Aires')
	.format('ddd');
const currentDt = moment()
	.tz('America/Argentina/Buenos_Aires')
	.format('YYYY-MM-DD');
const dtNextDay = moment()
	.tz('America/Argentina/Buenos_Aires')
	.add(1, 'days')
	.format('YYYY-MM-DD');
const yearMonth = yearAndMonth();

export function getLatestAppointments(assignations) {
	try {
		let latestAppointments = [];
		for (let i = 0; i < assignations.length; i++) {
			if (latestAppointments.length < 10) {
				const assignation = assignations[i];
				const assignTime = convertTimeToMins(assignation.time);
				const from = convertTimeToMins(fromTime);
				const to = convertTimeToMins(toTime);
				if (assignTime >= from && assignTime <= to) {
					latestAppointments.push(assignation);
				}
			} else {
				break;
			}
		}
		latestAppointments = latestAppointments.map(function(appoint) {
			let first = appoint.date + 'T' + appoint.time;
			return (appoint = { ...appoint, time2: new Date(first) });
		});
		return latestAppointments;
	} catch (error) {
		console.error(error);
	}
}

export async function filterByDoctors(assignations) {
	const doctorCuils = [],
		filteredAssignations = [];
	for (let i = 0; i < assignations.length; i++) {
		const assignation = assignations[i];
		if (!doctorCuils.includes(assignation.cuil)) {
			doctorCuils.push(assignation.cuil);
			filteredAssignations.push(assignation);
		} else {
			continue;
		}
	}
	return filteredAssignations;
}

export async function setRemainingTimes(assignations) {
	try {
		let now = moment(new Date())
			.tz('America/Argentina/Buenos_Aires')
			.format('HH:mm');
		const today = moment(new Date())
			.tz('America/Argentina/Buenos_Aires')
			.format('YYYY-MM-DD');
		now = convertTimeToMins(now);
		const assignsWithRemaining = assignations.map(function(assignation) {
			if (assignation.time) {
				let assignTime = convertTimeToMins(assignation.time);
				const remainingTime = assignTime - now;
				if (remainingTime > 0 && assignation.date === today) {
					if (remainingTime < 60) {
						return { ...assignation, remaining: `${remainingTime} min.` };
					} else {
						let remainingHours = parseInt(remainingTime / 60);
						if (remainingHours !== 1) {
							return { ...assignation, remaining: `${parseFloat(remainingHours.toFixed(2))} hs.` };
						} else {
							return { ...assignation, remaining: `aproximadamente una hora` };
						}
					}
				} else {
					let txt = '';
					const hoursToMidNight = 1440 - now;
					const fromMidNightToAtt = assignTime;
					const totalTimeToNext = hoursToMidNight + fromMidNightToAtt;
					const hoursToNext = totalTimeToNext / 60;
					const calcTime = calcReaminingHrsMins(totalTimeToNext);
					if (assignation.date !== today && hoursToNext < 22) {
						if (calcTime.remainingHours === 0) {
							txt = `en ${calcTime.reaminingMinutes} minutos`;
						} else {
							txt = `en aprox. ${calcTime.remainingHours} horas`;
						}
					} else {
						txt = '1 día.';
					}
					return { ...assignation, remaining: txt };
				}
			}
		});
		return assignsWithRemaining;
	} catch (error) {
		console.error(error);
	}
}

export function shuffleArr(array) {
	const helper = [...array];
	for (var i = helper.length - 1; i > 0; --i) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = helper[i];
		helper[i] = helper[j];
		helper[j] = temp;
	}
	return helper;
}

export async function shuffleAppoints(assignations) {
	const assignsHelper = [...assignations];
	const assignsLength = assignsHelper.length;
	let firstAssignations = [];
	if (assignsLength >= 8) {
		firstAssignations = assignsHelper.slice(0, 8);
	} else {
		firstAssignations = assignsHelper.slice(0, assignsLength);
	}
	const firstAppointsShuffled = shuffleArr(firstAssignations);
	assignsHelper.splice(0, firstAppointsShuffled.length, ...firstAppointsShuffled);
	return assignsHelper;
}

export function searchDisabledDoctors(availableDocs, appoints) {
	let dayNumber = 0;
	const appointsCuils = appoints.map(function(app) {
		return app.cuil;
	});
	if (dayName === 'Mon') dayNumber = 0;
	else if (dayName === 'Tue') dayNumber = 1;
	else if (dayName === 'Wed') dayNumber = 2;
	else if (dayName === 'Thu') dayNumber = 3;
	else if (dayName === 'Fri') dayNumber = 4;
	else if (dayName === 'Sat') dayNumber = 5;
	else if (dayName === 'Sun') dayNumber = 6;
	const docsArr = availableDocs.filter((doc) => {
		if (
			doc &&
			doc.sheet_online &&
			doc.sheet_online[dayNumber][0] &&
			doc.enable === 'si' &&
			doc.sheet_online[dayNumber][0].length >= 5
		) {
			return doc.cuit;
		}
	});
	const disabledDocs = docsArr.filter((doc) => {
		if (!appointsCuils.includes(doc.cuit)) {
			return doc;
		}
	});
	return disabledDocs;
}

export function modifyAppointsForCalendar(appointments) {
	return appointments.map((app, index) => {
		const year = parseInt(app.date.split('-')[0]);
		const month = parseInt(app.date.split('-')[1]);
		const day = parseInt(app.date.split('-')[2]);
		const hours = parseInt(app.time.split(':')[0]);
		const minutes = parseInt(app.time.split(':')[1]);

		return {
			id: index,
			title: app.fullname,
			allDay: true,
			start: new Date(year, month, day, hours, minutes),
		};
	});
}

export const genAppointmentID = (selectedAppointment, yearAndMonth) => {
	let id = '';
	if (selectedAppointment) {
		const { cuil } = selectedAppointment;
		let appointment;
		try {
			appointment = selectedAppointment?.date?.replace(/-/g, '').concat(selectedAppointment.time.replace(/:/g, ''));
			if(!appointment) {
				id = ''
			} else {
				id = `online_clinica_medica/${yearAndMonth}/${appointment}_${cuil}`;
			}
		} catch (err) {
			console.error(err);
		}
	}
	return id;
};

export const findAllAssignedAppointment = async (dni, type = '') => {
	const doctors = await searchActiveProviders('online', type);
	const assignedBag = getAssignedAppointments('online_clinica_medica', 'bag', doctors, dni, currentDt);
	const assignedToday = getAssignedAppointments('online_clinica_medica', yearMonth, doctors, dni, currentDt);
	const assignedTomorrow = getAssignedAppointments('online_clinica_medica', yearMonth, doctors, dni, dtNextDay);
	const resolve = await Promise.all([assignedBag, assignedToday, assignedTomorrow]);
	const assigned = resolve.find((res) => !!res && res);
	return assigned;
};

export const getOnlineCustom =  async (type, social_work) => {
	let freeApps = await getFreeGuardia(); // WIP
	return freeApps;
}

export const findAllFreeAppointments = async (type, social_work) => {
	let doctors = await searchActiveProviders('online', type);
	let freeApps = await getFreeAppointments('online_clinica_medica', doctors, currentDt);
	if (!freeApps || freeApps.length === 0) {
		freeApps = await getFreeAppointments('online_clinica_medica', doctors, dtNextDay);
	}
	freeApps = await filterByDoctors(freeApps);
	freeApps = await setRemainingTimes(freeApps);
	// freeApps = await shuffleAppoints(freeApps);
	return freeApps;
};
