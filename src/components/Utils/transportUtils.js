export const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export function buildSheet(schedule) {
	if (Object.keys(schedule).length > 0) {
		return days.map(day => schedule[day] || '');
	} else {
		return [];
	}
}