import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GenericHeader } from '../../GeneralComponents/Headers';
import Loading from '../../GeneralComponents/Loading';
import ContainerAssessmentAppointment from './ContainerAssessmentAppointment';
import BackButton from '../../GeneralComponents/Backbutton';
import ProgressBar from './ProgressBar';
import '../../../styles/questions.scss';
import '../../../styles/onlinedoctor/QuestionsModal.scss';
import DB from '../../../config/DBConnection';

const db = DB.firestore();

const Questions = () => {
	const dispatch = useDispatch();
	const [i, seti] = useState(0);
	const [j, setj] = useState(0);
	const [responses, setResponses] = useState()
	const [alerta, setAlerta] = useState('');
	const [counter, setCounter] = useState(0);
	const [responseIA, setResponseIA] = useState({ diagnostico: '', destino_final: '', epicrisis: '' });
	const [coordinates, setCoordinates] = useState({ lat: '', lng: '' });
	const { assessment } = useSelector((state) => state);
	const { questions, patient } = useSelector((state) => state.queries);
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

		if(getQuestion === null) {
			dispatch({ type: 'SET_CURRENT_QUESTION', payload: {title: "", answers: []} });
		}

		if (assessment.selectedSymptoms.length >= 1 && getQuestion && getQuestion[j] && getQuestion.length >= 1) {
			let id = getQuestion[j].id;
			let title = getQuestion[j].question;
			let answers = getQuestion[j].answers;
			let input = getQuestion[j].input;
			let showSkip = false || getQuestion[j].showSkip;

			currentQuestion = { id, title, answers, input, showSkip };
			setCounter(1);

			dispatch({ type: 'SET_CURRENT_QUESTION', payload: currentQuestion });
		}
	}, [assessment.selectedQuestions, dispatch, i, j]);
	
	// Effect that get all selected questions for the patient's symptoms and save them to store
	const questionsForEachSymptom = () => {
		if(assessment.selectedSymptoms.length >= 1) {
			let selectedQuestions = [];
			const selectedSymptomsLowercase = assessment.selectedSymptoms.map(s => s.toLowerCase());
			db.collection('/parametros/userapp/assessment').where('triggers', 'array-contains-any', selectedSymptomsLowercase).get()
			.then(query => {
				query.forEach(doc => {
					const data = doc.data();
					selectedQuestions.push({
						id: doc.id,
						question: data.question,
						answers: data.answer,
						input: data.input
					});
					let symptoms = [...new Set(data.symptom)]
					symptoms.map(symptom => {
						db.collection('parametros').doc('userapp').collection('assessment').doc(symptom).get()
						.then(doc => {
							if(doc.exists) {
								let result = selectedQuestions.filter(item => item.id === doc.id);

								if(result.length === 0) {
									const symptomData = doc.data();
									selectedQuestions.push({
										id: doc.id,
										question: symptomData.question,
										answers: symptomData.answer,
										input: symptomData.input
									});
								}
							}
						})
						.catch(e => console.log(e));
					})
					let features = [...new Set(data.features)]

					features.map(question => {
						db.collection('parametros').doc('userapp').collection('assessment').doc(question).get()
						.then(doc => {
							if(doc.exists) {
								const docData = doc.data();

								if(!docData.sex || docData.sex === patient.sex.toLowerCase()) {
									selectedQuestions.push({
										id: doc.id,
										question: docData.question,
										answers: docData.answer,
										input: docData.input,
										showSkip: true
									});
								}
							}
						})
						.catch(e => console.log(e));
					})
				})

				dispatch({ type: 'SET_SELECTED_QUESTIONS', payload: selectedQuestions });
			})
			.catch(e => console.log(e));
		} else {
			dispatch({ type: 'SET_SELECTED_QUESTIONS', payload: null });
		}
	};

	return (
		<>
			<GenericHeader children='Preguntas' />
			{
				assessment.selectedQuestions && assessment.selectedQuestions.length >= 1 &&
				<div className="progressQuestions">
					<ProgressBar max={assessment.selectedQuestions.length} value={j + 1} />
				</div>
			}
			{loading && <Loading centered={true} />}
			<BackButton />
			<div className='text-center currentQuestion'>
				{
					assessment.currentQuestion && assessment.currentQuestion.title && assessment.currentQuestion.id !== '120' &&
					<div className='assessment-text mt-4 mb-4'>
						{assessment.currentQuestion.title}
					</div>
				}
				<ContainerAssessmentAppointment {...propsContainerAssessmentAppointment} />
			</div>
		</>
	);
};

export default Questions;
