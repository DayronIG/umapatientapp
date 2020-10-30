
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Axios from 'axios';
import { GenericHeader } from '../GeneralComponents/Headers';
import { transport_register } from '../../config/endpoints';
import { fileToBlob } from '../Utils/fileToBlob';
import InputFile from '../Inputs/InputFile';
import swal from 'sweetalert';
import Loading from '../GeneralComponents/Loading';
import { putFileFB } from '../Utils/firebaseUtils';
import '../../styles/generalcomponents/TransportOnboardingThirdStep.scss';

const TransportOnboarding = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	/* Second Form data */
	const { disability, certificateNumber, wheelChair, diagnostic, protection, companionName } = useSelector((state) => state.onboardingSecondStep);
	const { loading } = useSelector(state => state.front);
	/* Third Form data */
	const { credentialExpires, disabilityExpires } = useSelector((state) => state.onboardingThirdStep);
	const getIdPreview = useSelector((state) => state.onboardingThirdStep.id.filePreview);
	const getIdFile = useSelector((state) => state.onboardingThirdStep.id.file);
	const getLicencePreview = useSelector((state) => state.onboardingThirdStep.licence.filePreview);
	const getLicenceFile = useSelector((state) => state.onboardingThirdStep.licence.file);
	const getQualificationPreview = useSelector((state) => state.onboardingThirdStep.qualification.filePreview);
	const getIdExpires = useSelector((state) => state.onboardingThirdStep.idExpires);
	// const getQualificationFile = useSelector((state) => state.onboardingThirdStep.qualification.file);
	/* Local States */
	/* Hooks */
	
	async function sendForm() {
		dispatch({ type: 'SET_LOADING', payload: true });
		const licenceBlob = await fileToBlob(getLicenceFile);
		const dniBlob = await fileToBlob(getIdFile);
		const getUserData = JSON.parse(localStorage.getItem('userData'));
		const [url_credential, url_dni] = await Promise.all([
			putFileFB(dniBlob, `/${getUserData.dni}/dni_photo`), 
			putFileFB(licenceBlob, `/${getUserData.dni}/licence_photo`)
		]);
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
			'dni_foto': url_dni,
			'credencial_foto': getLicenceFile,
			'certificado_foto': url_credential,
			'dni_vencimiento': getIdExpires,
			'credencial_vencimiento': credentialExpires,
			'certificado_discapacidad_vencimiento': disabilityExpires
		};
		const config = { headers: { 'Content-Type': 'application/json;charset=UTF-8'/* , 'Authorization': token */ } };
		try {
			await Axios.post(transport_register, data, config);
			await swal({
				title: "Formulario enviado",
				text: "En breve será redireccionado a la página de inicio",
				icon: "success",
				buttons: true,
				timer: 3000
			});
			redirectToDestinySelection();
		} catch (error) {
			swal('Error', 'Hubo un error en el envío del Formulario, será redireccionado al registro nuevamente...', 'warning');
			setTimeout(function () {
				history.push(`/TransportRegister`);
			}, 4000);
		} finally {
			dispatch({ type: 'SET_LOADING', payload: false });
		}
	}

	const redirectToDestinySelection = () => {
		history.push(`/`);
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

	const validateForm = () => !getIdPreview || !getLicencePreview || !getIdExpires || !credentialExpires;

	return (
		<>
			<GenericHeader>Registro</GenericHeader>
			{loading && <Loading />}
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
					{!getIdExpires && <span className='mandatoryField'>* Obligatorio</span>}
					<input
						type='text'
						placeholder='dd/mm/aaaa'
						value={getIdExpires}
						className='form-control expireDate'
						onChange={(e) => dispatch({ type: 'ADD_ID_EXPIRATION_THIRD_STEP', payload: e.target.value })}
					/>
					<div className='titleThirdStep'>Vencimiento de Credencial</div>
					{!credentialExpires && <span className='mandatoryField'>* Obligatorio</span>}
					<input
						type='text'
						placeholder='dd/mm/aaaa'
						value={credentialExpires}
						className='form-control expireDate'
						onChange={(e) => dispatch({ type: 'ADD_CREDENTIAL_EXPIRATION_THIRD_STEP', payload: e.target.value })}
					/>
					{disability !== '0-NINGUNA' &&
						<div>
							<div className='titleThirdStep'>Vencimiento de Certificado de discapacidad</div>
							<input type='text'
								placeholder={'dd/mm/aaaa'}
								value={disabilityExpires}
								className='form-control expireDate'
								onChange={(e) => dispatch({ type: 'ADD_DISABILITY_EXPIRATION_THIRD_STEP', payload: e.target.value })}
							/>
						</div>
					}
				</div>
				<div className='buttonsContainer'>
					<div className='buttonContainer'>
						<button
							disabled={validateForm()}
							className='btn btn-active'
							onClick={sendForm}>
							Enviar
						</button>
					</div>
				</div>
			</div>
		</>
	)
}

export default TransportOnboarding;
