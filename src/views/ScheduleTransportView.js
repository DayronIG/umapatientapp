import React from 'react';
import { GenericHeader } from '../components/GeneralComponents/Headers';
import ScheduleTransport from '../components/Transport/ScheduleTransport';

function ScheduleTransportView() {
	return (
		<section>
			<GenericHeader>Seleccionar horario</GenericHeader>
			<ScheduleTransport />
		</section>
	);
}

export default ScheduleTransportView;