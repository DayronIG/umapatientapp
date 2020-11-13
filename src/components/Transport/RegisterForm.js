import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import BackButton from '../GeneralComponents/Backbutton';
import { YesNoCheckbox, UploadImg, SelectRegister, InputRegister, ContinueButton } from './RegisterFormComponents'
import Cleave from 'cleave.js/react';
import swal from 'sweetalert';
import { useHistory, useParams } from 'react-router-dom';
import { CustomUmaLoader } from './../global/Spinner/Loaders';
import { sendForm } from './SendFormRegister';
import '../../styles/transport/registerForm.scss';

const fromInitialState = {
    dni: '',
    dniPreview: '',
    discapacity: false,
    diagnostico: '',
    gradoDiscapacidad: '',
    nroCertificado: '',
    vencCertificado: '',
    certImg: '',
    certImgPreview: '',
    sillaRuedas: false,
    acompañante: false,
    acompañanteName: '',
}

const RegisterForm = () => {
    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.front);
		const [dataForm, setForm] = useState(fromInitialState)
    const history = useHistory();
    const { ws } = useParams();

		function buildImages(fileValue, id) {
				let imagePreview = '';
				if (typeof fileValue === 'string') {
						imagePreview = fileValue;
				} else {
						imagePreview = URL.createObjectURL(fileValue);
				}
				switch (id) {
						case 'dni':
						setForm({...dataForm, dni: fileValue,  dniPreview: imagePreview})   
								break;
					case 'certImg':
						setForm({...dataForm, certImg: fileValue,  certImgPreview: imagePreview})   
								break;
						default:
								break;
				}
		}
	
		const handleChange = (event) => {
			const { name, value } = event.target;
			return setForm({...dataForm, [name]: value });
		}

		const handleRadioCHange = (event) => {
			const { name, value } = event.target;
			return setForm({ ...dataForm, [name]: value === 'true' ? true : false })
		}
		
    const handlerSubmit = async (e) => {
			e.preventDefault();
			const user = JSON.parse(localStorage.getItem('userData'));
			dispatch({ type: 'LOADING', payload: true });
			try {
				await sendForm(dataForm, user);
				await swal({
					title: "Formulario enviado",
					text: "En breve será redireccionado a la página de inicio",
					icon: "success",
					buttons: true,
					timer: 3000
				});
				dispatch({ type: 'LOADING', payload: false });
				history.push(`/${ws}/transportUserActive`);
			} catch (error) {
				dispatch({ type: 'LOADING', payload: false });
				console.error(error);
				swal('Error', 'Hubo un error en el envío del Formulario, será redireccionado al registro nuevamente...', 'warning');
				history.push(`/${ws}/transportRegister`);
			}
    }

    if(!loading) {
        return (
					<div className="RegisterFormWrapper">
            <BackButton />
            <h2 className="RegisterFormWrapper_title">Datos del usuario</h2>
            <hr />
            <h4 className="RegisterFormWrapper_subtitle">Completa el siguiente formulario con los datos de la persona a trasladar</h4>
            <form className="RegisterFormWrapper_form">
							<UploadImg
								previewImage={dataForm.dniPreview}
								title='Suba una foto del frente de su DNI*'
								id='dni'
								cb={buildImages}
							/>
							<YesNoCheckbox
								title='¿Posee alguna discapacidad?*'
								id='discapacity'
								cb={handleRadioCHange}
							/>
							{dataForm.discapacity && (
								<>
									<SelectRegister
										title='¿Qué diagnóstico de discapacidad tiene?'
										id='diagnostico'
										cb={handleChange}
										options={['DISCAPACIDAD FISICA', 'DISCAPACIDAD SENSORIAL', 'DISCAPACIDAD PSIQUICA', 'DISCAPACIDAD VISCERAL', 'DISCAPACIDAD MULTIPLE']}
									/>
									<SelectRegister
										title='¿Qué grado de discapacidad tiene?'
										id='gradoDiscapacidad'
										cb={handleChange}
										options={['NINGUNA', 'ESCASA', 'MODERADA', 'GRAVE', 'TOTAL']}
									/>
									<div className="dataCertificado">
										<InputRegister
											title='N° certificado'
											id='nroCertificado'
											cb={handleChange}
										/>
										<div className="InputDate">
												<label>
													Fecha de Venc.
												</label>
												<Cleave
													placeholder="dd/mm/aaaa"
													options={{ date: true, delimiter: '/', datePattern: ['d', 'm', 'Y'] }}
													onChange={handleChange}
													value={dataForm.vencCertificado}
													name='vencCertificado'
													className="cleave"
												/>
										</div>
										{/* 
											<InputRegister
												title='Fecha de venc.'
												id='VecCertificado'
												cb={inputChangeVencCertificado}
											/> 
										*/}
									</div>
									<UploadImg
										previewImage={dataForm.certImgPreview}
										title='Suba una foto del certificado de discapacidad'
										id='certImg'
										cb={buildImages}
									/>
									<YesNoCheckbox
										title='¿Usa silla de ruedas?'
										id='sillaRuedas'
										cb={handleRadioCHange}
									/>
									<YesNoCheckbox
										title='¿Viaja con un acompañante?'
										id='acompañante'
										cb={handleRadioCHange}
									/>
									{dataForm.acompañante && (
										<InputRegister
											title='Nombre del acompañante'
											id='acompañanteName'
											cb={handleChange}
										/>
									)}
								</>
							)}
							<ContinueButton
								title='Finalizar'
								type='submit'
								cb={handlerSubmit}
							/>
            </form>
				</div>
			)
	} else{
    return <CustomUmaLoader />;
	}
}

export default RegisterForm