import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Axios from 'axios';
import swal from 'sweetalert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { GenericHeader } from '../GeneralComponents/Headers';
import { transport } from '../../config/endpoints';
import Alert from '../GeneralComponents/Alert/Alerts';
import Cleave from 'cleave.js/react';
import { transport_register } from '../../config/endpoints';
import { fileToBlob } from '../Utils/fileToBlob';
import InputFile from '../Inputs/InputFile';
import CustomUmaLoader from '../GeneralComponents/Loading';
import { putFileFB } from '../Utils/firebaseUtils';
import '../../styles/generalcomponents/TransportOnboardingThirdStep.scss';
import moment from 'moment-timezone';


const TransportOnboarding = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    /* Second Form data */
    const { disability, certificateNumber, wheelChair, diagnostic, protection, companionName } = useSelector((state) => state.onboardingSecondStep);
    /* Third Form data */
    const { credentialExpires, disabilityExpires } = useSelector((state) => state.onboardingThirdStep);
    const getIdPreview = useSelector((state) => state.onboardingThirdStep.id.filePreview);
    const getIdFile = useSelector((state) => state.onboardingThirdStep.id.file);
    const getLicencePreview = useSelector((state) => state.onboardingThirdStep.licence.filePreview);
    const getLicenceFile = useSelector((state) => state.onboardingThirdStep.licence.file);
    const getQualificationPreview = useSelector((state) => state.onboardingThirdStep.qualification.filePreview);
    const getIdExpires = useSelector((state) => state.onboardingThirdStep.idExpires);
    const getCredentialExpires = useSelector((state) => state.onboardingThirdStep.credentialExpires);
    const getDisabilityExpires = useSelector((state) => state.onboardingThirdStep.disabilityExpires);
    const { loading } = useSelector(state => state.front);
    const user = useSelector((state) => state.onboardingSecondStep);
		const { ws } = useParams();
		
    async function sendForm() {
			dispatch({ type: 'LOADING', payload:true});
			const t = moment().add(7, 'days');
			const today = t.valueOf();
			const date = getIdExpires.replace(/\//g, '-');
			const idDate = moment(date).valueOf();;
			const t2 = moment().add(7, 'days');
			const today2 = t2.valueOf();
			const date2 = getCredentialExpires.replace(/\//g, '-');
			const credDate = moment(date2).valueOf();
			const date3 = getDisabilityExpires.replace(/\//g, '-');
			const disDate = moment(date3).valueOf();
        try {
            const date = new RegExp("^([0-2][0-9]||3[0-1])/(0[0-9]||1[0-2])/([0-9][0-9])?[0-9][0-9]$");
            if (!date.test(getIdExpires) || !date.test(getCredentialExpires)) {
                swal('Aviso', 'La fecha que ingresaste es inválida', 'warning');
                return null;
            };
            if (user.disability !== "0-NINGUNA") {
                if (!date.test(getDisabilityExpires)) {
                    swal('Aviso', 'La fecha que ingresaste es inválida', 'warning');
                    return null;
                }
                if (today >= disDate) {
                    swal('Aviso', 'La fecha de vencimiento del certificado es incorrecta', 'warning')
                    return null;
                }
            }
            if (today >= idDate) {
                swal('Aviso', 'La fecha de vencimiento de DNI es incorrecta', 'warning')
                return null;
            }
            if (today2 >= credDate) {
                swal('Aviso', 'La fecha de vencimiento de la credencial es incorrecta', 'warning')
                return null;
            }
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
            await Axios.post(transport_register, data, config);
            await swal({
                title: "Formulario enviado",
                text: "En breve será redireccionado a la página de inicio",
                icon: "success",
                buttons: true,
                timer: 3000
						});
						history.push(`/${getUserData.ws}/transportUserActive`);
        } catch (error) {
            console.error(error);
            swal('Error', 'Hubo un error en el envío del Formulario, será redireccionado al registro nuevamente...', 'warning');
            setTimeout(function () {
                history.push(`/${ws}/transportRegister`);
            }, 2000);
        } finally {
            dispatch({ type: 'LOADING', payload:false})
        }
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
    const validateForm = !getIdPreview || !getLicencePreview || !getIdExpires || !getCredentialExpires;

    return (
        <>
            <GenericHeader>Registro</GenericHeader>
            {loading && <CustomUmaLoader />}
            <div className="TransportOnboardingThirdStep">
                <div className="uploadDocumentationWrapper">
                    <div className="d-flex justify-content-center">
                        <div className="columnUpload">
                            <div className="uploadMandatoryWrapper d-flex justify-content-center">
                                <div className="title">DNI</div>
                                {getIdPreview ? '' : <span className="mandatoryField">&nbsp;*</span>}
                            </div>
                            <label htmlFor="upload-photo-dni" className="btn btn-active inputfile">
                                <div className="imgPreview">
                                    {getIdPreview ?
                                        <img src={getIdPreview} alt="DNI" />
                                        : <FontAwesomeIcon className="folder" icon={faFolderOpen} />
                                    }
                                </div>
                                <FontAwesomeIcon className="addDoc" icon={faPlusCircle} />
                            </label>
                            <input type="file"
                                name="Cargar DNI"
                                id="upload-photo-dni"
                                onChange={(e) => buildImages('ADD_ID_THIRD_STEP', e.target.files[0])} />
                        </div>
                        <div className="columnUpload">
                            <div className="uploadMandatoryWrapper d-flex justify-content-center">
                                <div className="title">Credencial</div>
                                {getLicencePreview ? '' : <span className="mandatoryField">&nbsp;*</span>}
                            </div>
                            <label htmlFor="upload-photo-licence" className="btn btn-active inputfile">
                                <div className="imgPreview">
                                    {getLicencePreview ?
                                        <img src={getLicencePreview} alt="Credencial" />
                                        : <FontAwesomeIcon className="folder" icon={faFolderOpen} />
                                    }
                                </div>
                                <FontAwesomeIcon className="addDoc" icon={faPlusCircle} />
                            </label>
                            <input type="file"
                                name="Cargar Credencial"
                                id="upload-photo-licence"
                                onChange={(e) => buildImages('ADD_LICENCE_THIRD_STEP', e.target.files[0])} />
                        </div>
                        {user.disability !== "0-NINGUNA" ?
                            <div className="columnUpload">
                                <div className="title">Certificado</div>
                                <label htmlFor="upload-photo-disability" className="btn btn-active inputfile">
                                    <div className="imgPreview">
                                        {getQualificationPreview ?
                                            <img src={getQualificationPreview} alt="Certificado" />
                                            : <FontAwesomeIcon className="folder" icon={faFolderOpen} />
                                        }
                                    </div>

                                    <FontAwesomeIcon className="addDoc" icon={faPlusCircle} />
                                </label>
                                <input type="file"
                                    name="Cargar Discapacidad"
                                    id="upload-photo-disability"
                                    onChange={(e) => buildImages('ADD_QUALIFICATION_THIRD_STEP', e.target.files[0])} />
                            </div>
                            : ''}
                    </div>
                </div>
                <div className="dateDocumentExpiresWrapper">
                    <div className="titleThirdStep">Vencimiento de DNI</div>
                    {getIdExpires ? '' : <span className="mandatoryField">* Obligatorio</span>}
                    <Cleave

                        placeholder="dd/mm/aaaa"
                        options={{ date: true, delimiter: '/', datePattern: ['d', 'm', 'Y'] }}
                        onChange={(e) => dispatch({ type: 'ADD_ID_EXPIRATION_THIRD_STEP', payload: e.target.value })}
                        value={getIdExpires}
                        className="form-control expireDate"
                    />
                    <div className="titleThirdStep">Vencimiento de Credencial</div>
                    {getCredentialExpires ? '' : <span className="mandatoryField">* Obligatorio</span>}
                    <Cleave
                        placeholder="dd/mm/aaaa"
                        options={{ date: true, delimiter: '/', datePattern: ['d', 'm', 'Y'] }}
                        onChange={(e) => dispatch({ type: 'ADD_CREDENTIAL_EXPIRATION_THIRD_STEP', payload: e.target.value })}
                        value={getCredentialExpires}
                        className="form-control expireDate"
                    />
                    {user.disability !== "0-NINGUNA" ?
                        <div>
                            <div className="titleThirdStep">Vencimiento de Certificado de discapacidad</div>
                            {getDisabilityExpires ? '' : <span className="mandatoryField">* Obligatorio</span>}
                            <Cleave
                                placeholder="dd/mm/aaaa"
                                options={{ date: true, delimiter: '/', datePattern: ['d', 'm', 'Y'] }}
                                onChange={(e) => dispatch({ type: 'ADD_DISABILITY_EXPIRATION_THIRD_STEP', payload: e.target.value })}
                                value={getDisabilityExpires}
                                className="form-control expireDate"
                            />
                        </div>
                        : ''}
                </div>
                <div className="buttonsContainer">
                    <div className="buttonContainer">
                        <button
                            disabled={validateForm}
                            className="btn btn-active"
                            onClick={sendForm}
                        >
                            Enviar
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TransportOnboarding;
