import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GenericHeader } from '../../GeneralComponents/Headers';
import Loading from '../../GeneralComponents/Loading';
import ContainerAssessmentAppointment from './ContainerAssessmentAppointment';
import BackButton from '../../GeneralComponents/Backbutton'
import '../../../styles/questions.scss';
import '../../../styles/onlinedoctor/QuestionsModal.scss';
import DB from '../../../config/DBConnection';

const db = DB.firestore();

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
	const [responseIA, setResponseIA] = useState({ diagnostico: '', destino_final: '', epicrisis: '' });
	const [coordinates, setCoordinates] = useState({ lat: '', lng: '' });
	const { assessment } = useSelector((state) => state);
	const { questions } = useSelector((state) => state.queries);
	const { loading } = useSelector((state) => state.front);
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
		let getQuestion = assessment.selectedQuestions;
		let currentQuestion = {};
		if (getQuestion && getQuestion.length >= 1) {
			let id = getQuestion[j].id;
			let title = getQuestion[j].question;
			let answers = getQuestion[j].answers;
			// let required = getQuestion[j].required;
			currentQuestion = { id, title, answers };
		}
		dispatch({ type: 'SET_CURRENT_QUESTION', payload: currentQuestion });
	}, [assessment.selectedQuestions, dispatch, i, j]);
	
	// Effect that get all selected questions for the patient's symptoms and save them to store
	const questionsForEachSymptom = () => {
		let selectedQuestions = [];
		const selectedSymptomsLowercase = assessment.selectedSymptoms.map(s => s.toLowerCase());
		db.collection('/parametros/userapp/assessment').where('triggers', 'array-contains-any', selectedSymptomsLowercase).get()
		.then(query => {
			query.forEach(doc => {
				const data = doc.data();
				selectedQuestions.push({
					id: doc.id,
					question: data.question,
					answers: data.answer
				});

				data.features.map(question => {
					db.collection('parametros').doc('userapp').collection('assessment').doc(question).get()
					.then(doc => {
						if(doc.exists) {
							const docData = doc.data();
							selectedQuestions.push({
								id: doc.id,
								question: docData.question,
								answers: docData.answer
							});
						}
					})
				})
			})

			dispatch({ type: 'SET_SELECTED_QUESTIONS', payload: selectedQuestions });
		})
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
				{Array.isArray(assessment.selectedQuestions) && assessment.selectedQuestions.length === 0 && <Loading centered={true} /> }
				<ContainerAssessmentAppointment {...propsContainerAssessmentAppointment} />
			</div>
		</>
	);
};

export default Questions;
