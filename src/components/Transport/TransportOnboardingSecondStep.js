
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { GenericHeader } from '../GeneralComponents/Headers';
import Backbutton from '../../components/GeneralComponents/Backbutton';
import '../../styles/generalcomponents/TransportOnboardingSecondStep.scss';

const TransportOnboarding = (props) => {
	const dispatch = useDispatch();
	const { disability, certificateNumber, wheelChair, diagnostic, protection, companionName } = useSelector((state) => state.onboardingSecondStep);
	
	function goToNextStep() {
		dispatch({ type: 'SET_PAGINATION_TRANSPORT', payload: 2 });
	}

	return (
		<>
			<GenericHeader>Registro</GenericHeader>
			<Backbutton />
			<div className='transportOnboardingSecondStep'>
				<div className='secondStepContainer'>
					<div className='disabilityTitleWrapper d-flex justify-content-between'>
						<div className='titleSecondStep'>Discapacidad</div>
						{!disability && <div className='mandatory'>Obligatorio *</div>}
					</div>
					<select
						className='form-control'
						value={disability}
						onChange={(e) => dispatch({ type: 'ADD_DISABILITY', payload: e.target.value })}
						required
					>
						<option value=''>Sin informar</option>
						<option value='0-NINGUNA'>NINGUNA</option>
						<option value='1-ESCASA'>ESCASA</option>
						<option value='2-MODERADA'>MODERADA</option>
						<option value='3-GRAVE'>GRAVE</option>
						<option value='4-TOTAL'>TOTAL</option>
					</select>
					{(disability !== '0-NINGUNA' && disability !== '') ?
						<div>
							<div className='titleSecondStep'>Número de certificado</div>
							<input type='text'
								placeholder={'Ingresar certificado'}
								value={certificateNumber ? certificateNumber : ''}
								onChange={(e) => dispatch({ type: 'ADD_CERTIFICATE', payload: e.target.value })}
								autoComplete='off'
								id='certificate'
								className='form-control'
								required />
							<div className='titleSecondStep'>Silla de ruedas</div>
							<select className='form-control'
								value={wheelChair === '1' ? wheelChair : '0'}
								onChange={(e) => dispatch({ type: 'ADD_WHEELCHAIR', payload: e.target.value })}>
								<option value='0'>Sin informar</option>
								<option value='0'>NO</option>
								<option value='1'>SI</option>
							</select>
							<div className='titleSecondStep'>Diagnóstico</div>
							<select className='form-control'
								value={diagnostic}
								onChange={(e) => dispatch({ type: 'ADD_DIAGNOSTIC', payload: e.target.value })}>
								<option value=''>Sin informar</option>
								<option value='1-DISCAPACIDAD FISICA'>DISCAPACIDAD FISICA</option>
								<option value='2-DISCAPACIDAD SENSORIAL'>DISCAPACIDAD SENSORIAL</option>
								<option value='4-DISCAPACIDAD PSIQUICA'>DISCAPACIDAD PSIQUICA</option>
								<option value='5-DISCAPACIDAD VISCERAL'>DISCAPACIDAD VISCERAL</option>
								<option value='6-DISCAPACIDAD MULTIPLE'>DISCAPACIDAD MULTIPLE</option>
							</select>
							<div className='titleSecondStep'>Amparo</div>
							<select className='form-control'
								value={protection === '1' ? protection : '0'}
								onChange={(e) => dispatch({ type: 'ADD_PROTECTION', payload: e.target.value })}>
								<option value='0'>Sin informar</option>
								<option value='0'>NO</option>
								<option value='1'>SI</option>
							</select>
							<div className='titleSecondStep'>Acompañante</div>
							<input type='text'
								className='form-control'
								placeholder='Ingresar nombre del acompañante'
								value={companionName}
								onChange={(e) => dispatch({ type: 'ADD_COMPANION', payload: e.target.value })} 
							/>
						</div>
						: ''}
					<div className='buttonsContainer'>
						<div className='buttonContainer'>
							<button
								className='btn btn-active'
								onClick={goToNextStep}
								disabled={!disability}>
								Siguiente
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default TransportOnboarding;
