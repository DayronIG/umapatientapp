import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Switch from 'react-switch';
import switchConfig from '../../../config/switchConfig';
import '../../../styles/covidTermsAndConditions.scss';
import covidTermsAndCondsQuestions from '../../../config/covidTermsAndConditions.json';
import covidTermsAndCondsQuestionsProvincia from '../../../config/covidTermsAndConditionsProvincia.json';
import covidHabitatQuestions from '../../../config/covidHabitatQuestions.json';
import covidHabitatQuestionsProvincia from '../../../config/covidHabitatQuestionsProvincia.json';

function Index({ formHandler, activateDefault = false, mode = 'switch', ubicacion, setUbicacion, typeComponent }) {
	const [formState, setFormState] = useState([]);
	const [selectedIndex, setSelectedIndex] = useState([]);
	const [arreglo, setArreglo] = useState([]);
	const biomarkers = useSelector(state => state.assessment.biomarkers)
	const dispatch = useDispatch();

	useEffect(() => {
		if (activateDefault) {
			const helper = arreglo.filter(item => 'value' in item && item).map(i => i.value);
			setFormState(helper);
		}
	}, [activateDefault, arreglo]);

	useEffect(() => {
		if(typeComponent === 'habitat') {
			setArreglo(ubicacionHabitat(ubicacion))
		} else {
			setArreglo(ubicacionTerms(ubicacion))
		}
	}, [typeComponent, ubicacion])

	const modifyState = (event, value, form) => {
		let helper = [...formState];
		if (event) {
			helper.push(value);
		} else {
			helper = helper.filter((item) => value !== item && item);
		}
		helper = new Set(helper);
		helper = Array.from(helper);
		console.log(event, value, form)
		return setFormState(helper);
	};

	const saveItem = (value, item, index, form) => {
		modifyState(value, item.value, formState);
		let helper = [...selectedIndex];
		helper.push(index);
		helper = Array.from(new Set(helper));
		setSelectedIndex(helper);
		let key = item.value.split(' ').join('_');
		let biomarker = {
			[key]: value ? 'yes' : 'no',
		};
		dispatch({ type: 'SET_ASSESSMENT_BIOMARKER', payload: biomarker });
	};

	const ubicacionHabitat = (ubicacion) => {
		if(ubicacion === 'capital') {
			return covidHabitatQuestions;
		} else {
			return covidHabitatQuestionsProvincia;
		}
	};

	const ubicacionTerms = (ubicacion) => {
		if(ubicacion === 'capital') {
			return covidTermsAndCondsQuestions;
		} else {
			return covidTermsAndCondsQuestionsProvincia;
		}
	};

	return (
		<div className='covidTermsAndConditions'>
			{
				typeComponent !== 'terminos' && biomarkers?.[0]?.amba === "yes" && 
				<div className='covidTermsAndConditions__container'>
					<div className='covidTermsAndConditions__container--questions buttons'>
						<p>¿Dónde se encuentra actualmente?</p>
						<div className='d-flex justify-content-between buttonContainer'>
							<button
								className={`ubicacion ${ubicacion === 'capital' && 'active'}`}
								onClick={() => setUbicacion('capital')}>
									CABA
							</button>
							<button
								className={`ubicacion ${ubicacion === 'provincia' && 'active'}`}
								onClick={() => setUbicacion('provincia')}>
									GBA
							</button>
						</div>
					</div>
				</div>
			}
			{	
				arreglo.map((item, index) => {
					if ('value' in item) {
						if (mode === 'switch') {
							return (
								<div className='covidTermsAndConditions__container' key={index}>
									<div className='covidTermsAndConditions__container--questions switch'>
										<Switch
											checked={formState.includes(item.value)}
											onChange={(e) => modifyState(e, item.value)}
											{...switchConfig}
										/>
										<p>{item.label}</p>
									</div>
								</div>
							);
						} else if (mode === 'button') {
							return (
								<div className='covidTermsAndConditions__container' key={index}>
									<div className='covidTermsAndConditions__container--questions buttons'>
										<p>{item.label}</p>
										<div className='d-flex justify-content-between buttonContainer'>
											<button
												className={`yes ${formState.includes(item.value) ? 'active' : ''}`}
												onClick={() => saveItem(true, item, index, formState)}>
												Si
											</button>
											<button
												className={`no ${
													!formState.includes(item.value) && selectedIndex.includes(index)
														? 'disabled'
														: ''
												}`}
												onClick={() => saveItem(false, item, index, formState)}>
												No
											</button>
										</div>
									</div>
								</div>
							);
						}
					} else {
						return (
							<div className='covidTermsAndConditions__container' key={index}>
								<p className='covidTermsAndConditions__container--paragraph'>{item.label}</p>
							</div>
						);
					}
				})
			}
			{
				<div className='covidTermsAndConditions__container'>
					<button className='covidTermsAndConditions__container--submit' onClick={() => formHandler(formState)}>
						Confirmar
					</button>
				</div>
			}
		</div>
	);
}

export default Index;
