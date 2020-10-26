import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GenericHeader } from '../../GeneralComponents/Headers';
import VideoInput from '../../Inputs/Video';
import CameraInput from '../../Inputs/Picture';
import AudioInput from '../../Inputs/Audio';
import Modal from '../../GeneralComponents/Modal/MobileModal';
import CovidModal from './CovidModal';
import HtaModal from './HtaModal';
import HabitatOrTerms from './HabitatOrTerms';
import Loading from '../../GeneralComponents/Loading';
import ContainerAssessmentAppointment from './ContainerAssessmentAppointment';
import BackButton from '../../GeneralComponents/Backbutton'
import '../../../styles/questions.scss';
import '../../../styles/onlinedoctor/QuestionsModal.scss';
import isIos from '../../Utils/isIos';

const covidActivators = [
	'Tos',
	'Fiebre',
	'Dolor de garganta',
	'Sospecha de covid',
	'Dolor de cabeza',
	'Vómitos',
	'Diarrea',
	'mialgias'
];
const htaActivators = ['Hipertensión', 'Dolor de pecho'];
const cameraActivators = [
	'Problemas en la piel',
	'salpullido',
	'sarpullido',
	'roncha',
	'ampolla',
	'lunar',
	'quemadura',
	'erupción',
	'irritación',
	'orzuelo',
	'picazón',
	'hinchazón',
	'manchas',
	'sarna',
	'verruga',
	'grano',
	'piel'
];
const audioRecorderActivators = [
	'arritmia',
	'dolor de pecho',
	'palpitaciones',
	'falta de aire'
];

