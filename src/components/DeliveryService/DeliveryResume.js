import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import DeliveryProgressBar from './DeliveryProgressBar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import MobileModal from '../GeneralComponents/Modal/MobileModal';
import surveyModalImg from '../../assets/img/surveyModal.svg';
import StarRatings from 'react-star-ratings';

function DeliveryResume({ duration, active }) {
	const history = useHistory();
	const { ws } = useSelector(store => store.queries.patient)
	const { status } = useSelector(state => state.deliveryService.deliveryInfo[0]);
	const { notes, nurse_eval, uma_eval } = useSelector(state => state.deliveryService.deliveryInfo[0].eval);
	const [toggle, setToggle] = useState(true);
	const [toggleIndications, setToggleIndications] = useState(false);
	const [surveyModal, setSurveyModal] = useState(false);
	const [surveyResponse, setSurveyResponse] = useState({
		personal: 0,
		app: 0,
		comment: ''
	})
	const [error, setError] = useState(false);

	useEffect(() => {
		if(!toggle) {
			setToggleIndications(false);
		}
	}, [toggle]);

	if(status === 'DONE:RESULT' && notes && nurse_eval && uma_eval){
		history.push(`/hisopadoResult/${ws}`);
	} 

	const changePersonalRating = (newRating) => {
		setSurveyResponse({...surveyResponse, personal: newRating});
	}

	const changeAppRating = (newRating) => {
		setSurveyResponse({...surveyResponse, app: newRating});
	}

	const handleChangeComment = (e) => {
		setSurveyResponse({...surveyResponse, comment: e.target.value});
	}

	const sendRating = () => {	
		if(surveyResponse.personal && surveyResponse.app && surveyResponse.comment){
			console.log('send data');
			// TODO: pegarle al endpoint de feedback
			history.push(`/hisopadoResult/${ws}`);
		} else {
			setError(true);
		}
	}


	return (
		<>
		<section className={`
			stepper__containerMap 
			${toggle ? 'fullOpen' : ''} 
			${toggleIndications ? 'showIndications' : ''}
			${!toggle && toggleIndications ? 'mediumOpen' : ''}
			${active === 3 ? 'showBtn' : ''} 
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

				<DeliveryProgressBar percent={active} />
				{
					active === 3 &&
					<button className="stepper__btn" onClick={() => setSurveyModal(true)}>
						Continuar
					</button>
				}
			</div>

			{
				active !== 3 &&
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
				<img src={surveyModalImg} alt="Encuesta" />
				<div className="surveyQuestion">
					<h3>¿Cómo evaluaría la atención de nuestro personal de salud?</h3>
					<div className="surveyStars">
						<StarRatings
							rating={surveyResponse.personal}
							starRatedColor="#A13DDF"
							starHoverColor="#A13DDF"
							changeRating={changePersonalRating}
							numberOfStars={5}
							name='personal'
							starDimension="25px"
						/>
					</div>
				</div>
				<div className="surveyQuestion">
					<h3>¿Cómo evaluaría la aplicación?</h3>
					<div className="surveyStars">
						<StarRatings
							rating={surveyResponse.app}
							starRatedColor="#A13DDF"
							starHoverColor="#A13DDF"
							changeRating={changeAppRating}
							numberOfStars={5}
							name='app'
							starDimension="25px"
						/>
					</div>
				</div>
				<div className="surveyQuestion">
					<h3>¿Qué podríamos mejorar?</h3>
					<div className="surveyComment">
						<textarea name="comment" onChange={handleChangeComment} cols="30" rows="10" placeholder="Escribe tus comentarios aquí"></textarea>
					</div>
				</div>
				
				{error && <p className="stepper__error">Todos los campos son obligatorios</p>}
				
				<button className="stepper__btn" onClick={sendRating}>
					Enviar
				</button>
			</MobileModal>
		}
		</>
	);
}

export default DeliveryResume;
