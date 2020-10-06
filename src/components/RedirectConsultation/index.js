import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

function RedirectConsultation(props) {
	const [{ ws, incidentId, finalDestination }] = useState(props.match.params);

	useEffect(() => {
		props.history.replace('/feedback')
		/* switch (finalDestination) {
			case 'En domicilio con monitoreo':
				return props.history.replace(`/${ws}/deliveryService/selectDestiny/covidTest/${incidentId}`);
			default:
				return props.history.replace('/feedback');
		} */
	}, []);

	return <div />;
}

export default withRouter(RedirectConsultation);
