import React, { useState, useEffect } from 'react';
import TrackingStepper from './Stepper';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import MobileModal from '../GeneralComponents/Modal/MobileModal';
import surveyModal from '../../assets/img/surveyModal.svg';

function DeliveryResume({ duration }) {
	const [toggle, setToggle] = useState(true);
	const [toggleIndications, setToggleIndications] = useState(false);
	const [surveyModal, setSurveyModal] = useState(false);
	const [surveyResponse, setSurveyResponse] = useState({
		personal: '',
		app: '',
		comment: ''
	})

	useEffect(() => {
		if(!toggle) {
			setToggleIndications(false);
		}
	}, [toggle]);

	const activeStep = 3;

	return (
		<>
		<section className={`
			stepper__containerMap 
			${toggle ? 'fullOpen' : ''} 
			${toggleIndications ? 'showIndications' : ''}
			${!toggle && toggleIndications ? 'mediumOpen' : ''}
			${activeStep === 3 ? 'showBtn' : ''} 
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
				{
					activeStep === 3 &&
					<button className="stepper__btn" onClick={() => setSurveyModal(true)}>
						Continuar
					</button>
				}
			</div>

			{
				activeStep !== 3 &&
				<button className="stepper__toggle" onClick={() => setToggle(!toggle)}>
					{
						toggle ? 
						<FontAwesomeIcon icon={faChevronUp} /> :
						<FontAwesomeIcon icon={faChevronDown} />
					}
				</button>
			}
		</section>
		{
			surveyModal &&
			<MobileModal hideTitle hideCloseButton surveyHisopados>
				<img src="surveyModal" alt="Encuesta" />

			</MobileModal>
		}
		</>
	);
}

export default DeliveryResume;