const Questions = () => {
	const dispatch = useDispatch();
	const [i, seti] = useState(0);
	const [j, setj] = useState(0);
	const [modals, setModals] = useState({
		fever: false,
		questions: false,
		habitat: false,
		termsAndConditions: false,
		htaModal: false,
		cameraModal: false,
	});
	const [responses, setResponses] = useState()
	const [alerta, setAlerta] = useState('');
	const [ubicacion, setUbicacion] = useState('');
	const [responseIA, setResponseIA] = useState({ diagnostico: '', destino_final: '', epicrisis: '' });
	const [coordinates, setCoordinates] = useState({ lat: '', lng: '' });
	const { assessment } = useSelector((state) => state);
	const { questions } = useSelector((state) => state.queries);
	const { loading } = useSelector((state) => state.front);
	const posOptions = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };
	const propsContainerAssessmentAppointment = { seti, setj, i, j, responseIA, coordinates, alerta };

	useEffect(() => {
		questionsForEachSymptom();
		if(assessment.biomarkers?.[0]) {
			let respTemp = [assessment.answers];
			let ent = Object.entries(assessment.biomarkers[0])
			ent.forEach((el)=> {
				if(el[1] === "yes") {
					return respTemp.push(el[0])
				}
			})
			setResponses(JSON.stringify(respTemp))
		}
	}, [assessment.selectedSymptoms, assessment.biomarkers, questions]);


	// Effect that get the current question and their answers
	useEffect(() => {
		let getQuestion = assessment.selectedQuestions[i];
		let currentQuestion = {};
		if (getQuestion && getQuestion.length >= 1) {
			let id = getQuestion[j].id;
			let title = getQuestion[j].question;
			let answers = getQuestion[j].answers;
			let required = getQuestion[j].required;
			currentQuestion = { id, title, answers, required };
		}
		dispatch({ type: 'SET_CURRENT_QUESTION', payload: currentQuestion });
	}, [assessment.selectedQuestions, dispatch, i, j]);

	useEffect(() => {
		try {
			const isIos = () => {
				const userAgent = window.navigator.userAgent.toLowerCase();
				return /iphone|ipad|ipod/.test(userAgent);
			};
			if (!isIos) {
				navigator.permissions
					.query({ name: 'geolocation' })
					.then(function(result) {
						if (result.state === 'granted') {
							navigator.geolocation.getCurrentPosition(currentPos, watchError, posOptions);
						} else if (result.state === 'prompt') {
							navigator.geolocation.getCurrentPosition(currentPos, watchError, posOptions);
						}
						// result.state === 'denied'
					})
					.catch((err) => {
						setCoordinates({ lat: '', lng: '' });
					});
			} else {
				navigator.geolocation.getCurrentPosition(currentPos, watchError, posOptions);
			}
		} catch (err) {
			setCoordinates({ lat: '', lng: '' });
		}
	}, []);

	useEffect(() => {
		const covidActive = covidActivators.some((activator) => assessment.selectedSymptoms.includes(activator));
		const htaActive = htaActivators.some((activator) => assessment.selectedSymptoms.includes(activator));
		const cameraActive = cameraActivators.some(
			(activator) =>
				assessment.selectedSymptoms.includes(activator) || assessment.selectedOtherSymptoms.includes(activator)
		);
		const audioRecorderActive = audioRecorderActivators.some(
			(activator) =>
				assessment.selectedSymptoms.includes(activator) || assessment.selectedOtherSymptoms.includes(activator)
		);

		if (covidActive) {
			setModals({ ...modals, questions: true });
			setAlerta('COVID');
		}
		if (htaActive && !covidActive) {
			// setHtaModal(true);
			setModals({ ...modals, htaModal: true });
			setAlerta('HTA');
		}
		if (cameraActive) {
			setModals({ ...modals, cameraModal: true });
		}
		if (audioRecorderActive && !!window.chrome) {
			setModals({ ...modals, audioModal: true });
		}
	}, []);

	const watchError = () => console.log('Hubo un error al rastrear la posición');

	const currentPos = ({ coords }) =>
		setCoordinates({ lat: coords.latitude.toString() || '', lng: coords.longitude.toString() || '' });
	// Effect that get all selected questions for the patient's symptoms and save them to store
	const questionsForEachSymptom = () => {
		let selectedQuestions = [];
		assessment.selectedSymptoms.forEach((symptom) => {
			let filterQuestions = questions.find((t) => {
				if (t.symptom === symptom && t.questions.length > 0) return t;
			});
			if (!!filterQuestions) selectedQuestions.push(filterQuestions.questions);
		});
		dispatch({ type: 'SET_SELECTED_QUESTIONS', payload: selectedQuestions });
	};

	const habitatResponseCondition = (responses) => {
		console.log(ubicacion)
		if (ubicacion === 'provincia') {
			if (
				(responses.includes('contacto estrecho') && !responses.includes('personal esencial'))
				|| responses.includes('anosmia/disgeusia')
				|| responses.includes('convive con caso confirmado')
				|| (responses.includes('contacto estrecho') && covidActivators.some((activator) => responses.includes(activator.toLocaleLowerCase())))
				) {
				setResponseIA({
					...responseIA,
					destino_final: 'En domicilio con instrucciones',
					diagnostico: 'INESP   Confirmado COVID19 x epidemiol',
				});
				setModals({ ...modals, fever: false, habitat: false, termsAndConditions: true });
			} else if (responses.includes('posee habitacion individual') && responses.length === 1) {
				setResponseIA({ ...responseIA, destino_final: 'En domicilio con monitoreo' });
				setModals({ ...modals, fever: false, habitat: false, termsAndConditions: true });
			} else {
				setModals({ ...modals, fever: false, habitat: false });
			}
		} else if (ubicacion === 'capital') {
			if ((responses.includes('contacto estrecho') && !responses.includes('personal esencial'))
			|| (responses.includes('contacto estrecho') && covidActivators.some((activator) => responses.includes(activator.toLocaleLowerCase())
			|| responses.includes('anosmia/disgeusia')
			|| responses.includes('convive con caso confirmado')))) {
				setResponseIA({
					...responseIA,
					destino_final: 'En domicilio con instrucciones',
					diagnostico: 'INESP   Confirmado COVID19 x epidemiol',
				});
				setModals({ ...modals, fever: false, habitat: false, termsAndConditions: true });
			} else if (responses.includes('posee habitacion individual') && responses.length === 1) {
				setResponseIA({ ...responseIA, destino_final: 'En domicilio con monitoreo' });
				setModals({ ...modals, fever: false, habitat: false, termsAndConditions: true });
			} else if (
				responses.length > 0 &&
				!responses.includes('internacion reciente - no lleva control de sus antecedentes') &&
				!responses.includes('contacto estrecho')
			) {
				setResponseIA({ ...responseIA, destino_final: 'En domicilio con monitoreo' });
				setModals({ ...modals, fever: false, habitat: false, termsAndConditions: true });
			} else if (responses.length > 0) {
				setResponseIA({ ...responseIA, destino_final: 'Traslado protocolo pandemia' });
				setModals({ ...modals, fever: false, habitat: false });
			} else {
				setModals({ ...modals, fever: false, habitat: false });
			}
		} else {
			setModals({ ...modals, fever: false, habitat: false });
		}
	};

	const switchModalContent = ({ fever, questions, habitat, termsAndConditions, htaModal, cameraModal, audioModal }) => {
		if (questions) {
			return (
				<Modal title='COVID-19' hideCloseButton>
					<CovidModal
						setResponseIA={(res) => {
							setResponseIA(res);
							const covidActive = covidActivators.some((activator) =>
								assessment.selectedSymptoms.includes(activator)
							);
							if (
								covidActive &&
								res.diagnostico === 'INESP   Sospecha COVID19' &&
								res.destino_final !== 'Evaluación en rojo' &&
								res.destino_final !== 'Evaluación en amarillo'
							) {
								if (res.epicrisis.includes('fiebre')) {
									setModals({ ...modals, questions: false, fever: true });
								} else {
									setModals({ ...modals, questions: false, habitat: true });
								}
							} else {
								setModals({ ...modals, questions: false });
							}
						}}
					/>
				</Modal>
			);
		}

		if (fever && !isIos() && !!window.chrome) {
			return (
				<Modal title='Muestra médica' callback={() => setModals({ ...modals, habitat: true, fever: false })}>
					<VideoInput
						isModal={true}
						finalAction={() => setModals({ ...modals, habitat: true, fever: false })}
					/>
				</Modal>
			);
		}

		if (habitat || (fever && isIos())) {
			return (
				<Modal title='Preguntas de hábitat' hideCloseButton>
					<HabitatOrTerms
						formHandler={() => habitatResponseCondition(responses)}
						typeComponent='habitat'
						ubicacion={ubicacion}
						setUbicacion={setUbicacion}
						mode='button'
					/>
				</Modal>
			);
		}

		if (termsAndConditions) {
			return (
				<Modal title='Declaración jurada' hideCloseButton>
					<HabitatOrTerms
						formHandler={() => setModals({ ...modals, termsAndConditions: false })}
						typeComponent='terminos'
						ubicacion={ubicacion}
						activateDefault={true}
					/>
				</Modal>
			);
		}

		if (htaModal) {
			return (
				<Modal title='Hipertensión' hideCloseButton>
					<HtaModal
						unsetModal={() => setModals({ ...modals, htaModal: false })}
						setResponseIA={setResponseIA}
					/>
				</Modal>
			);
		}

		if (cameraModal) {
			return (
				<Modal title='Fotos' callback={() => setModals({ ...modals, cameraModal: false })}>
					<CameraInput modal={true} finalAction={() => setModals({ ...modals, cameraModal: false })} />
				</Modal>
			);
		}

		if (audioModal) {
			return (
				<Modal title='Audio' callback={() => setModals({ ...modals, audioModal: false })}>
					<AudioInput modal={true} finalAction={() => setModals({ ...modals, audioModal: false })} />
				</Modal>
			);
		}
	};

	return (
		<>
			<GenericHeader children='Preguntas' />
			{loading && <Loading centered={true} />}
			<BackButton />
			<div className='text-center'>
				<div className='assessment-text mt-4 mb-4'>
					{assessment.currentQuestion && assessment.currentQuestion.title}
				</div>
				{switchModalContent(modals)}
				<ContainerAssessmentAppointment {...propsContainerAssessmentAppointment} />
			</div>
		</>
	);
};

export default Questions;
