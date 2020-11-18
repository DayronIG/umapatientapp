import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DeliveryProgressBarVertical from './DeliveryProgressBarVertical';
import DeliveryProgressBarHorizontal from './DeliveryProgressBarHorizontal';
import { useHistory, useParams } from 'react-router-dom';
import {user_feedback, config} from '../../config/endpoints';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import MobileModal from '../GeneralComponents/Modal/MobileModal';
import surveyModalImg from '../../assets/img/surveyModal.svg';
import StarRatings from 'react-star-ratings';
import axios from 'axios';
import { FaBriefcaseMedical, FaAmbulance, FaFileAlt, FaUserNurse } from 'react-icons/fa';
import { BsFillHouseDoorFill } from 'react-icons/bs';
import { MdChatBubble } from 'react-icons/md'

function DeliveryResume({ duration, active }) {
	const history = useHistory();
	const { ws, dni,  } = useSelector(store => store.queries.patient)
	const {currentHisopadoIndex} = useSelector(state => state.deliveryService)
	const { status, delivery, docId } = useSelector(state => state.deliveryService.deliveryInfo[currentHisopadoIndex]);
	const { notes, nurse_eval, uma_eval } = useSelector(state => state.deliveryService.deliveryInfo[currentHisopadoIndex].eval);
	const [toggle, setToggle] = useState(true);
	const [toggleIndications, setToggleIndications] = useState(false);
	const [toggleStepper, setToggleStepper] = useState(false);
	const [surveyModal, setSurveyModal] = useState(false);
	const [surveyResponse, setSurveyResponse] = useState({
		personal: 0,
		app: 0,
		comment: ''
	})
	const [error, setError] = useState(false);
	const [steps, setSteps] = useState([
		{
			title: 'En preparación',
			msg: "El personal de salud está preparando su equipo",
			icon: <FaBriefcaseMedical />,
			active: 0
		},
		{
			title: 'En camino',
			msg: "Tu profesional está en camino",
			icon: <FaAmbulance />,
			active: 0
		},
		{
			title: 'En domicilio',
			msg: "Tu profesional ha llegado al domicilio",
			icon: <BsFillHouseDoorFill />,
			active: 0
		},
		{
			title: 'Resultado',
			msg: "Ya está tu resultado",
			icon: <FaFileAlt />,
			active: 0
		}
	])
	const { fullname_nurse, cuit_nurse } = useSelector(state => state.deliveryService?.deliveryInfo[currentHisopadoIndex]?.delivery);

	useEffect(() => {
		if(!toggle) {
			setToggleIndications(false);
		}
	}, [toggle]);

	if(status === 'DONE:RESULT' && nurse_eval && uma_eval){
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
		if(surveyResponse.personal && surveyResponse.app){
			let data =
				{
					"key": "delivery",
					"data": {
					  "review": {
						"ws": ws,
						"dni": dni,
						"cuit": delivery.cuit_nurse,
						"uma_eval": surveyResponse.app,
						"doc_eval": surveyResponse.personal,
						"notes": surveyResponse.comment
					  },
					  "incidente_id": docId
					}
				  }
			axios.post(user_feedback, data, config)
			.then(() => history.push(`/hisopadoResult/${ws}`))
			.catch((e) => console.log(e));
		} else {
			setError(true);
		}
	}

	const handleEnter = (e) => {
			if(e.keyCode === 13){
			  e.target.blur(); 
			}
	}

	useEffect(() => {
		switch(active) {
			case 0: { 
				let newArr = [...steps];
				newArr[0].active = 1;

				setSteps(newArr);
			}
			break;
			case 1: { 
				let newArr = [...steps];
				newArr[0].active = 1;
				newArr[1].active = 1;

				setSteps(newArr);
			}
			break;
			case 2: { 
				let newArr = [...steps];
				newArr[0].active = 1;
				newArr[1].active = 1;
				newArr[2].active = 1;

				setSteps(newArr);
			}
			break;
			case 3: { 
				let newArr = [...steps];
				newArr[0].active = 1;
				newArr[1].active = 1;
				newArr[2].active = 1;
				newArr[3].active = 1;

				setSteps(newArr);
			}
			break;
		}
	}, [active])
	const openChat = () => {
		history.push(`/hisopado/deliveryChat/${ws}/${docId}`);
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

				<div 
					className={`steppersContainer ${toggleStepper ? 'openStepper' : 'closeStepper'}`} 
					onClick={() => setToggleStepper(!toggleStepper)}
				>
					<DeliveryProgressBarHorizontal steps={steps} />

					{
						active === 3 &&
						<button className="stepper__btn" onClick={() => setSurveyModal(true)}>
							Ir a resultado
						</button>
					}

					{
						active !== 3 &&
						<>
							<DeliveryProgressBarVertical percent={active} />

							<button className="steppersContainerCollapse">
								{
									!toggleStepper ?
									<>
										Ver más <FontAwesomeIcon icon={faChevronDown} />
									</> :
									<>
										Ver menos <FontAwesomeIcon icon={faChevronUp} /> 
									</>
								}
							</button>
						</>
					}
				</div>

				<div className="nursedata__container">
					<div className="nursedata__picname">
						<span className="nurse__icon">
							<FaUserNurse />
						</span>
						<div className="data__container">
							<p className="profesional">{fullname_nurse ? fullname_nurse: "Profesional"}</p>
							<p className="cuit">CUIT {cuit_nurse? cuit_nurse: "-"}</p>
						</div>
					</div>
					<div className="icons__container">
						<p className="chat__icon" onClick={()=>openChat()}>
							<MdChatBubble />
						</p>
					</div>
				</div>

				<article className="tracking__indications">
					<button className="tracking__indicationsToggle" onClick={() => setToggleIndications(!toggleIndications)}>
						Indicaciones para esperar
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
						<li className="tracking__indicationsListItem">Mantén el ambiente ventilado.</li>
					</ul>
				</article>
			</div>

			{/* {
				active !== 3 &&
				<button className="stepper__toggle" onClick={() => setToggle(!toggle)}>
					{
						toggle ? 
						<FontAwesomeIcon icon={faChevronUp} /> :
						<FontAwesomeIcon icon={faChevronDown} />
					}
				</button>
			} */}
		</section>
		{
			surveyModal &&
			<MobileModal hideTitle hideCloseButton surveyHisopados>
				<h2 className="surveyQuestion__title">Completa la encuesta y descarga tu constancia</h2>
				<div className="surveyQuestion">
					<h3>¿Cómo evaluaría la atención de nuestro personal de salud?</h3>
					<div className="surveyStars">
						<StarRatings
							rating={surveyResponse.personal}
							starRatedColor="#0a6dd6"
							starHoverColor="#0a6dd6"
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
							starRatedColor="#0a6dd6"
							starHoverColor="#0a6dd6"
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
						<textarea name="comment" onChange={handleChangeComment} onKeyDown={(e) => handleEnter(e)} cols="30" rows="10" placeholder="Escribe tus comentarios aquí"></textarea>
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
