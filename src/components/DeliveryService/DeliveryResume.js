import React, { useState, useEffect } from 'react';
import TrackingStepper from './Stepper';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";

function DeliveryResume({ duration }) {
	const [toggle, setToggle] = useState(true);
	const [toggleIndications, setToggleIndications] = useState(false);

	useEffect(() => {
		if(!toggle) {
			setToggleIndications(false);
		}
	}, [toggle]);

	const activeStep = 2;
	return (
		<section className={`
			stepper__containerMap 
			${toggle ? 'fullOpen' : ''} 
			${toggleIndications ? 'showIndications' : ''}
			${!toggle && toggleIndications ? 'mediumOpen' : ''} 
		`}>
			<div className="stepper__containerContent">
				<h2 className="tracking__stepperTitle">Detalle del pedido</h2>

				<article className="tracking__indications">
					<button className="tracking__indicationsToggle" onClick={() => setToggleIndications(!toggleIndications)}>
						Ver indicaciones
					{
						toggleIndications ? 
						<FontAwesomeIcon icon={faChevronUp} /> :
						<FontAwesomeIcon icon={faChevronDown} />
					}
					</button>

					<ul className="tracking__indicationsList">
						<li className="tracking__indicationsListItem">No te automediques. </li>
						<li className="tracking__indicationsListItem">Recuerda colocarte el barbijo para recibir al enfermero. </li>
						<li className="tracking__indicationsListItem">Lávate las manos y evita el contacto con la cara.</li>
					</ul>
				</article>

				<TrackingStepper active={activeStep} />
			</div>

			<button className="stepper__toggle" onClick={() => setToggle(!toggle)}>
				{
					toggle ? 
					<FontAwesomeIcon icon={faChevronUp} /> :
					<FontAwesomeIcon icon={faChevronDown} />
				}
			</button>
		</section>
	);
}

export default DeliveryResume;
