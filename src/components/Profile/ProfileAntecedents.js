import React, { useState, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import MobileModal from '../GeneralComponents/Modal/MobileModal';
import { PersonalHistory } from './ProfileForms';
import { EditAntecedents } from './EditComponent';
import File from '../../assets/illustrations/File.png';
import '../../styles/profile/antecedents.scss';

const ProfileAntecedents = () => {
	const dispatch = useDispatch()
	const history = useHistory()
    const userHistory = useSelector(state => state.userHistory)
	const patient = useSelector(state => state.user)
	const modal = useSelector((state) => state.front.modalAction)

    const riskFactor = [
		{
			item: 1,
			field: 'Fuma',
			data: `${userHistory.smoke ? 'Sí': 'No'}`
		},
		{
			item: 2,
			field: 'Bebe alcohol',
			data: `${userHistory.alcohol ? userHistory.alcoholFrequency : 'No'}`
		}, 
	] 

	const allergies = [
		{
			item: 1,
			field: 'Alergias',
			data: userHistory.allergyType.length > 0 ? userHistory.allergyType.map(item => 
			<p key={item.id}>{item}</p>) : <p>No posee</p>
		}
	]

	const operations = [
		{
			item: 1,
			field: 'Operaciones',
			data: userHistory.operations ? 
				userHistory.operationsType.map(item => 
				<p>Tipo: {item.type} - A los {item.age} años</p>) : <p>No</p>
		}
	]

	const fractures = [
		{
			item: 1,
			field: 'Traumatismos',
			data: userHistory.fractures ?
				userHistory.fracturesType.map(item => 
				<p>Tipo: {item.type} - A los {item.age} años</p>) : <p>No</p>
		}
	]


	const personalAntecedents = [
		{
			item: 1,
			field: 'Celiaquía',
			data: `${userHistory.celiac ? 'Sí': 'No'}`
		}, 
		{
			item: 2,
			field: 'Diabetes',
			data: `${userHistory.diabetes ? userHistory.diabetesType : 'No'}`
		},
		{
			item: 3,
			field: 'Hipertensión',
			data: `${userHistory.hypertension ? 'Sí' : 'No'}`
		},
		{
			item: 4,
			field: 'Tiroides',
			data: `${userHistory.thyroid ? userHistory.thyroidType : 'No'}`
		},
	] 

	const familyAntecedents = [
		{
			item: 1,
			field: 'Cáncer',
			data: userHistory.familyCancer ?  
                userHistory.familyCancerDetails.map(item => 
				<p>Parentesco: {item.parent} - {item.type}</p>) : <p>No</p>
		},
		{
			item: 2,
			field: 'Diabetes',
			data: userHistory.familyDiabetes ?  
                	userHistory.familyDiabetesDetails.map(item => 
					<p>Parentesco: {item.parent} - {item.type}</p>) : <p>No</p>
		}, 
		{
			item: 3,
			field: 'Hipertensión',
			data: userHistory.familyHypertension ?  
                	userHistory.familyHypertensionDetails.map(item => 
					<p>{item}</p>) : <p>No</p>
		},
	]

	return(	
		<Fragment>
			{modal && (
				<MobileModal title='Editar datos' isWellness
				callback={()=>{dispatch({type: 'TOGGLE_MODAL_ACTION', payload: false})}}>
					<EditAntecedents userHistory={userHistory} />
				</MobileModal>
			)}
			{!userHistory.completed ?
				<div className='empty-section'>
					<img src={File} alt='Archivo' className='file-img'/>
					<article className='background-to-fill'>
						<h1>Aún no tienes antecedentes</h1>
						<h2>Aquí podrás visualizar tus antecedentes de salud. Complétalos para brindarte una mejor atención.</h2>
						<h2>¡Comencemos!</h2>
					</article>
					<button className='get-started' onClick={()=> history.push(`/antecedents/${patient.id}/risk`)}>Comenzar</button>
				</div>
			:	
				<section className='antecedentsHistory'>
					<PersonalHistory title='Factores de riesgo' section='riskFactor' >
						{riskFactor.map((item)=> {
							return (
								<div className='data-field' key={item.item}>
									<p className='field'>{item.field}</p>
									{item.data !== '' ? <div className='data'>{item.data}</div> : '-'}
								</div>
							)
						})}
					</PersonalHistory>
					<PersonalHistory title='Alergias' section='allergies'>
						<div className='data-field'>
							{allergies[0].data !== '' ? <div className='data'>{allergies[0].data}</div> : '-'}
						</div>
					</PersonalHistory>
					<PersonalHistory title='Operaciones' section='operations'>
						<div className='data-field'>
							{operations[0].data !== '' ? <div className='data'>{operations[0].data}</div> : '-'}
						</div>
					</PersonalHistory>
					<PersonalHistory title='Fracturas' section='fractures'>
						<div className='data-field'>
							{fractures[0].data !== '' ? <div className='data'>{fractures[0].data}</div> : '-'}
						</div>
					</PersonalHistory>
					<PersonalHistory title='Antecedentes personales' section='anotherConditions' >
						{personalAntecedents.map((item)=> {
							return (
								<div className='data-field' key={item.item}>
									<p className='field'>{item.field}</p>
									{item.data !== '' ? <div className='data'>{item.data}</div> : '-'}
								</div>
							)
						})}
					</PersonalHistory>
					<PersonalHistory title='Antecedentes familiares' section='familyAntecedents' >
						{familyAntecedents.map((item)=> {
							return (
								<div className='data-field' key={item.item}>
									<p className='field'>{item.field}</p>
									{item.data !== '' ? <div className='data'>{item.data}</div> : '-'}
								</div>
							)
						})}
					</PersonalHistory>
				</section>
			}
		</Fragment>
    )
}

export default ProfileAntecedents;
