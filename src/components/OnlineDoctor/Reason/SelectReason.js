import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import Backbutton from '../../GeneralComponents/Backbutton';
import symptoms from '../../../config/symptoms.json';
import useScrollPosition from '../../Utils/use-scroll-position';
import Modal from '../../GeneralComponents/Modal/MobileModal'
import RecipeInput from './RecipeInput'

const SelectReason = (props) => {
	const dispatch = useDispatch();
	const questionsList = useSelector((state) => state.queries.questions);
	const symptomsList = useSelector((state) => state.queries.symptoms);
	const selectedSymptoms = useSelector((state) => state.assessment.selectedSymptoms);
	// const coords = useSelector(state => state.queries.geolocation)
	const [otherSymptoms, setOtherSymptoms] = useState('');
	const [recipeInputModal, setRecipeInputModal] = useState(false);
	let scrollPosition = useScrollPosition();

	useEffect(() => {
		dispatch({ type: 'GET_QUESTIONS', payload: symptoms });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch]);

	useEffect(() => {
		let symptoms = [];
		questionsList.forEach((symptom) => symptoms.push(symptom.symptom));
		if (symptoms.length > 0) dispatch({ type: 'GET_SYMPTOMS', payload: symptoms });
	}, [questionsList, dispatch]);

	function disableScrolling(){
		var x=window.scrollX;
		var y=window.scrollY;
		window.onscroll=function(){window.scrollTo(x, y);};
	}
	
	function enableScrolling(){
		window.onscroll=function(){};
	}

	function addReason(reason) {
		if (!selectedSymptoms.includes(reason)) dispatch({ type: 'SET_SYMPTOM', payload: reason });
	}
	function deleteReason(symptom) {
		const newTags = selectedSymptoms.filter((tags) => tags !== symptom);
		dispatch({ type: 'REMOVE_SYMPTOM_TAG', payload: newTags });
	}
	function filterIfRecipeIsSelected(){
		if (selectedSymptoms.includes('Receta')){
			window.scroll(0, 100)
			disableScrolling()
			setRecipeInputModal(true)
		} else {
			redirect()
		}
	}
	function recipeModalCheckout(){
		setRecipeInputModal(false)
		enableScrolling()
		redirect()
	}
	function redirect() {
		//dispatch({ type: 'SET_OTHER_SYMPTOMS', payload: otherSymptoms });

		if (!selectedSymptoms.includes(otherSymptoms)) dispatch({ type: 'SET_SYMPTOM', payload: otherSymptoms });
		props.history.replace(`/${props.match.params.dni}/onlinedoctor/questions`);
	}
	function addOtherSympton(e){
		if(e.key === 'Enter'){ 
			dispatch({ type: 'SET_SYMPTOM', payload: otherSymptoms })
			setOtherSymptoms('')
		}
	}

	return (
		<>
			<div className={`dinamic-question`}>
				{
					recipeInputModal &&
					<Modal callback={()=>recipeModalCheckout()}> 
						<RecipeInput callback={()=>recipeModalCheckout()}/>
					</Modal>
				}
				<Backbutton inlineButton={false} />
				<span className='question-title'>Motivo de la consulta</span>
				<div className={`${scrollPosition > 90 ? 'tags-container-sticky' : 'tags-container'} `}>
					<>
						{selectedSymptoms.length >= 1 ? (
							selectedSymptoms.map((symptom, index) => {
								return (
									<div className='tag' key={index} onClick={(e) => deleteReason(symptom)}>
										<span className='tag-text'>{symptom}</span>
										<FontAwesomeIcon icon={faTimesCircle} className='tag-delicon' />
									</div>
								);
							})
						) : (
							<div className='tag-empty'>No ha agregado motivos</div>
						)}{' '}
					</>
					
				</div>
			</div>
			<div className='symptom-list-container'>
				{symptomsList.map((symptom) => (
					<div
						className='symptom-list d-flex justify-content-between'
						key={symptom}
						onClick={() => addReason(symptom)}>
						<span className='symptom-text'>{symptom}</span>
						<FontAwesomeIcon icon={faPlusCircle} className='symptom-addicon' />
					</div>
				))}
			</div>
			<div className='dinamic-add-reason'>
				<div className='dinamic-reasons d-block text-center'>
					<input
						type='text'
						onChange={(e) => setOtherSymptoms(e.target.value)}
						onKeyPress={(e) => addOtherSympton(e)}
						value={otherSymptoms}
						placeholder='Otros síntomas'
					/>
				</div>
				<button className='btn btn-blue-lg confirmConsultReason' onClick={filterIfRecipeIsSelected}>
					Siguiente
				</button>
			</div>
		</>
	);
};

export default withRouter(SelectReason);
