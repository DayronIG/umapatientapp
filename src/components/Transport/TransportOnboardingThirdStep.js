
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Axios from 'axios';
import { GenericHeader } from '../GeneralComponents/Headers';
import { transport } from '../../config/endpoints';
import Alert from '../GeneralComponents/Alert/Alerts';
import InputFile from '../Inputs/InputFile';
import swal from 'sweetalert';
import '../../styles/generalcomponents/TransportOnboardingThirdStep.scss';

const TransportOnboarding = () => {
	const dispatch = useDispatch();
	/* Second Form data */
	const { disability, certificateNumber, wheelChair, diagnostic, protection, companionName } = useSelector((state) => state.onboardingSecondStep);
	/* Third Form data */
	const { credentialExpires, disabilityExpires } = useSelector((state) => state.onboardingThirdStep);
	const getIdPreview = useSelector((state) => state.onboardingThirdStep.id.filePreview);
	const getIdFile = useSelector((state) => state.onboardingThirdStep.id.file);
	const getLicencePreview = useSelector((state) => state.onboardingThirdStep.licence.filePreview);
	const getLicenceFile = useSelector((state) => state.onboardingThirdStep.licence.file);
	const getQualificationPreview = useSelector((state) => state.onboardingThirdStep.qualification.filePreview);
	const getQualificationFile = useSelector((state) => state.onboardingThirdStep.qualification.file);
	const getIdExpires = useSelector((state) => state.onboardingThirdStep.idExpires);
	/* Local States */
	const [displayAlert, setDisplayAlert] = useState(false);
	const [getLoading, setLoading] = useState(false);
	/* Hooks */
	const history = useHistory();

	async function sendForm() {
		const getUserData = JSON.parse(localStorage.getItem('userData'))
		setLoading(true)
		const data = {
			'ws': getUserData.ws,
			'dni': getUserData.dni,
			'dt': '',
			'discapacidad': disability,
			'credencial': certificateNumber,
			'silla_ruedas': wheelChair,
			'diagnostico': diagnostic,
			'amparo': protection,
			'acompanante': companionName,
			'dni_foto': getIdFile,
			'credencial_foto': getLicenceFile,
			'certificado_foto': getQualificationFile,
			'dni_vencimiento': getIdExpires,
			'credencial_vencimiento': credentialExpires,
			'certificado_discapacidad_vencimiento': disabilityExpires
		};
		const config = { headers: { 'Content-Type': 'application/json;charset=UTF-8'/* , 'Authorization': token */ } };
		try {
			const res = await Axios.post(transport, data, config);
			backToMainMenu();
			setDisplayAlert(true);
		} catch (error) {
			swal('Error', 'Hubo un error en el envío del Formulario, será redireccionado al registro nuevamente...', 'warning');
			setTimeout(function () {
				history.push(`/TransportRegister`);
			}, 4000);
		} finally {
			setLoading(false);
		}
	}

	function backToMainMenu() {
		setTimeout(function () {
			history.push(`/`);
		}, 4000)
	}

	function buildImages(typeAction, fileValue) {
		let imagePreview = '';
		if (typeof fileValue === 'string') {
			imagePreview = fileValue;
		} else {
			imagePreview = URL.createObjectURL(fileValue);
		}
		dispatch({ type: typeAction, payload: { filePreview: imagePreview, file: fileValue } })
	}

	return (
		<>
			<GenericHeader>Registro</GenericHeader>
			{displayAlert &&
				<Alert
					alertType='success'
					timerRemove='4000'
					titleMessage='Formulario enviado'
					customMessage='En breve será redireccionado a la página de inicio'
				/>
			}
			<div className='TransportOnboardingThirdStep'>
				<div className='uploadDocumentationWrapper'>
					<div className='d-flex justify-content-center'>
						<InputFile
							title='DNI'
							value={getIdPreview}
							inputProps={{
								name: 'Cargar DNI',
								id: 'upload-photo-dni',
								onChange: (e) => buildImages('ADD_ID_THIRD_STEP', e.target.files[0])
							}}
						/>
						<InputFile
							title='Credencial'
							value={getLicencePreview}
							inputProps={{
								id: 'upload-photo-licence',
								name: 'Cargar Credencial',
								onChange: (e) => buildImages('ADD_LICENCE_THIRD_STEP', e.target.files[0])
							}}
						/>
						{disability !== '0-NINGUNA' &&
							<InputFile
								title='Certificado'
								value={getQualificationPreview}
								inputProps={{
									id: 'upload-photo-licence',
									name: 'Cargar Discapacidad',
									onChange: (e) => buildImages('ADD_QUALIFICATION_THIRD_STEP', e.target.files[0])
								}}
							/>
						}
					</div>
				</div>
				<div className='dateDocumentExpiresWrapper'>
					<div className='titleThirdStep'>Vencimiento de DNI</div>
					{getIdExpires ? '' : <span className='mandatoryField'>* Obligatorio</span>}
					<input type='text'
						placeholder={'dd/mm/aaaa'}
						value={getIdExpires}
						className='form-control expireDate'
						onChange={(e) => dispatch({ type: 'ADD_ID_EXPIRATION_THIRD_STEP', payload: e.target.value })}
					/>
					<div className='titleThirdStep'>Vencimiento de Credencial</div>
					{credentialExpires ? '' : <span className='mandatoryField'>* Obligatorio</span>}
					<input type='text'
						placeholder={'dd/mm/aaaa'}
						value={credentialExpires}
						className='form-control expireDate'
						onChange={(e) => dispatch({ type: 'ADD_CREDENTIAL_EXPIRATION_THIRD_STEP', payload: e.target.value })}
					/>
					{disability !== '0-NINGUNA' ?
						<div>
							<div className='titleThirdStep'>Vencimiento de Certificado de discapacidad</div>
							<input type='text'
								placeholder={'dd/mm/aaaa'}
								value={disabilityExpires}
								className='form-control expireDate'
								onChange={(e) => dispatch({ type: 'ADD_DISABILITY_EXPIRATION_THIRD_STEP', payload: e.target.value })}
							/>
						</div>
						:
						''}
				</div>
				<div className='buttonsContainer'>
					<div className='buttonContainer'>
						<button
							disabled={!getIdPreview || !getLicencePreview || !getIdExpires || !credentialExpires}
							className='btn btn-active'
							onClick={sendForm}>
							{getLoading ?
								<div className='wrapperLoading'>
									<div className='loading spinner-border text-primary' role='initial'>
										<span className='sr-only'>Loading...</span>
									</div>
								</div>
								:
								'Enviar'
							}
						</button>
					</div>
				</div>
			</div>
		</>
	)
}

export default TransportOnboarding;
