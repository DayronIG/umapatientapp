import React from 'react';
import TrackingStepper from './Stepper';

function DeliveryResume({ duration }) {
	const activeStep = 1;
	return (
		<section className="stepper__containerMap">
			<h2 className="tracking__stepperTitle">Detalle del pedido</h2>
			<TrackingStepper active={activeStep} />
		</section>
	);
}

export default DeliveryResume;
